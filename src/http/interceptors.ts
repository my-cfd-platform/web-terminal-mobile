import axios, { AxiosResponse } from 'axios';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import apiResponseCodeMessages from '../constants/apiResponseCodeMessages';
import { MainAppStore } from '../store/MainAppStore';
import RequestHeaders from '../constants/headers';
import API_LIST from '../helpers/apiList';
import { DebugTypes } from '../types/DebugTypes';
import { debugLevel, doNotSendRequest } from '../constants/debugConstants';
import { getProcessId } from '../helpers/getProcessId';
import API from '../helpers/API';
import { getCircularReplacer } from '../helpers/getCircularReplacer';
import { getStatesSnapshot } from '../helpers/getStatesSnapshot';
import { CLIENTS_REQUEST } from '../constants/interceptorsConstants';
import requestOptions from '../constants/requestOptions';
import AUTH_API_LIST from '../helpers/apiListAuth';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import mixapanelProps from '../constants/mixpanelProps';

const openNotification = (errorText: string, mainAppStore: MainAppStore, isReload?: boolean) => {
  mainAppStore.rootStore.badRequestPopupStore.setMessage(errorText);
  mainAppStore.rootStore.notificationStore.setNotification(errorText);
  if (isReload) {
    mainAppStore.rootStore.badRequestPopupStore.openModalReload();
  } else {
    mainAppStore.rootStore.notificationStore.openNotification();
  }
};

const injectInerceptors = (mainAppStore: MainAppStore) => {
  // for multiple requests
  let isRefreshing = false;
  let failedQueue: any[] = [];

  const getApiUrl = (url: string) => {
    const urlString = new URL(url);
    if (urlString.search) {
      if (urlString.href.includes('KeyValue')) {
        return urlString.href
          .split(urlString.origin)[1];
      } else {
        return urlString.href
          .split(urlString.search)[0]
          .split(urlString.origin)[1];
      }
    }
    return urlString.href.split(urlString.origin)[1];
  };

  const addErrorUrl = (str: string) => {
    const url = getApiUrl(str);
    const newRequestErrorStack = mainAppStore.requestErrorStack;
    newRequestErrorStack.push(url)
    mainAppStore.setRequestErrorStack(newRequestErrorStack);
    console.log('add');
    console.log(mainAppStore.requestErrorStack);
  };

  const removeErrorUrl = (str: any) => {
    const url = getApiUrl(str);
    const newRequestErrorStack = mainAppStore.requestErrorStack.filter((elem) => elem !== url);
    mainAppStore.setRequestErrorStack(newRequestErrorStack);
    console.log('remove');
    console.log(mainAppStore.requestErrorStack);
  };

  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    failedQueue = [];
  };

  axios.interceptors.request.use((config) => {
    if (config.url === API_LIST.INIT.GET) {
      return config;
    }
    const isAuthorized = `${mainAppStore.isAuthorized}`;
    const request_url = getApiUrl(config?.url || "");
    const initBy = CLIENTS_REQUEST.includes(request_url) ? requestOptions.CLIENT : requestOptions.BACKGROUND;
    let newData = config.data;
    if (typeof newData === 'object') {
      if (newData instanceof FormData) {
        newData.append('initBy', initBy);
        newData.append('isAuthorized', isAuthorized);
      } else {
        newData.initBy = initBy;
        newData.isAuthorized = newData.isAuthorized || isAuthorized;
      }
    } else {
      const parsedData = JSON.parse(newData);
      parsedData.initBy = initBy;
      parsedData.isAuthorized = parsedData.isAuthorized || isAuthorized;
      newData = JSON.stringify(parsedData);
    }
    config.data = newData;
    return config;
  });

  // TODO: research init flow
  axios.interceptors.response.use(
    function (response: AxiosResponse) {
      if (response.config.url === API_LIST.INIT.GET) {
        return Promise.resolve(response);
      }

      if (
        response.data.status !== OperationApiResponseCodes.TechnicalError &&
        response.data.status !==
        OperationApiResponseCodes.InvalidUserNameOrPassword &&
        response.config
      ) {
        if (mainAppStore.requestErrorStack.length > 0) {
          let requestUrl = response?.config?.url;
          if (
            response?.config?.params?.key &&
            response?.config?.url?.includes('KeyValue')
          ) {
            requestUrl = `${requestUrl}?key=${response?.config?.params.key}`
          }
          removeErrorUrl(requestUrl);
        }

        if (mainAppStore.requestErrorStack.length === 0) {
          mainAppStore.requestReconnectCounter = 0;
          mainAppStore.rootStore.badRequestPopupStore.closeModalTimeout();
          mainAppStore.rootStore.badRequestPopupStore.stopRecconect();
        }
        if (mainAppStore.rootStore.serverErrorPopupStore.isActive) {
          mainAppStore.rootStore.serverErrorPopupStore.closeModal();
        }
        return Promise.resolve(response);
      }

      switch (response.data.status) {
        case OperationApiResponseCodes.TechnicalError: {axios.request(response.config);
          if (!mainAppStore.rootStore.serverErrorPopupStore.isActive) {
            mainAppStore.rootStore.serverErrorPopupStore.openModal();
          }
          setTimeout(() => {
            axios.request(response.config);
            if (!mainAppStore.rootStore.serverErrorPopupStore.isActive) {
              mainAppStore.rootStore.serverErrorPopupStore.openModal();
            }
          }, +mainAppStore.connectTimeOut);
          return Promise.reject(
            apiResponseCodeMessages[OperationApiResponseCodes.TechnicalError]
          );
        }
        case OperationApiResponseCodes.InvalidUserNameOrPassword: {
          mainAppStore.signOut();
          break;
        }

        case OperationApiResponseCodes.Ok: {
          if (mainAppStore.rootStore.serverErrorPopupStore.isActive) {
            mainAppStore.rootStore.serverErrorPopupStore.closeModal();
          }
          break;
        }

        default:
          break;
      }

      return Promise.resolve(response);
    },

    async function (error) {
      const excludeReconectList = [
        API_LIST.INSTRUMENTS.FAVOURITES,
      ];
      const excludeCheckErrorFlow = [
        API_LIST.DEBUG.POST,
        API_LIST.ONBOARDING.STEPS,
        API_LIST.WELCOME_BONUS.GET,
      ];

      const sendClientLog = () => {
        if (
          mainAppStore.isAuthorized &&
          !doNotSendRequest.includes(error.response?.status)
        ) {
          const objectToSend = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            status: error.response?.status,
          };
          const jsonLogObject = {
            error: JSON.stringify(objectToSend),
            snapShot: JSON.stringify(
              getStatesSnapshot(mainAppStore),
              getCircularReplacer()
            ),
          };
          const params: DebugTypes = {
            level: debugLevel.TRANSPORT,
            processId: getProcessId(),
            message:
              error.response?.statusText || error?.message || 'unknown error',
            jsonLogObject: JSON.stringify(jsonLogObject),
          };
          API.postDebug(params);
        }
      };

      let requestUrl: string = error?.config?.url === API_LIST.INIT.GET
        ? error?.request?.responseURL
        : error?.config?.url;
      if (error?.config?.params?.key && error?.config?.url?.includes('KeyValue')) {
        requestUrl = `${requestUrl}?key=${error?.config?.params?.key}`
      }
      const originalRequest = error.config;

      if (excludeCheckErrorFlow.includes(getApiUrl(requestUrl))) {
        return Promise.reject(error);
      }

      if (
        (
          getApiUrl(requestUrl).includes(API_LIST.ONBOARDING.STEPS) ||
          getApiUrl(requestUrl).includes(API_LIST.WELCOME_BONUS.GET)
        ) &&
        error.response?.status !== 401 &&
        error.response?.status !== 403
      ) {
        sendClientLog();
        return Promise.reject(error);
      }

      if (
        error.response?.status === 401 &&
        getApiUrl(requestUrl).includes(AUTH_API_LIST.TRADER.REFRESH_TOKEN)
      ) {
        mainAppStore.requestReconnectCounter = 0;
        mainAppStore.rootStore.badRequestPopupStore.closeModal();
        mainAppStore.rootStore.badRequestPopupStore.stopRecconect();
        mainAppStore.signOut();
      }

      const repeatRequest = (callback: any) => {
        mainAppStore.requestReconnectCounter += 1;
        if (
          !(excludeReconectList.includes(getApiUrl(requestUrl)) && error.config.method === 'get') &&
          mainAppStore.requestErrorStack.filter((elem) => elem === getApiUrl(requestUrl)).length > 2
        ) {
          mainAppStore.rootStore.badRequestPopupStore.openModalTimeout();
        }
        setTimeout(() => {
          callback(originalRequest);
        }, +mainAppStore.connectTimeOut);
      };

      sendClientLog();

      // check for formData
      let finalJSON = '';
      if (typeof error.config.data === 'object') {
        const dataObject = {};
        error.config.data.forEach((value: any, key: any) => {
          // @ts-ignore
          dataObject[key] = value;
        });
        finalJSON = JSON.stringify(dataObject);
      } else if (typeof error.config.data === 'undefined') {
        finalJSON = JSON.stringify({ initBy: requestOptions.BACKGROUND });
      } else {
        finalJSON = error.config.data;
      }
      // ---
      console.log(finalJSON);
      console.log(error.message);
      console.log(error.config);
      let isTimeOutError = error.message === requestOptions.TIMEOUT;
      let isReconnectedRequest =
        JSON.parse(finalJSON).initBy === requestOptions.BACKGROUND;

      if (
        isReconnectedRequest &&
        error.response?.status !== 401 &&
        !(
          getApiUrl(requestUrl).includes(API_LIST.INSTRUMENTS.FAVOURITES) &&
          error.config.method === 'get'
        )
      ) {
        addErrorUrl(requestUrl);
      }

      const urlString = new URL(requestUrl).href;

      // mixpanel
      if (isTimeOutError && !requestUrl.includes(API_LIST.INIT.GET)) {
        mixpanel.track(mixpanelEvents.TIMEOUT, {
          [mixapanelProps.REQUEST_URL]: urlString,
        });
      }

      if (error.response?.status && !requestUrl.includes(API_LIST.INIT.GET)) {
        if (error.response?.status.toString().includes('50')) {
          mixpanel.track(mixpanelEvents.SERVER_ERROR_50X, {
            [mixapanelProps.REQUEST_URL]: urlString,
            [mixapanelProps.ERROR_TEXT]: error.response?.status,
          });
        }
        if (error.response?.status.toString().includes('40')) {
          mixpanel.track(mixpanelEvents.SERVER_ERROR_40X, {
            [mixapanelProps.REQUEST_URL]: urlString,
            [mixapanelProps.ERROR_TEXT]: error.response?.status,
          });
        }
      }
      // --- mixpanel

      if (isTimeOutError && !isReconnectedRequest) {
        mainAppStore.rootStore.notificationStore.isSuccessfull = false;
        openNotification('Timeout connection error', mainAppStore);
      }

      if (isTimeOutError && isReconnectedRequest) {
        return new Promise((resolve, reject) => {
          repeatRequest(() => {
            if (JSON.parse(finalJSON).isAuthorized === `${mainAppStore.isAuthorized}`) {
              resolve(axios(originalRequest));
            } else {
              mainAppStore.setRequestErrorStack([]);
              mainAppStore.requestReconnectCounter = 0;
              mainAppStore.rootStore.badRequestPopupStore.closeModal();
              mainAppStore.rootStore.badRequestPopupStore.stopRecconect();
              reject(error);
            }
          });
        });
      }

      if (!error.response?.status && !isTimeOutError && !isReconnectedRequest) {
        openNotification(error.message, mainAppStore, true);
      }

      if (error.response?.status) {
        if (
          (error.response?.status !== 401 &&
            (error.response?.status !== 403 || !mainAppStore.isAuthorized) &&
            (
              error.response?.status.toString().includes('40') ||
              error.response?.status.toString().includes('41') ||
              error.response?.status.toString().includes('42') ||
              error.response?.status.toString().includes('43') ||
              error.response?.status.toString().includes('44') ||
              error.response?.status.toString().includes('45') ||
              error.response?.status.toString().includes('46') ||
              error.response?.status.toString().includes('49')
            )
          ) ||
          error.response?.status.toString().includes('50') ||
          error.response?.status.toString().includes('51') ||
          error.response?.status.toString().includes('52') ||
          error.response?.status.toString().includes('53') ||
          error.response?.status.toString().includes('56') ||
          error.response?.status.toString().includes('59')
        ) {
          if (isReconnectedRequest) {
            return new Promise((resolve, reject) => {
              repeatRequest(() => {
                if (JSON.parse(finalJSON).isAuthorized === `${mainAppStore.isAuthorized}`) {
                  resolve(axios(originalRequest));
                } else {
                  mainAppStore.setRequestErrorStack([]);
                  mainAppStore.requestReconnectCounter = 0;
                  mainAppStore.rootStore.badRequestPopupStore.closeModal();
                  mainAppStore.rootStore.badRequestPopupStore.stopRecconect();
                  reject(error);
                }
              });
            });
          } else {
            openNotification(error.message, mainAppStore, true);
          }
        }
      }

      switch (error.response?.status) {
        case 401:
          if (!mainAppStore.isAuthorized) {
            if (getApiUrl(requestUrl).includes(AUTH_API_LIST.TRADER.LP_LOGIN)) {
              addErrorUrl(requestUrl);
              return new Promise((resolve, reject) => {
                repeatRequest(() => resolve(axios(originalRequest)));
              });
            } else if (
              getApiUrl(requestUrl).includes(AUTH_API_LIST.PERSONAL_DATA.GET) ||
              JSON.parse(finalJSON).isAuthorized !== `${mainAppStore.isAuthorized}`
            ){
              return Promise.reject(error);
            } else {
              openNotification(error.message, mainAppStore, true);
            }
          } else {
            if (mainAppStore.refreshToken && !originalRequest._retry) {
              if (isRefreshing) {
                try {
                  const token = await new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                  });
                  originalRequest.headers[RequestHeaders.AUTHORIZATION] = token;
                  return await axios(originalRequest);
                } catch (err) {
                  return await Promise.reject(err);
                }
              }

              originalRequest._retry = true;
              isRefreshing = true;

              return new Promise(function (resolve, reject) {
                mainAppStore
                  .postRefreshToken()
                  .then(() => {
                    axios.defaults.headers[RequestHeaders.AUTHORIZATION] =
                      mainAppStore.token;

                    error.config.headers[RequestHeaders.AUTHORIZATION] =
                      mainAppStore.token;
                    originalRequest._retry = false;

                    processQueue(null, mainAppStore.token);
                    resolve(axios(originalRequest));
                  })
                  .catch((err) => {
                    mainAppStore.setRefreshToken('');
                    processQueue(err, null);
                    reject(err);
                  })
                  .finally(() => {
                    mainAppStore.setIsLoading(false);
                    isRefreshing = false;
                  });
              });
            } else {
              mainAppStore.setRequestErrorStack([]);
              mainAppStore.requestReconnectCounter = 0;
              mainAppStore.rootStore.badRequestPopupStore.closeModal();
              mainAppStore.rootStore.badRequestPopupStore.stopRecconect();
              mainAppStore.signOut();
            }
          }
          break;

        case 403: {
          if (!mainAppStore.isAuthorized) {
            if (getApiUrl(requestUrl).includes(AUTH_API_LIST.TRADER.LP_LOGIN)) {
              addErrorUrl(requestUrl);
              return new Promise((resolve, reject) => {
                repeatRequest(() => resolve(axios(originalRequest)));
              });
            } else if (getApiUrl(requestUrl).includes(AUTH_API_LIST.PERSONAL_DATA.GET)){
              return Promise.reject(error);
            } else {
              mainAppStore.rootStore.badRequestPopupStore.setMessage(
                error.message
              );
              mainAppStore.rootStore.badRequestPopupStore.openModal();
            }
          } else {
            failedQueue.forEach((prom) => {
              prom.reject();
            });
            mainAppStore.requestReconnectCounter = 0;
            mainAppStore.rootStore.badRequestPopupStore.closeModal();
            mainAppStore.rootStore.badRequestPopupStore.stopRecconect();
            mainAppStore.signOut();
          }
          break;
        }

        default:
          break;
      }

      return Promise.reject(error);
    }
  );
};
export default injectInerceptors;

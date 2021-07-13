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
import requestOptions from '../constants/requestOptions';
import mixpanelEvents from '../constants/mixpanelEvents';
import mixapanelProps from '../constants/mixpanelProps';
import mixpanel from 'mixpanel-browser';

const repeatRequest = (error: any, mainAppStore: MainAppStore) => {
  setTimeout(() => {
    axios.request(error.config);
  }, +mainAppStore.connectTimeOut);
};

const openNotification = (errorText: string, mainAppStore: MainAppStore) => {
  mainAppStore.rootStore.notificationStore.setNotification(errorText);
  mainAppStore.rootStore.notificationStore.isSuccessfull = false;
  mainAppStore.rootStore.notificationStore.openNotification();
};

const injectInerceptors = (mainAppStore: MainAppStore) => {
  // for multiple requests
  let isRefreshing = false;
  let failedQueue: any[] = [];

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

  // TODO: research init flow
  axios.interceptors.response.use(
    function (config: AxiosResponse) {
      if (config.data.result === OperationApiResponseCodes.TechnicalError) {
        return Promise.reject(
          apiResponseCodeMessages[OperationApiResponseCodes.TechnicalError]
        );
      }
      if (
        config.data.result ===
        OperationApiResponseCodes.InvalidUserNameOrPassword
      ) {
        mainAppStore.signOut();
      }
      return config;
    },

    async function (error) {
      if (
        error.response?.config?.url.includes(API_LIST.DEBUG.POST) ||
        error.response?.config?.url.includes(API_LIST.ONBOARDING.STEPS)
      ) {
        return await Promise.reject(error);
      }

      // logger
      if (
        mainAppStore.isAuthorized &&
        !doNotSendRequest.includes(error.response?.status) &&
        (error.response?.status ||
          error.config?.timeoutErrorMessage)
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
      // --- logger

      const isTimeOutError: boolean = error.message === requestOptions.TIMEOUT;
      const isReconnectedRequest: boolean =
        JSON.parse(error.config.data).initBy === requestOptions.BACKGROUND;

      if (isTimeOutError && isReconnectedRequest) {
        repeatRequest(error, mainAppStore);
      }

      if (isTimeOutError && !isReconnectedRequest) {
        openNotification('Timeout connection error', mainAppStore);
      }

      const urlString = new URL(error?.config?.url).href;
      // mixpanel
      if (isTimeOutError) {
        mixpanel.track(mixpanelEvents.TIMEOUT, {
          [mixapanelProps.REQUEST_URL]: urlString,
        });
      }

      if (error.response?.status) {
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

      if (!error.response?.status && !isTimeOutError && !isReconnectedRequest) {
        openNotification(error.message, mainAppStore);
      }


      if (error.response?.status) {
        if (
          (error.response?.status !== 401 &&
            error.response?.status !== 403 &&
            error.response?.status.toString().includes('40')) ||
          error.response?.status.toString().includes('50')
        ) {
          if (isReconnectedRequest) {
            repeatRequest(error, mainAppStore);
          } else {
            openNotification(
              error.response?.statusText ||
                apiResponseCodeMessages[
                  OperationApiResponseCodes.TechnicalError
                ],
              mainAppStore
            );
          }
        }
      }

      const originalRequest = error.config;

      switch (error.response?.status) {
        case 401:
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

                  processQueue(null, mainAppStore.token);
                  resolve(axios(originalRequest));
                })
                .catch((err) => {
                  mainAppStore.refreshToken = '';
                  processQueue(err, null);
                  reject(err);
                })
                .finally(() => {
                  mainAppStore.isLoading = false;
                  isRefreshing = false;
                });
            });
          } else {
            mainAppStore.signOut();
          }
          break;

        case 403: {
          failedQueue.forEach((prom) => {
            prom.reject();
          });
          mainAppStore.signOut();
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

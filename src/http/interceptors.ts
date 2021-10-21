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
    function (response: AxiosResponse) {
      if (response.data.result === OperationApiResponseCodes.TechnicalError) {
        axios.request(response.config);
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
      if (
        response.data.result ===
        OperationApiResponseCodes.InvalidUserNameOrPassword
      ) {
        mainAppStore.signOut();
      }

      if (response.data.result === OperationApiResponseCodes.Ok) {
        if (mainAppStore.rootStore.serverErrorPopupStore.isActive) {
          mainAppStore.rootStore.serverErrorPopupStore.closeModal();
        }
      }
      return Promise.resolve(response);
    },

    async function (error) {
      
      if (error.config?.url.includes(API_LIST.DEBUG.POST)) {
        return await Promise.reject(error);
      }
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
      if (!error.response?.status) {
        mainAppStore.rootStore.badRequestPopupStore.setRecconect();
        setTimeout(() => {
          axios.request(error.config);
          mainAppStore.rootStore.badRequestPopupStore.stopRecconect();
        }, +mainAppStore.connectTimeOut);
      }

      const originalRequest = error.config;



      if (
        (error.config?.url.includes(API_LIST.ONBOARDING.STEPS) ||
        error.config?.url.includes(API_LIST.WELCOME_BONUS.GET) || error.config?.url.includes(API_LIST.EDUCATION.LIST)) &&
        error.response?.status &&
        error.response?.status !== 401 &&
        error.response?.status !== 403 &&
        (error.response?.status.toString().includes('50') ||
          error.response?.status.toString().includes('40'))
      ) {
        return Promise.reject(error);
      }

      switch (error.response?.status) {
        case 400:
        case 500:
          function requestAgain() {
            axios.request(error.config);
            if (!mainAppStore.rootStore.serverErrorPopupStore.isActive) {
              mainAppStore.rootStore.serverErrorPopupStore.openModal();
            }
          }
          setTimeout(requestAgain, +mainAppStore.connectTimeOut);
          mainAppStore.isLoading = false;

          break;

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

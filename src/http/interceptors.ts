import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import apiResponseCodeMessages from '../constants/apiResponseCodeMessages';
import { MainAppStore } from '../store/MainAppStore';
import RequestHeaders from '../constants/headers';

const injectInerceptors = (tradingUrl: string, mainAppStore: MainAppStore) => {
  // TODO: research init flow
  mainAppStore.isInterceptorsInjected = true;
  axios.interceptors.response.use(
    function (config: AxiosResponse) {
      if (config.data.result === OperationApiResponseCodes.TechnicalError) {
        axios.request(config.config);
        if (!mainAppStore.rootStore.serverErrorPopupStore.isActive) {
          mainAppStore.rootStore.serverErrorPopupStore.openModal();
        }
        setTimeout(() => {
          axios.request(config.config);
          if (!mainAppStore.rootStore.serverErrorPopupStore.isActive) {
            mainAppStore.rootStore.serverErrorPopupStore.openModal();
          }
        }, +mainAppStore.connectTimeOut);
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

      if (config.data.result === OperationApiResponseCodes.Ok) {
        if (mainAppStore.rootStore.serverErrorPopupStore.isActive) {
          mainAppStore.rootStore.serverErrorPopupStore.closeModal();
        }
      }
      return config;
    },

    async function (error: AxiosError) {
      console.log(error);
      if (!error.response?.status) {
        mainAppStore.rootStore.badRequestPopupStore.setRecconect();
        setTimeout(() => {
          axios.request(error.config);
          mainAppStore.rootStore.badRequestPopupStore.stopRecconect();
        }, +mainAppStore.connectTimeOut);
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
          requestAgain();
          setTimeout(requestAgain, +mainAppStore.connectTimeOut);
          mainAppStore.isLoading = false;
          break;

        case 401:
          if (mainAppStore.refreshToken) {
            return mainAppStore
              .postRefreshToken()
              .then(() => {
                axios.defaults.headers[RequestHeaders.AUTHORIZATION] =
                  mainAppStore.token;

                error.config.headers[RequestHeaders.AUTHORIZATION] =
                  mainAppStore.token;

                return axios.request(error.config);
              })
              .catch(() => {
                mainAppStore.refreshToken = '';
              });
          } else {
            mainAppStore.signOut();
          }
          break;

        default:
          break;
      }

      return Promise.reject(error);
    }
  );
  axios.interceptors.request.use(function (config: AxiosRequestConfig) {
    // TODO: sink about eat
    if (IS_LIVE && tradingUrl && config.url && !config.url.includes('auth/')) {
      if (config.url.includes('://')) {
        const arrayOfSubpath = config.url.split('://')[1].split('/');
        const subPath = arrayOfSubpath.slice(1).join('/');
        config.url = `${tradingUrl}/${subPath}`;
      } else {
        config.url = `${tradingUrl}${config.url}`;
      }
    }
    config.headers[RequestHeaders.ACCEPT_LANGUAGE] = `${mainAppStore.lang}`;
    config.headers[RequestHeaders.CACHE_CONTROL] = 'no-cache, no-store';
   // config.headers[RequestHeaders.VARY] = '*';

    return config;
  });
};
export default injectInerceptors;

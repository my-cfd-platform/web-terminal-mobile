import { languagesList } from './../constants/languagesList';
import {
  LOCAL_STORAGE_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
  LOCAL_STORAGE_LANGUAGE,
  LAST_PAGE_VISITED,
  LOCAL_IS_NEW_USER,
  LOCAL_TARGET,
  LOCAL_HIDDEN_BALANCE,
} from './../constants/global';
import axios, { AxiosRequestConfig } from 'axios';
import {
  UserAuthenticate,
  UserRegistration,
  LpLoginParams,
} from '../types/UserInfo';
import { HubConnection } from '@aspnet/signalr';
import {
  AccountModelWebSocketDTO,
  AccountUserStatusDTO,
} from '../types/AccountsTypes';
import { action, observable, computed } from 'mobx';
import API from '../helpers/API';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import initConnection from '../services/websocketService';
import Topics from '../constants/websocketTopics';
import Axios from 'axios';
import RequestHeaders from '../constants/headers';
import KeysInApi from '../constants/keysInApi';
import { RootStore } from './RootStore';
import Fields from '../constants/fields';
import { ResponseFromWebsocket } from '../types/ResponseFromWebsocket';
import { PersonalDataKYCEnum } from '../enums/PersonalDataKYCEnum';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import injectInerceptors from '../http/interceptors';
import {
  InstrumentModelWSDTO,
  PriceChangeWSDTO,
} from '../types/InstrumentsTypes';
import { AskBidEnum } from '../enums/AskBid';
import { ServerError } from '../types/ServerErrorType';
import apiResponseCodeMessages from '../constants/apiResponseCodeMessages';
import { InitModel } from '../types/InitAppTypes';
import { CountriesEnum } from '../enums/CountriesEnum';
import mixapanelProps from '../constants/mixpanelProps';
import { PositionModelWSDTO } from '../types/Positions';
import { PendingOrderWSDTO } from '../types/PendingOrdersTypes';
import { BidAskModelWSDTO } from '../types/BidAsk';
import accountVerifySteps from '../constants/accountVerifySteps';
import { BrandEnum } from '../constants/brandingLinksTranslate';
import { debugLevel } from '../constants/debugConstants';
import { getProcessId } from '../helpers/getProcessId';
import { DebugTypes } from '../types/DebugTypes';
import { getCircularReplacer } from '../helpers/getCircularReplacer';
import { getStatesSnapshot } from '../helpers/getStatesSnapshot';
import { HintEnum } from '../enums/HintEnum';

interface MainAppStoreProps {
  token: string;
  refreshToken: string;
  isAuthorized: boolean;
  signIn: (credentials: UserAuthenticate) => void;
  signUp: (credentials: UserRegistration) => Promise<unknown>;
  activeSession?: HubConnection;
  isLoading: boolean;
  isInitLoading: boolean;
  activeAccount?: AccountModelWebSocketDTO;
  accounts: AccountModelWebSocketDTO[];
  setActiveAccount: (acc: AccountModelWebSocketDTO) => void;
  profileStatus: PersonalDataKYCEnum;
  isDemoRealPopup: boolean;
  isOnboarding: boolean;
  signalRReconnectTimeOut: string;
  initModel: InitModel;
  lang: CountriesEnum;
  activeAccountId: string;
  connectionSignalRTimer: NodeJS.Timeout | null;
  isPromoAccount: boolean;
  promo: string;
  showAccountSwitcher: boolean;
  connectTimeOut: number;
  dataLoading: boolean;
  isBalanceHidden: boolean;
}

// TODO: think about application initialization
// describe step by step init, loaders, async behaviour in app
// think about loader flags - global, local
const FIFTEEN_MINUTES = 900000;

export class MainAppStore implements MainAppStoreProps {
  @observable initModel: InitModel = {
    aboutUrl: '',
    androidAppLink: '',
    brandCopyrights: '',
    brandName: '',
    brandProperty: BrandEnum.Monfex,
    faqUrl: '',
    withdrawFaqUrl: '',
    favicon: '',
    gaAsAccount: '',
    iosAppLink: '',
    logo: '',
    policyUrl: '',
    supportUrl: '',
    termsUrl: '',
    tradingUrl: '/',
    authUrl: '',
    miscUrl: '',
    mixpanelToken: '582507549d28c813188211a0d15ec940',
    recaptchaToken: '',
    androidAppId: '',
    iosAppId: '',
    mobileAppLogo: '',
  };
  @observable isLoading = false;
  @observable isInitLoading = true;
  @observable isDemoRealPopup = false;
  @observable isOnboarding = false;
  @observable isAuthorized = true;
  @observable activeSession?: HubConnection;
  @observable activeAccount?: AccountModelWebSocketDTO;
  @observable accounts: AccountModelWebSocketDTO[] = [];
  @observable profileStatus: PersonalDataKYCEnum =
    PersonalDataKYCEnum.NotVerified;
  @observable profilePhone = '';
  @observable lang = CountriesEnum.EN;
  @observable token = '';
  @observable refreshToken = '';
  rootStore: RootStore;
  signalRReconnectTimeOut = '';
  @observable socketError = false;
  @observable activeAccountId: string = '';
  @observable connectionSignalRTimer: NodeJS.Timeout | null = null;
  @observable signUpFlag: boolean = false;
  @observable lpLoginFlag: boolean = false;
  @observable isVerification: boolean = false;
  @observable balanceWas: number = 0;
  @observable isPromoAccount = false;
  @observable promo = '';
  @observable showAccountSwitcher: boolean = false;
  @observable onboardingJustClosed: boolean = false;
  @observable connectTimeOut = 10000;
  @observable activeACCLoading = true;
  @observable isBalanceHidden = false;
  @observable isAdditionalRequestSent = false;
  @observable isWithdrawRequestSent = false;

  websocketConnectionTries = 0;

  paramsAsset: string | null = null;
  paramsMarkets: string | null = null;
  paramsPortfolioTab: string | null = null;
  paramsPortfolioActive: string | null = null;
  paramsPortfolioPending: string | null = null;
  paramsPortfolioClosed: string | null = null;
  paramsDeposit: boolean = false;
  paramsKYC: boolean = false;
  paramsWithdraw: boolean = false;
  paramsSecurity: boolean = false;
  paramsBalanceHistory: boolean = false;

  @observable dataLoading = false;
  @observable signalRReconectCounter = 0;

  @observable debugSocketMode = false;
  @observable debugDontPing = false;
  @observable debugSocketReconnect = false;

  @observable requestErrorStack: string[] = [];
  @observable requestReconnectCounter: number = 0;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) || '';
    this.promo = localStorage.getItem(LOCAL_TARGET) || '';
    this.refreshToken =
      localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY) || '';
    Axios.defaults.headers[RequestHeaders.AUTHORIZATION] = this.token;
    Axios.defaults.timeout = this.connectTimeOut;

    const newLang =
      localStorage.getItem(LOCAL_STORAGE_LANGUAGE) ||
      (window.navigator.language &&
      languagesList.includes(
        window.navigator.language.slice(0, 2).toLowerCase()
      )
        ? window.navigator.language.slice(0, 2).toLowerCase()
        : CountriesEnum.EN);

    // @ts-ignore
    this.lang =
      localStorage.getItem(LOCAL_STORAGE_LANGUAGE) ||
      (window.navigator.language &&
      languagesList.includes(
        window.navigator.language.slice(0, 2).toLowerCase()
      )
        ? window.navigator.language.slice(0, 2).toLowerCase()
        : CountriesEnum.EN);
    // @ts-ignore
    this.lang = newLang;
    document.querySelector('html')?.setAttribute('lang', newLang);
    injectInerceptors(this);
  }

  initApp = async () => {
    try {
      const initModel = await API.getInitModel();
      this.initModel = initModel;
      this.setInterceptors();
    } catch (error) {
      await this.initApp();
      // this.isInitLoading = false;
      // this.rootStore.badRequestPopupStore.openModal();
      // this.rootStore.badRequestPopupStore.setMessage(`${error}`);
    }
  };

  setInterceptors = () => {
    axios.interceptors.request.use((config: AxiosRequestConfig) => {
      if (
        IS_LIVE &&
        this.initModel.tradingUrl &&
        config.url &&
        !config.url.includes('auth/') &&
        !config.url.includes('misc')
      ) {
        if (config.url.includes('://')) {
          const arrayOfSubpath = config.url.split('://')[1].split('/');
          const subPath = arrayOfSubpath.slice(1).join('/');
          config.url = `${this.initModel.tradingUrl}/${subPath}`;
        } else {
          config.url = `${this.initModel.tradingUrl}${config.url}`;
        }
      }

      config.headers[RequestHeaders.ACCEPT_LANGUAGE] = `${this.lang}`;
      return config;
    });
  };

  @action
  handleSocketCloseError = (error: any) => {
    if (error) {
      if (this.websocketConnectionTries < 3) {
        this.websocketConnectionTries = this.websocketConnectionTries + 1; // TODO: mobx strange behavior with i++;
        this.handleInitConnection();
      } else {
        window.location.reload();
        return;
      }
    }

    if (this.isAuthorized) {
      const objectToSend = {
        context: 'socket',
        urlAPI: this.initModel.tradingUrl,
        urlMiscAPI: this.initModel.miscUrl,
        urlAuthAPI: this.initModel.authUrl,
        platform: 'Web-mobile',
        config: error?.config || 'config is missing',
        message: error?.message || 'message is empty',
        name: error?.name || 'name is empty',
        stack: error?.stack || 'stack is empty',
      };
      const jsonLogObject = {
        error: JSON.stringify(objectToSend),
        snapShot: JSON.stringify(
          getStatesSnapshot(this),
          getCircularReplacer()
        ),
      };
      const params: DebugTypes = {
        level: debugLevel.TRANSPORT,
        processId: getProcessId(),
        message: error?.message || 'unknown error',
        jsonLogObject: JSON.stringify(jsonLogObject),
      };
      API.postDebug(params);
    }
  };

  handleNewInitConnection = async (token = this.token) => {
    this.setIsLoading(true);
    const connectionString = IS_LOCAL
      ? WS_HOST
      : `${this.initModel.tradingUrl}/signalr`;
    const connection = initConnection(connectionString);

    const debugSocketReconnectFunction = () => {
      if (this.debugSocketReconnect) {
        console.log('Return error socket init');
        return Promise.reject('Error socket init');
      }
    };

    const connectToWebocket = async () => {
      try {
        await debugSocketReconnectFunction();
        await connection.start();
        this.websocketConnectionTries = 0;
        try {
          await connection.send(Topics.INIT, token);
          this.isAuthorized = true;
          this.activeSession = connection;
          this.rootStore.serverErrorPopupStore.closeModal();
          this.pingPongConnection();
        } catch (error) {
          this.isAuthorized = false;
          this.isInitLoading = false;
        }
      } catch (error) {
        this.isInitLoading = false;
        setTimeout(
          connectToWebocket,
          this.signalRReconnectTimeOut ? +this.signalRReconnectTimeOut : 3000
        );
      }
    };

    connectToWebocket();

    connection.on(Topics.UNAUTHORIZED, () => {
      if (this.refreshToken) {
        this.postRefreshToken()
          .then(() => {
            axios.defaults.headers[RequestHeaders.AUTHORIZATION] = this.token;
            if (this.activeSession) {
              this.activeSession.stop();
            }
            this.handleInitConnection();
          })
          .catch(() => {
            this.signOut();
          });
      } else {
        this.signOut();
      }
    });

    connection.on(
      Topics.ACCOUNTS,
      (response: ResponseFromWebsocket<AccountModelWebSocketDTO[]>) => {
        this.accounts = response.data;
        this.getActiveAccount();

        mixpanel.people.set({
          [mixapanelProps.ACCOUNTS]: response.data.map((item) => item.id),
          [mixapanelProps.FUNDED_TRADER]: `${response.data.some(
            (item) => item.isLive && item.balance > 0
          )}`,
        });
      }
    );

    connection.on(
      Topics.UPDATE_ACCOUNT,
      (response: ResponseFromWebsocket<AccountModelWebSocketDTO>) => {
        this.accounts = this.accounts.map((account) =>
          account.id === response.data.id ? response.data : account
        );
        if (
          response.data.balance !== 0 &&
          this.rootStore.userProfileStore.isBonus &&
          !this.isPromoAccount
        ) {
          try {
            this.rootStore.userProfileStore.getUserBonus(
              this.initModel.miscUrl
            );
          } catch (error) {}
        }
      }
    );

    connection.on(
      Topics.INSTRUMENTS,
      (response: ResponseFromWebsocket<InstrumentModelWSDTO[]>) => {
        if (response.accountId === this.activeAccountId) {
          response.data.forEach((item) => {
            this.rootStore.quotesStore.setQuote({
              ask: {
                c: item.ask || 0,
                h: 0,
                l: 0,
                o: 0,
              },
              bid: {
                c: item.bid || 0,
                h: 0,
                l: 0,
                o: 0,
              },
              dir: AskBidEnum.Buy,
              dt: Date.now(),
              id: item.id,
            });
          });
          this.rootStore.instrumentsStore.setInstruments(response.data);
        }
      }
    );

    connection.on(
      Topics.SERVER_ERROR,
      (response: ResponseFromWebsocket<ServerError>) => {
        console.log(Topics.SERVER_ERROR);
        this.isInitLoading = false;
        this.isLoading = false;
        this.handleSocketServerError(response);
      }
    );

    connection.onclose((error) => {
      // TODO: https://monfex.atlassian.net/browse/WEBT-510
      this.handleSocketCloseError(error);

      this.socketError = true;
      this.isLoading = false;
      this.isInitLoading = false;
      this.rootStore.badRequestPopupStore.openModal();
      this.rootStore.badRequestPopupStore.setMessage(
        error?.message ||
          apiResponseCodeMessages[OperationApiResponseCodes.SystemError]
      );

      if (error) {
        console.log('websocket error: ', error);
        console.log('=====/=====');
      }

      this.signalRReconectCounter = 0;
    });

    connection.on(
      Topics.ACTIVE_POSITIONS,
      (response: ResponseFromWebsocket<PositionModelWSDTO[]>) => {
        if (response.accountId === this.activeAccountId) {
          this.rootStore.quotesStore.setActivePositions(response.data);
        }
      }
    );

    connection.on(
      Topics.PENDING_ORDERS,
      (response: ResponseFromWebsocket<PendingOrderWSDTO[]>) => {
        if (this.activeAccountId === response.accountId) {
          this.rootStore.quotesStore.pendingOrders = response.data;
        }
      }
    );

    connection.on(
      Topics.INSTRUMENT_GROUPS,
      (response: ResponseFromWebsocket<InstrumentModelWSDTO[]>) => {
        if (this.activeAccountId === response.accountId) {
          this.rootStore.instrumentsStore.setInstrumentGroups(response.data);
          if (response.data.length) {
            this.rootStore.instrumentsStore.activeInstrumentGroupId =
              response.data[0].id;
          }
        }
      }
    );

    connection.on(
      Topics.PRICE_CHANGE,
      (response: ResponseFromWebsocket<PriceChangeWSDTO[]>) => {
        this.rootStore.instrumentsStore.setPricesChanges(response.data);
      }
    );

    connection.on(
      Topics.UPDATE_ACTIVE_POSITION,
      (response: ResponseFromWebsocket<PositionModelWSDTO>) => {
        if (response.accountId === this.activeAccountId) {
          this.rootStore.quotesStore.setActivePositions(
            this.rootStore.quotesStore.activePositions.map((item) =>
              item.id === response.data.id ? response.data : item
            )
          );
        }
      }
    );

    connection.on(
      Topics.UPDATE_PENDING_ORDER,
      (response: ResponseFromWebsocket<PendingOrderWSDTO>) => {
        if (response.accountId === this.activeAccountId) {
          this.rootStore.quotesStore.pendingOrders = this.rootStore.quotesStore.pendingOrders.map(
            (item) => (item.id === response.data.id ? response.data : item)
          );
        }
      }
    );

    connection.on(
      Topics.BID_ASK,
      (response: ResponseFromWebsocket<BidAskModelWSDTO[]>) => {
        if (!response.data.length) {
          return;
        }
        response.data.forEach((item) => {
          this.rootStore.quotesStore.setQuote(item);
        });
      }
    );

    connection.on(Topics.PONG, (response: ResponseFromWebsocket<any>) => {
      if (this.debugSocketMode) {
        console.log('cancel ping');
        return;
      }

      if (response.now) {
        this.signalRReconectCounter = 0;
        this.rootStore.badRequestPopupStore.stopRecconect();
      }
    });

    connection.on(
      Topics.ACCOUNT_TYPE_UPDATE,
      (response: ResponseFromWebsocket<AccountUserStatusDTO>) => {
        this.rootStore.userProfileStore.updateStatusTypes(
          response.data.accountTypeModels
        );
        this.rootStore.userProfileStore.amountToNextAccountType =
          response.data.amountToNextAccountType;
        this.rootStore.userProfileStore.currentAccountTypeId =
          response.data.currentAccountTypeId;
        this.rootStore.userProfileStore.percentageToNextAccountType =
          response.data.currentAccountTypeProgressPercentage;

        this.rootStore.userProfileStore.setActiveStatus(
          response.data.currentAccountTypeId
        );

        if (response.data.currentAccountTypeId) {
          // set default status
          this.rootStore.userProfileStore.setKVActiveStatus(
            response.data.currentAccountTypeId,
            true
          );
        }
      }
    );
  };

  handleInitConnection = async (token = this.token) => {
    try {
      if (this.activeSession) {
        await this.activeSession.stop();
        this.activeSession = undefined;
      }
      this.websocketConnectionTries = 0;

      this.handleNewInitConnection(token);
    } catch (error) {}
  };

  @action
  socketPing = () => {
    if (this.activeSession) {
      try {
        this.activeSession?.send(Topics.PING);
      } catch (error) {}
    }
  };

  @action
  pingPongConnection = () => {
    let timer: any;

    if (this.activeSession && this.isAuthorized) {
      if (this.signalRReconectCounter === 3) {
        this.rootStore.badRequestPopupStore.setRecconect();

        this.activeSession?.stop().finally(() => {
          this.handleInitConnection();
          this.debugSocketMode = false;
          this.debugDontPing = false;
        });
        return;
      }

      if (!this.debugDontPing) {
        this.socketPing();
      }

      timer = setTimeout(() => {
        this.signalRReconectCounter = this.signalRReconectCounter + 1;
        this.pingPongConnection();
      }, 3000);
    } else {
      clearTimeout(timer);
    }
  };

  @action
  setIsLoading = (loading: boolean) => {
    this.isLoading = loading;
  };

  // For socket
  @action
  handleSocketServerError = (response: ResponseFromWebsocket<ServerError>) => {
    this.isInitLoading = false;
    this.setIsLoading(false);
    if (this.activeSession) {
      this.activeSession?.stop().finally(() => {
        this.activeSession = undefined;
      });
    }
    this.rootStore.serverErrorPopupStore.openModal();

    this.handleNewInitConnection(this.token);
    // response.data.reason
  };

  @action
  openAccountSwitcher = () => {
    this.showAccountSwitcher = true;
  };

  @action
  closeAccountSwitcher = () => {
    this.showAccountSwitcher = false;
  };

  @action
  setSignUpFlag = (value: boolean) => {
    this.signUpFlag = value;
  };

  @action
  setAdditionalRequest = (value: boolean) => {
    this.isAdditionalRequestSent = value;
  };

  @action
  setWithdrawRequest = (value: boolean) => {
    this.isWithdrawRequestSent = value;
  };

  @action
  setLpLoginFlag = (value: boolean) => {
    this.lpLoginFlag = value;
  };

  @action
  startSignalRTimer = () => {
    this.connectionSignalRTimer = setTimeout(() => {
      this.activeSession?.stop();
    }, FIFTEEN_MINUTES);
  };

  @action
  stopSignalRTimer = () => {
    if (this.connectionSignalRTimer) {
      clearTimeout(this.connectionSignalRTimer);
    }
  };

  @action
  addTriggerShowOnboarding = async () => {
    try {
      API.setKeyValue(
        {
          key: KeysInApi.SHOW_ONBOARDING,
          value: true,
        },
        this.initModel.tradingUrl
      );
    } catch (error) {}
  };

  @action
  addTriggerDissableOnboarding = async () => {
    this.isOnboarding = false;
    try {
      await API.setKeyValue(
        {
          key: KeysInApi.SHOW_ONBOARDING,
          value: false,
        },
        this.initModel.tradingUrl
      );
    } catch (error) {}
  };

  postRefreshToken = async () => {
    const refreshToken = `${this.refreshToken}`;
    try {
      this.refreshToken = '';
      const result = await API.refreshToken(
        { refreshToken },
        this.initModel.authUrl
      );
      if (result.refreshToken) {
        this.setRefreshToken(result.refreshToken);
        this.setTokenHandler(result.token);
      }
    } catch (error) {
      this.setRefreshToken('');
      this.setTokenHandler('');
    }
  };

  @action
  checkOnboardingShowLPLogin = async () => {
    try {
      //
      const onBoardingKey = await API.getKeyValue(
        KeysInApi.SHOW_ONBOARDING,
        this.initModel.tradingUrl
      );
      const showOnboarding = onBoardingKey !== 'false';
      if (showOnboarding) {
        this.isOnboarding = true;
      }
      return showOnboarding;
      //
    } catch (error) {
      return false;
    }
  };

  @action
  checkOnboardingShow = async () => {
    try {
      //
      const onBoardingKey = await API.getKeyValue(
        KeysInApi.SHOW_ONBOARDING,
        this.initModel.tradingUrl
      );
      const showOnboarding = onBoardingKey === 'true';
      if (showOnboarding) {
        this.isOnboarding = true;
        this.isDemoRealPopup = false;
      }
      return showOnboarding;
      //
    } catch (error) {}
  };

  getActiveAccount = async () => {
    try {
      this.activeACCLoading = true;
      await this.checkOnboardingShow();

      const activeAccountId = await API.getKeyValue(
        KeysInApi.ACTIVE_ACCOUNT_ID,
        this.initModel.tradingUrl
      );

      const activeAccountTarget = await API.getKeyValue(
        KeysInApi.ACTIVE_ACCOUNT_TARGET,
        this.initModel.tradingUrl
      );

      const userActiveHint = await API.getKeyValue(
        KeysInApi.SHOW_HINT,
        this.initModel.tradingUrl
      );

      if (userActiveHint && userActiveHint !== 'false') {
        // @ts-ignore
        this.rootStore.educationStore.openHint(userActiveHint, false);
      }

      if (activeAccountTarget === 'facebook') {
        this.isPromoAccount = true;
        localStorage.setItem(LOCAL_TARGET, activeAccountTarget);
      } else {
        localStorage.setItem(LOCAL_TARGET, '');
      }

      const activeAccount =
        this.accounts.find((acc) => acc.id === activeAccountId) ||
        this.accounts.find((acc) => !acc.isLive);

      if (activeAccount) {
        this.activeSession?.send(Topics.SET_ACTIVE_ACCOUNT, {
          [Fields.ACCOUNT_ID]: activeAccount.id,
        });
        if (this.activeAccountId !== activeAccount.id) {
          this.setActiveAccountId(activeAccount.id);
        }
      }

      this.activeACCLoading = false;
      this.activeAccount = activeAccount;
      this.isLoading = false;
      this.isInitLoading = false;
    } catch (error) {
      this.isLoading = false;
      this.rootStore.badRequestPopupStore.setMessage(`${error}`);
      this.rootStore.badRequestPopupStore.openModal();
    }
  };

  @action
  setActiveAccountId = (activeAccountId: AccountModelWebSocketDTO['id']) => {
    this.activeAccountId = activeAccountId;
  };

  @action
  setActiveAccount = async (account: AccountModelWebSocketDTO) => {
    this.activeAccount = account;
    this.setActiveAccountId(account.id);
    // TODO: think how remove crutch
    this.rootStore.historyStore.positionsHistoryReport.positionsHistory = [];
    this.rootStore.tradingViewStore.tradingWidget = undefined;
    this.rootStore.instrumentsStore.activeInstrument = this.rootStore.instrumentsStore.activeInstruments[0];
    await API.setKeyValue(
      {
        key: KeysInApi.ACTIVE_ACCOUNT_ID,
        value: account.id,
      },
      this.initModel.tradingUrl
    );
  };

  @action
  signIn = async (credentials: UserAuthenticate) => {
    const response = await API.authenticate(
      credentials,
      this.initModel.authUrl
    );
    if (response.result === OperationApiResponseCodes.Ok) {
      localStorage.setItem(LOCAL_IS_NEW_USER, 'true');
      this.isAuthorized = true;
      this.signalRReconnectTimeOut = response.data.reconnectTimeOut;
      this.connectTimeOut = +response.data.connectionTimeOut;
      this.setTokenHandler(response.data.token);
      this.handleInitConnection(response.data.token);
      this.setRefreshToken(response.data.refreshToken);
      mixpanel.track(mixpanelEvents.LOGIN, {
        [mixapanelProps.BRAND_NAME]: this.initModel.brandName.toLowerCase(),
      });
    }

    if (
      response.result === OperationApiResponseCodes.InvalidUserNameOrPassword
    ) {
      this.isAuthorized = false;
    }

    return response.result;
  };

  @action
  signInLpLogin = async (params: LpLoginParams) => {
    if (this.isAuthorized) {
      this.signOut();
    }
    const response = await API.postLpLoginToken(params, this.initModel.authUrl);

    if (response.result === OperationApiResponseCodes.Ok) {
      localStorage.setItem(LOCAL_IS_NEW_USER, 'true');
      this.isAuthorized = true;
      this.signalRReconnectTimeOut = response.data.reconnectTimeOut;
      this.setTokenHandler(response.data.token);
      this.handleInitConnection(response.data.token);
      this.setRefreshToken(response.data.refreshToken);
      mixpanel.track(mixpanelEvents.LOGIN);
    }

    if (
      response.result === OperationApiResponseCodes.InvalidUserNameOrPassword
    ) {
      this.isAuthorized = false;
    }

    return response.result;
  };

  @action
  signUp = async (credentials: UserRegistration) => {
    const response = await API.signUpNewTrader(
      credentials,
      this.initModel.authUrl
    );
    if (response.result === OperationApiResponseCodes.Ok) {
      localStorage.setItem(LOCAL_IS_NEW_USER, 'true');
      this.signalRReconnectTimeOut = response.data.reconnectTimeOut;
      this.isAuthorized = true;
      this.setTokenHandler(response.data.token);
      this.handleInitConnection(response.data.token);
      this.setRefreshToken(response.data.refreshToken);
    }

    if (
      response.result === OperationApiResponseCodes.InvalidUserNameOrPassword
    ) {
      this.isAuthorized = false;
    }
    return response.result;
  };

  @action
  signOut = () => {
    localStorage.removeItem(accountVerifySteps.KYC_STEP);
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
    localStorage.removeItem(LAST_PAGE_VISITED);
    localStorage.removeItem(LOCAL_TARGET);
    localStorage.removeItem(LOCAL_HIDDEN_BALANCE);
    this.activeACCLoading = true;
    this.isPromoAccount = false;
    this.activeSession?.stop();
    this.activeSession = undefined;
    this.token = '';
    this.refreshToken = '';
    this.isAuthorized = false;
    this.rootStore.quotesStore.activePositions = [];
    this.rootStore.quotesStore.pendingOrders = [];
    this.rootStore.tradingViewStore.tradingWidget = undefined;
    delete Axios.defaults.headers[RequestHeaders.AUTHORIZATION];
    this.activeAccount = undefined;
    this.activeAccountId = '';
    this.accounts = [];
    this.rootStore.withdrawalStore.clearStore();
    this.balanceWas = 0;
    this.rootStore.userProfileStore.resetBonusStore();
    this.requestReconnectCounter = 0;
    this.rootStore.badRequestPopupStore.stopRecconect();
    this.requestErrorStack = [];
    this.rootStore.educationStore.resetStore();
    this.isBalanceHidden = false;
    this.rootStore.kycStore.resetStore();
    this.isAdditionalRequestSent = false;
    this.isWithdrawRequestSent = false;
    if (this.activeAccount) {
      this.setParamsAsset(null);
      this.setParamsMarkets(null);
      this.setParamsPortfolioTab(null);
      this.setParamsDeposit(false);
      this.setParamsKYC(false);
      this.setParamsWithdraw(false);
      this.setParamsBalanceHistory(false);
      this.setParamsSecurity(false);
    }
  };

  setTokenHandler = (token: string) => {
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
    Axios.defaults.headers[RequestHeaders.AUTHORIZATION] = token;
    this.token = token;
  };

  setRefreshToken = (refreshToken: string) => {
    localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, refreshToken);
    this.refreshToken = refreshToken;
  };

  @action
  setLanguage = (newLang: CountriesEnum) => {
    localStorage.setItem(LOCAL_STORAGE_LANGUAGE, newLang);
    document.querySelector('html')?.setAttribute('lang', newLang);
    this.lang = newLang;
  };

  @action
  setLoading = (on: boolean) => {
    this.isLoading = on;
  };

  @action
  setParamsAsset = (params: string | null) => {
    this.paramsAsset = params;
  };

  @action
  setParamsMarkets = (params: string | null) => {
    this.paramsMarkets = params;
  };

  @action
  setParamsPortfolioTab = (params: string | null) => {
    this.paramsPortfolioTab = params;
  };

  @action
  setParamsPortfolioActive = (params: string | null) => {
    this.paramsPortfolioActive = params;
  };

  @action
  setParamsPortfolioPending = (params: string | null) => {
    this.paramsPortfolioPending = params;
  };

  @action
  setParamsPortfolioClosed = (params: string | null) => {
    this.paramsPortfolioClosed = params;
  };

  @action
  setParamsDeposit = (params: boolean) => {
    this.paramsDeposit = params;
  };

  @action
  setParamsKYC = (params: boolean) => {
    this.paramsKYC = params;
  };

  @action
  setParamsWithdraw = (params: boolean) => {
    this.paramsWithdraw = params;
  };

  @action
  setParamsSecurity = (params: boolean) => {
    this.paramsSecurity = params;
  };

  @action
  setParamsBalanceHistory = (params: boolean) => {
    this.paramsBalanceHistory = params;
  };

  @action
  setDataLoading = (on: boolean) => {
    this.dataLoading = on;
  };

  @action
  setIsBalanceHidden = (on: boolean) => {
    this.isBalanceHidden = on;
  };

  @action
  setRequestErrorStack = (newStack: string[]) => {
    this.requestErrorStack = newStack;
  };

  @computed
  get realAcc() {
    return this.accounts.find((acc) => acc.isLive);
  }

  @computed
  get sortedAccounts() {
    if (this.isPromoAccount) {
      return this.accounts.filter((acc) => !acc.isLive);
    }

    return this.accounts.reduce(
      (acc, prev) =>
        prev.id === this.activeAccount?.id ? [prev, ...acc] : [...acc, prev],
      [] as AccountModelWebSocketDTO[]
    );
  }
}

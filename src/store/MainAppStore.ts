import { languagesList } from './../constants/languagesList';
import {
  LOCAL_STORAGE_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
  LOCAL_STORAGE_LANGUAGE,
  LAST_PAGE_VISITED,
  LOCAL_IS_NEW_USER,
  LOCAL_TARGET,
} from './../constants/global';
import axios, { AxiosRequestConfig } from 'axios';
import {
  UserAuthenticate,
  UserRegistration,
  LpLoginParams,
} from '../types/UserInfo';
import { HubConnection } from '@aspnet/signalr';
import { AccountModelWebSocketDTO } from '../types/AccountsTypes';
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
import { logger } from '../helpers/ConsoleLoggerTool';

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
  connectTimeOut = '';
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

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) || '';
    this.promo = localStorage.getItem(LOCAL_TARGET) || '';
    this.refreshToken =
      localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY) || '';
    Axios.defaults.headers[RequestHeaders.AUTHORIZATION] = this.token;

    // @ts-ignore
    this.lang =
      localStorage.getItem(LOCAL_STORAGE_LANGUAGE) ||
      (window.navigator.language &&
      languagesList.includes(
        window.navigator.language.slice(0, 2).toLowerCase()
      )
        ? window.navigator.language.slice(0, 2).toLowerCase()
        : CountriesEnum.EN);
    injectInerceptors(this);
  }

  initApp = async () => {
    try {
      const initModel = await API.getInitModel();
      this.initModel = initModel;
      this.setInterceptors();
    } catch (error) {
      this.isInitLoading = false;
      this.rootStore.badRequestPopupStore.openModal();
      this.rootStore.badRequestPopupStore.setMessage(error);
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

  handleInitConnection = async (token = this.token) => {
    this.isLoading = true;
    const connectionString = IS_LOCAL
      ? WS_HOST
      : `${this.initModel.tradingUrl}/signalr`;
    const connection = initConnection(connectionString);

    const connectToWebocket = async () => {
      try {
        await connection.start();
        this.websocketConnectionTries = 0;
        try {
          await connection.send(Topics.INIT, token);
          this.isAuthorized = true;
          this.activeSession = connection;
        } catch (error) {
          this.isAuthorized = false;
          this.isInitLoading = false;
        }
      } catch (error) {
        this.isInitLoading = false;
        setTimeout(
          connectToWebocket,
          this.signalRReconnectTimeOut ? +this.signalRReconnectTimeOut : 10000
        );
      }
    };
    connectToWebocket();

    connection.on(Topics.UNAUTHORIZED, () => {
      if (this.refreshToken) {
        this.postRefreshToken().then(() => {
          axios.defaults.headers[RequestHeaders.AUTHORIZATION] = this.token;
          this.handleInitConnection();
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
        this.rootStore.badRequestPopupStore.openModal();
        this.rootStore.badRequestPopupStore.setMessage(response.data.reason);
      }
    );

    connection.onclose((error) => {
      // TODO: https://monfex.atlassian.net/browse/WEBT-510
      if (error && error?.message.indexOf('1006') > -1) {
        if (this.websocketConnectionTries < 3) {
          this.websocketConnectionTries = this.websocketConnectionTries + 1; // TODO: mobx strange behavior with i++;
          this.handleInitConnection();
        } else {
          window.location.reload();
          return;
        }
      }

      this.socketError = true;
      this.isLoading = false;
      this.isInitLoading = false;
      this.rootStore.badRequestPopupStore.openModal();
      this.rootStore.badRequestPopupStore.setMessage(
        error?.message ||
          apiResponseCodeMessages[OperationApiResponseCodes.TechnicalError]
      );

      console.log('websocket error: ', error);
      console.log('=====/=====');
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
          this.rootStore.instrumentsStore.instrumentGroups = response.data;
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
      API.setKeyValue(
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
      }
      //
    } catch (error) {}
  };

  getActiveAccount = async () => {
    try {
      await this.checkOnboardingShow();

      const activeAccountId = await API.getKeyValue(
        KeysInApi.ACTIVE_ACCOUNT_ID,
        this.initModel.tradingUrl
      );

      const activeAccountTarget = await API.getKeyValue(
        KeysInApi.ACTIVE_ACCOUNT_TARGET,
        this.initModel.tradingUrl
      );

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
        this.activeAccount = activeAccount;
        this.activeAccountId = activeAccount.id;
      } else {
        this.isLoading = false;
      }
      this.isInitLoading = false;
    } catch (error) {
      this.isLoading = false;
      this.rootStore.badRequestPopupStore.setMessage(error);
      this.rootStore.badRequestPopupStore.openModal();
    }
  };

  @action
  setActiveAccount = (account: AccountModelWebSocketDTO) => {
    this.activeAccount = account;
    this.activeAccountId = account.id;
    // TODO: think how remove crutch
    this.rootStore.historyStore.positionsHistoryReport.positionsHistory = [];
    this.rootStore.tradingViewStore.tradingWidget = undefined;
    this.rootStore.instrumentsStore.activeInstrument = undefined;
    API.setKeyValue(
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
      this.connectTimeOut = response.data.connectionTimeOut;
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
    this.rootStore.withdrawalStore.clearStore();
    this.balanceWas = 0;
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

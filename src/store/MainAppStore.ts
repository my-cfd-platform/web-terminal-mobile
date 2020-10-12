import {
  LOCAL_STORAGE_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
  LOCAL_STORAGE_LANGUAGE,
  LAST_PAGE_VISITED,
} from './../constants/global';
import axios from 'axios';
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

interface MainAppStoreProps {
  token: string;
  refreshToken: string;
  isInterceptorsInjected: boolean;
  isAuthorized: boolean;
  signIn: (credentials: UserAuthenticate) => void;
  signUp: (credentials: UserRegistration) => Promise<unknown>;
  activeSession?: HubConnection;
  isLoading: boolean;
  isInitLoading: boolean;
  activeAccount?: AccountModelWebSocketDTO;
  accounts: AccountModelWebSocketDTO[];
  setActiveAccount: (acc: AccountModelWebSocketDTO) => void;
  tradingUrl: string;
  profileStatus: PersonalDataKYCEnum;
  isDemoRealPopup: boolean;
  signalRReconnectTimeOut: string;
  initModel: InitModel;
  lang: CountriesEnum;
  activeAccountId: string;
  connectionSignalRTimer: NodeJS.Timeout | null;
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
    brandProperty: '',
    faqUrl: '',
    withdrawFaqUrl: '',
    favicon: '',
    gaAsAccount: '',
    iosAppLink: '',
    logo: '',
    policyUrl: '',
    supportUrl: '',
    termsUrl: '',
    tradingUrl: '',
    authUrl: '',
    mixpanelToken: '582507549d28c813188211a0d15ec940',
    recaptchaToken: '',
  };
  @observable isLoading = false;
  @observable isInitLoading = true;
  @observable isDemoRealPopup = false;
  @observable isAuthorized = true;
  @observable activeSession?: HubConnection;
  @observable activeAccount?: AccountModelWebSocketDTO;
  @observable accounts: AccountModelWebSocketDTO[] = [];
  @observable profileStatus: PersonalDataKYCEnum =
    PersonalDataKYCEnum.NotVerified;
  @observable tradingUrl = '';
  @observable isInterceptorsInjected = false;
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
  websocketConnectionTries = 0;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) || '';
    this.refreshToken =
      localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY) || '';
    Axios.defaults.headers[RequestHeaders.AUTHORIZATION] = this.token;
    // @ts-ignore
    this.lang =
      localStorage.getItem(LOCAL_STORAGE_LANGUAGE) || CountriesEnum.EN;
  }

  initApp = async () => {
    try {
      const initModel = await API.getInitModel();
      this.initModel = initModel;
    } catch (error) {
      this.isInitLoading = false;
      this.rootStore.badRequestPopupStore.openModal();
      this.rootStore.badRequestPopupStore.setMessage(error);
    }
  };

  handleInitConnection = async (token = this.token) => {
    const wsConnectSub =
      this.tradingUrl.slice(-1) === '/' ? 'signalr' : `/signalr`;
    const connectionString = IS_LIVE ? this.tradingUrl + wsConnectSub : WS_HOST;
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

          if (IS_LIVE) {
            this.fetchTradingUrl();
          } else {
            this.setTradingUrl('/');
            injectInerceptors('/', this);
            this.handleInitConnection();
          }
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
        if (this.activeAccount && this.activeAccount.id === response.data.id) {
          for (const key in response.data) {
            if (Object.prototype.hasOwnProperty.call(response.data, key)) {
              // @ts-ignore
              this.activeAccount[key] = response.data[key];
            }
          }
        } else {
          this.activeAccount = response.data;
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
          this.rootStore.quotesStore.activePositions = response.data;
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
          this.rootStore.quotesStore.activePositions = this.rootStore.quotesStore.activePositions.map(
            (item) => (item.id === response.data.id ? response.data : item)
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

  fetchTradingUrl = async (token = this.token) => {
    this.isLoading = true;
    try {
      const response = await API.getTradingUrl(this.initModel.authUrl);
      this.setTradingUrl(response.tradingUrl);
      if (!this.isInterceptorsInjected) {
        injectInerceptors(response.tradingUrl, this);
      }
      this.handleInitConnection(token);
    } catch (error) {
      this.setTradingUrl('/');
      this.isLoading = false;
      this.isInitLoading = false;
    }
  };

  @action
  setSignUpFlag = (value: boolean) => {
    this.signUpFlag = value;
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

  getActiveAccount = async () => {
    try {
      const activeAccountId = await API.getKeyValue(
        KeysInApi.ACTIVE_ACCOUNT_ID
      );
      const activeAccount = this.accounts.find(
        (item) => item.id === activeAccountId
      );
      if (activeAccount) {
        this.activeSession?.send(Topics.SET_ACTIVE_ACCOUNT, {
          [Fields.ACCOUNT_ID]: activeAccount.id,
        });
        this.activeAccount = activeAccount;
        this.activeAccountId = activeAccount.id;
      } else {
        this.isDemoRealPopup = true;
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
    API.setKeyValue({
      key: KeysInApi.ACTIVE_ACCOUNT_ID,
      value: account.id,
    });
  };

  @action
  signIn = async (credentials: UserAuthenticate) => {
    const response = await API.authenticate(
      credentials,
      this.initModel.authUrl
    );
    if (response.result === OperationApiResponseCodes.Ok) {
      this.isAuthorized = true;
      this.signalRReconnectTimeOut = response.data.reconnectTimeOut;
      this.connectTimeOut = response.data.connectionTimeOut;
      this.setTokenHandler(response.data.token);
      this.fetchTradingUrl(response.data.token);
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
      this.isAuthorized = true;
      this.signalRReconnectTimeOut = response.data.reconnectTimeOut;
      this.setTokenHandler(response.data.token);
      this.fetchTradingUrl(response.data.token);
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
      this.signalRReconnectTimeOut = response.data.reconnectTimeOut;
      this.isAuthorized = true;
      this.setTokenHandler(response.data.token);
      this.setRefreshToken(response.data.refreshToken);
      this.fetchTradingUrl(response.data.token);
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
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
    localStorage.removeItem(LAST_PAGE_VISITED);
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
    mixpanel.reset(); 
  };

  @action
  setTradingUrl = (tradingUrl: string) => {
    this.tradingUrl = tradingUrl;
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

  @computed
  get sortedAccounts() {
    return this.accounts.reduce(
      (acc, prev) =>
        prev.id === this.activeAccount?.id ? [prev, ...acc] : [...acc, prev],
      [] as AccountModelWebSocketDTO[]
    );
  }
}

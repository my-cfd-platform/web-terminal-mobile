import { WithdrawalHistoryResponseStatus } from './../enums/WithdrawalHistoryResponseStatus';
import { RefreshToken, RefreshTokenDTO } from './../types/RefreshToken';
import axios, { AxiosRequestConfig } from 'axios';
import {
  OpenPositionResponseDTO,
  ClosePositionModel,
  RemovePendingOrders,
  UpdateSLTP,
  OpenPositionModel,
  OpenPendingOrder,
  PositionUpdtateToppingUp,
} from '../types/Positions';
import API_LIST from './apiList';
import { AccountModelDTO } from '../types/AccountsTypes';
import {
  UserAuthenticate,
  UserAuthenticateResponse,
  UserRegistration,
  ChangePasswordRespone,
  LpLoginParams,
  RecoveryPasswordParams,
  IWelcomeBonusDTO,
} from '../types/UserInfo';
import { HistoryCandlesType, CandleDTO } from '../types/HistoryTypes';
import {
  PositionsHistoryReportDTO,
  BalanceHistoryDTO,
  GetHistoryParams,
  BalanceHistoryReport,
} from '../types/HistoryReportTypes';
import AUTH_API_LIST from './apiListAuth';
import { ChangePasswordParams } from '../types/TraderTypes';
import {
  PersonalDataResponse,
  PersonalDataParams,
  PersonalDataPostResponse,
} from '../types/PersonalDataTypes';
import { CountriesEnum } from '../enums/CountriesEnum';
import { Country } from '../types/CountriesTypes';
import { DocumentTypeEnum } from '../enums/DocumentTypeEnum';
import { getProcessId } from './getProcessId';
import { AccountTypeEnum } from '../enums/AccountTypeEnum';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import { ServerInfoType } from '../types/ServerInfoTypes';
import {
  GetCryptoWalletDTO,
  GetCryptoWalletParams,
  CreateDepositParams,
  DepositCreateDTO,
  CreateDepositInvoiceParams,
  CreateDepositInvoiceDTO,
} from '../types/DepositTypes';
import { InitModel } from '../types/InitAppTypes';
import {
  CreateWithdrawalParams,
  WithdrawalHistoryDTO,
  cancelWithdrawalParams,
} from '../types/WithdrawalTypes';
import { ListForEN } from '../constants/listOfLanguages';
import { PendingOrderResponseDTO } from '../types/PendingOrdersTypes';
import { BrandEnum } from '../constants/brandingLinksTranslate';
import { DebugResponse, DebugTypes } from '../types/DebugTypes';
import { OnBoardingInfo } from '../types/OnBoardingTypes';
import requestOptions from '../constants/requestOptions';
import { IEducationCoursesDTO, IEducationQuestionsDTO } from '../types/EducationTypes';

class API {
  private convertParamsToFormData = (params: { [key: string]: any }) => {
    const formData = new FormData();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    return formData;
  };

  clientRequestOptions: AxiosRequestConfig = {
    timeoutErrorMessage: requestOptions.TIMEOUT,
    data: {
      initBy: requestOptions.CLIENT
    }
  };
  backgroundRequestOptions: AxiosRequestConfig = {
    timeoutErrorMessage: requestOptions.TIMEOUT,
    data: {
      initBy: requestOptions.BACKGROUND
    }
  };

  //
  //  Clients Request
  //
  //

  openPosition = async (position: OpenPositionModel) => {
    const formData = this.convertParamsToFormData(position);
    const response = await axios.post<OpenPositionResponseDTO>(
      `${API_STRING}${API_LIST.POSITIONS.OPEN}`,
      formData,
      this.clientRequestOptions
    );
    return response.data;
  };

  closePosition = async (position: ClosePositionModel) => {
    const formData = this.convertParamsToFormData(position);

    const response = await axios.post<OpenPositionResponseDTO>(
      `${API_STRING}${API_LIST.POSITIONS.CLOSE}`,
      formData,
      this.clientRequestOptions
    );
    return response.data;
  };

  authenticate = async (credentials: UserAuthenticate, authUrl: string) => {
    const response = await axios.post<UserAuthenticateResponse>(
      `${API_AUTH_STRING || authUrl || authUrl}${
        AUTH_API_LIST.TRADER.AUTHENTICATE
      }`,
      credentials,
      this.clientRequestOptions
    );
    return response.data;
  };

  signUpNewTrader = async (credentials: UserRegistration, authUrl: string) => {
    const response = await axios.post<UserAuthenticateResponse>(
      `${API_AUTH_STRING || authUrl}${AUTH_API_LIST.TRADER.REGISTER}`,
      credentials,
      this.clientRequestOptions
    );
    return response.data;
  };

  openPendingOrder = async (position: OpenPendingOrder) => {
    const formData = this.convertParamsToFormData(position);
    const response = await axios.post<PendingOrderResponseDTO>(
      `${API_STRING}${API_LIST.PENDING_ORDERS.ADD}`,
      formData,
      this.clientRequestOptions
    );
    return response.data;
  };

  removePendingOrder = async (position: RemovePendingOrders) => {
    const formData = this.convertParamsToFormData(position);
    const response = await axios.post<PendingOrderResponseDTO>(
      `${API_STRING}${API_LIST.PENDING_ORDERS.REMOVE}`,
      formData,
      this.clientRequestOptions
    );
    return response.data;
  };

  updateToppingUp = async (position: PositionUpdtateToppingUp) => {
    const formData = this.convertParamsToFormData(position);
    const response = await axios.post<OpenPositionResponseDTO>(
      `${API_STRING}${API_LIST.POSITIONS.UPDATE_TOPING_UP}`,
      formData,
      this.clientRequestOptions
    );

    return response.data;
  };

  updateSLTP = async (position: UpdateSLTP) => {
    const formData = this.convertParamsToFormData(position);
    const response = await axios.post<OpenPositionResponseDTO>(
      `${API_STRING}${API_LIST.POSITIONS.UPDATE_SL_TP}`,
      formData,
      this.clientRequestOptions
    );
    return response.data;
  };

  confirmEmail = async (link: string, authUrl: string) => {
    const response = await axios.post<{ result: OperationApiResponseCodes }>(
      `${API_AUTH_STRING || authUrl}${AUTH_API_LIST.PERSONAL_DATA.CONFIRM}`,
      {
        link,
      },
      this.clientRequestOptions
    );
    return response.data;
  };

  forgotEmail = async (email: string, authUrl: string) => {
    const response = await axios.post<{ result: OperationApiResponseCodes }>(
      `${API_AUTH_STRING || authUrl}${AUTH_API_LIST.TRADER.FORGOT_PASSWORD}`,
      {
        email,
      },
      this.clientRequestOptions
    );
    return response.data;
  };

  recoveryPassword = async (
    params: RecoveryPasswordParams,
    authUrl: string
  ) => {
    const response = await axios.post<{ result: OperationApiResponseCodes }>(
      `${API_AUTH_STRING || authUrl}${AUTH_API_LIST.TRADER.PASSWORD_RECOVERY}`,
      params,
      this.clientRequestOptions
    );
    return response.data;
  };

  createDeposit = async (params: CreateDepositParams) => {
    const response = await axios.post<DepositCreateDTO>(
      `${API_DEPOSIT_STRING}${API_LIST.DEPOSIT.CREATE}`,
      params,
      this.clientRequestOptions
    );
    return response.data;
  };

  createDepositInvoice = async (params: CreateDepositInvoiceParams) => {
    const response = await axios.post<CreateDepositInvoiceDTO>(
      `${API_DEPOSIT_STRING}${API_LIST.DEPOSIT.CREATE_INVOICE}`,
      params,
      this.clientRequestOptions
    );
    return response.data;
  };

  changePassword = async (params: ChangePasswordParams, authUrl: string) => {
    const response = await axios.post<ChangePasswordRespone>(
      `${API_AUTH_STRING || authUrl}${AUTH_API_LIST.TRADER.CHANGE_PASSWORD}`,
      params,
      this.clientRequestOptions
    );
    return response.data;
  };

  createWithdrawal = async (
    params: CreateWithdrawalParams,
    tradingUrl: string
  ) => {
    const response = await axios.post<{
      status: WithdrawalHistoryResponseStatus;
    }>(
      `${API_WITHDRAWAL_STRING || tradingUrl}${API_LIST.WITHWRAWAL.CREATE}`,
      params,
      this.clientRequestOptions
    );
    return response.data;
  };

  cancelWithdrawal = async (
    params: cancelWithdrawalParams,
    tradingUrl: string
  ) => {
    const response = await axios.post<WithdrawalHistoryDTO>(
      `${API_WITHDRAWAL_STRING || tradingUrl}${API_LIST.WITHWRAWAL.CANCEL}`,
      params,
      this.clientRequestOptions
    );
    return response.data;
  };

  // -------------------

  //
  //  Background Request
  //
  //

  getAccounts = async () => {
    const response = await axios.get<AccountModelDTO[]>(
      `${API_STRING}${API_LIST.ACCOUNTS.GET_ACCOUNTS}`,
      this.backgroundRequestOptions
    );
    return response.data;
  };

  getAccountById = async (id: number) => {
    const response = await axios.get<AccountModelDTO>(
      `${API_STRING}${API_LIST.ACCOUNTS.GET_ACCOUNT_BY_ID}`,
      {
        params: {
          id,
        },
        ...this.backgroundRequestOptions
      }
    );
    return response.data;
  };

  getHeaders = async () => {
    const response = await axios.get<string[]>(
      `${API_STRING}${API_LIST.ACCOUNTS.GET_HEADERS}`,
      this.backgroundRequestOptions
    );
    return response.data;
  };

  getPriceHistory = async (params: HistoryCandlesType) => {
    const response = await axios.get<CandleDTO[]>(
      `${API_STRING}${API_LIST.PRICE_HISTORY.CANDLES}`,
      {
        params,
        ...this.backgroundRequestOptions
      }
    );
    const bars = response.data.map((item) => ({
      time: item.d,
      low: item.l,
      high: item.h,
      open: item.o,
      close: item.c,
    }));
    return bars;
  };

  getKeyValue = async (key: string, tradingUrl: string) => {
    const response = await axios.get<string>(
      `${API_STRING || tradingUrl}${API_LIST.KEY_VALUE.GET}`,
      {
        params: {
          key,
        },
        ...this.backgroundRequestOptions
      }
    );
    return response.data;
  };

  setKeyValue = async (
    params: { key: string; value: string | boolean },
    tradingUrl: string
  ) => {
    const formData = this.convertParamsToFormData(params);
    const response = await axios.post<void>(
      `${API_STRING || tradingUrl}${API_LIST.KEY_VALUE.POST}`,
      formData,
      this.backgroundRequestOptions
    );
    return response.data;
  };

  getPositionsHistory = async (params: GetHistoryParams) => {
    const response = await axios.get<PositionsHistoryReportDTO>(
      `${API_STRING}${API_LIST.REPORTS.POSITIONS_HISTORY}`,
      {
        params,
        ...this.backgroundRequestOptions
      }
    );
    return response.data;
  };

  getBalanceHistory = async (params: GetHistoryParams) => {
    const response = await axios.get<BalanceHistoryReport>(
      `${API_STRING}${API_LIST.REPORTS.BALANCE_HISTORY}`,
      {
        params,
        ...this.backgroundRequestOptions
      }
    );
    return response.data;
  };

  getPersonalData = async (processId: string, authUrl: string) => {
    const response = await axios.get<PersonalDataResponse>(
      `${API_AUTH_STRING || authUrl}${AUTH_API_LIST.PERSONAL_DATA.GET}`,
      {
        params: {
          processId: encodeURIComponent(processId),
        },
        ...this.backgroundRequestOptions
      }
    );
    return response.data;
  };

  getAdditionalRegistrationFields = async (authUrl: string) => {
    const response = await axios.get<string[]>(
      `${API_AUTH_STRING || authUrl}${
        AUTH_API_LIST.TRADER.ADDITIONAL_REGISTRATION_FIELDS
      }`,
      this.backgroundRequestOptions
    );
    return response.data;
  };

  getGeolocationInfo = async (authUrl: string) => {
    const response = await axios.get<{
      country: string;
      dial: string;
    }>(
      `${API_AUTH_STRING || authUrl}${AUTH_API_LIST.COMMON.GEOLOCATION_INFO}`,
      this.backgroundRequestOptions
    );
    return response.data;
  };

  postPersonalData = async (params: any, authUrl: string) => {
    const formData = this.convertParamsToFormData(params);

    const response = await axios.post<PersonalDataPostResponse>(
      `${API_AUTH_STRING || authUrl}${AUTH_API_LIST.PERSONAL_DATA.POST}`,
      formData,
      this.backgroundRequestOptions
    );
    return response.data;
  };

  getCountries = async (lang = CountriesEnum.EN, authUrl: string) => {
    const langForApi = ListForEN[lang].shortName;
    const response = await axios.get<Country[]>(
      `${API_AUTH_STRING || authUrl}${
        AUTH_API_LIST.COMMON.COUNTRIES
      }/${langForApi}`,
      this.backgroundRequestOptions
    );
    return response.data;
  };

  postDocument = async (
    documentType: DocumentTypeEnum,
    file: Blob,
    authUrl: string
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('processId', getProcessId());

    const response = await axios.post<void>(
      `${API_AUTH_STRING || authUrl}${
        AUTH_API_LIST.DOCUMENT.POST
      }/${documentType}`,
      formData,
      this.backgroundRequestOptions
    );
    return response.data;
  };

  getFavoriteInstrumets = async (params: {
    type: AccountTypeEnum;
    accountId: string;
  }) => {
    const response = await axios.get<string[]>(
      `${API_STRING}${API_LIST.INSTRUMENTS.FAVOURITES}`,
      {
        params,
        ...this.backgroundRequestOptions
      }
    );
    return response.data;
  };

  postFavoriteInstrumets = async (params: {
    type: AccountTypeEnum;
    accountId: string;
    instruments: string[];
  }) => {
    const response = await axios.post<string[]>(
      `${API_STRING}${API_LIST.INSTRUMENTS.FAVOURITES}`,
      params,
      this.backgroundRequestOptions
    );
    return response.data;
  };

  getCryptoWallet = async (params: GetCryptoWalletParams) => {
    const response = await axios.post<GetCryptoWalletDTO>(
      `${API_DEPOSIT_STRING}${API_LIST.DEPOSIT.GET_CRYPTO_WALLET}`,
      params,
      this.backgroundRequestOptions
    );
    return response.data;
  };

  getTradingUrl = async (authUrl: string) => {
    const response = await axios.get<ServerInfoType>(
      `${API_AUTH_STRING || authUrl}${AUTH_API_LIST.COMMON.SERVER_INFO}`,
      this.backgroundRequestOptions
    );
    return response.data;
  };

  refreshToken = async (params: RefreshToken, authUrl: string) => {
    const response = await axios.post<RefreshTokenDTO>(
      `${API_AUTH_STRING || authUrl}${AUTH_API_LIST.TRADER.REFRESH_TOKEN}`,
      params,
      this.backgroundRequestOptions
    );
    return response.data;
  };

  verifyUser = async (params: { processId: string }, authUrl: string) => {
    const response = await axios.post<{ result: OperationApiResponseCodes }>(
      `${API_AUTH_STRING || authUrl}${
        AUTH_API_LIST.PERSONAL_DATA.ON_VERIFICATION
      }`,
      params,
      this.backgroundRequestOptions
    );
    return response.data;
  };

  getInitModel = async () => {
    const response = IS_LOCAL
      ? {
          data: {
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
          } as InitModel,
        }
      : await axios.get<InitModel>(
        `${API_LIST.INIT.GET}`,
        this.backgroundRequestOptions
      );
    return response.data;
  };

  getWithdrawalHistory = async (tradingUrl: string) => {
    const response = await axios.get<WithdrawalHistoryDTO>(
      `${API_WITHDRAWAL_STRING || tradingUrl}${API_LIST.WITHWRAWAL.HISTORY}`,
      this.backgroundRequestOptions
    );
    return response.data;
  };

  postLpLoginToken = async (params: LpLoginParams, authUrl: string) => {
    const response = await axios.post<UserAuthenticateResponse>(
      `${API_AUTH_STRING || authUrl}${AUTH_API_LIST.TRADER.LP_LOGIN}`,
      params,
      this.backgroundRequestOptions
    );
    return response.data;
  };

  getOnBoardingInfoByStep = async (
    stepNumber: number,
    deviceType: number,
    miscUrl: string
  ) => {
    const needToAdd =
      (API_MISC_STRING || miscUrl).includes('/misc') || IS_LOCAL ? '' : '/misc';
    const response = await axios.get<OnBoardingInfo>(
      `${API_MISC_STRING || miscUrl}${needToAdd}${
        API_LIST.ONBOARDING.STEPS
      }/${stepNumber}?deviceTypeId=${deviceType}`,
      this.backgroundRequestOptions
    );
    return response.data;
  };

  getUserBonus = async (miscUrl: string) => {
    const needToAdd =
      (API_MISC_STRING || miscUrl).includes('/misc') || IS_LOCAL ? '' : '/misc';
    const response = await axios.get<IWelcomeBonusDTO>(
      `${API_MISC_STRING || miscUrl}${needToAdd}${API_LIST.WELCOME_BONUS.GET}`,
      this.backgroundRequestOptions
    );
    return response.data;
  };


  getListOfCourses = async (miscUrl: string) => {
    const needToAdd =
      (API_MISC_STRING || miscUrl).includes('/misc') || IS_LOCAL ? '' : '/misc';
    const response = await axios.get<IEducationCoursesDTO>(
      `${API_MISC_STRING || miscUrl}${needToAdd}${API_LIST.EDUCATION.LIST}`
    );
    return response.data;
  };

  getQuestionsByCourses = async (miscUrl: string, id: string) => {
    const needToAdd =
      (API_MISC_STRING || miscUrl).includes('/misc') || IS_LOCAL ? '' : '/misc';
    const response = await axios.get<IEducationQuestionsDTO>(
      `${API_MISC_STRING || miscUrl}${needToAdd}${API_LIST.EDUCATION.LIST}/${id}`
    );
    return response.data;
  };

  saveProgressEducation = async (miscUrl: string, id: string, index: number) => {
    const needToAdd =
      (API_MISC_STRING || miscUrl).includes('/misc') || IS_LOCAL ? '' : '/misc';
    const response = await axios.post<IEducationCoursesDTO>(
      `${API_MISC_STRING || miscUrl}${needToAdd}${API_LIST.EDUCATION.LIST}/${id}/saveProgress`,
      {
        lastQuestionId: index
      }
    );
    return response.data;
  };

  postDebug = async (params: DebugTypes) => {
    const response = await axios.post<DebugResponse>(
      `${API_STRING}${API_LIST.DEBUG.POST}`,
      params
    );
    return response.data;
  };
  // -------------------
}

export default new API();

import { WithdrawalHistoryResponseStatus } from './../enums/WithdrawalHistoryResponseStatus';
import { RefreshToken, RefreshTokenDTO } from './../types/RefreshToken';
import axios from 'axios';
import {
  OpenPositionResponseDTO,
  ClosePositionModel,
  RemovePendingOrders,
  UpdateSLTP,
  OpenPositionModel,
  OpenPendingOrder,
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

class API {
  convertParamsToFormData = (params: { [key: string]: any }) => {
    const formData = new FormData();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    return formData;
  };

  openPosition = async (position: OpenPositionModel) => {
    const formData = this.convertParamsToFormData(position);
    const response = await axios.post<OpenPositionResponseDTO>(
      `${API_STRING}${API_LIST.POSITIONS.OPEN}`,
      formData
    );
    return response.data;
  };

  closePosition = async (position: ClosePositionModel) => {
    const formData = this.convertParamsToFormData(position);

    const response = await axios.post<OpenPositionResponseDTO>(
      `${API_STRING}${API_LIST.POSITIONS.CLOSE}`,
      formData
    );
    return response.data;
  };

  getAccounts = async () => {
    const response = await axios.get<AccountModelDTO[]>(
      `${API_STRING}${API_LIST.ACCOUNTS.GET_ACCOUNTS}`
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
      }
    );
    return response.data;
  };

  getHeaders = async () => {
    const response = await axios.get<string[]>(
      `${API_STRING}${API_LIST.ACCOUNTS.GET_HEADERS}`
    );
    return response.data;
  };

  authenticate = async (credentials: UserAuthenticate, authUrl: string) => {
    const response = await axios.post<UserAuthenticateResponse>(
      `${API_AUTH_STRING || authUrl || authUrl}${
        AUTH_API_LIST.TRADER.AUTHENTICATE
      }`,
      credentials
    );
    return response.data;
  };

  signUpNewTrader = async (credentials: UserRegistration, authUrl: string) => {
    const response = await axios.post<UserAuthenticateResponse>(
      `${API_AUTH_STRING || authUrl}${AUTH_API_LIST.TRADER.REGISTER}`,
      credentials
    );
    return response.data;
  };

  getPriceHistory = async (params: HistoryCandlesType) => {
    const response = await axios.get<CandleDTO[]>(
      `${API_STRING}${API_LIST.PRICE_HISTORY.CANDLES}`,
      {
        params,
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

  getKeyValue = async (key: string) => {
    const response = await axios.get<string>(
      `${API_STRING}${API_LIST.KEY_VALUE.GET}`,
      {
        params: {
          key,
        },
      }
    );
    return response.data;
  };

  setKeyValue = async (params: { key: string; value: string }) => {
    const formData = this.convertParamsToFormData(params);
    const response = await axios.post<void>(
      `${API_STRING}${API_LIST.KEY_VALUE.POST}`,
      formData
    );
    return response.data;
  };

  openPendingOrder = async (position: OpenPendingOrder) => {
    const formData = this.convertParamsToFormData(position);
    const response = await axios.post<OpenPositionResponseDTO>(
      `${API_STRING}${API_LIST.PENDING_ORDERS.ADD}`,
      formData
    );
    return response.data;
  };

  removePendingOrder = async (position: RemovePendingOrders) => {
    const formData = this.convertParamsToFormData(position);
    const response = await axios.post<OpenPositionResponseDTO>(
      `${API_STRING}${API_LIST.PENDING_ORDERS.REMOVE}`,
      formData
    );
    return response.data;
  };

  updateSLTP = async (position: UpdateSLTP) => {
    const formData = this.convertParamsToFormData(position);
    const response = await axios.post<OpenPositionResponseDTO>(
      `${API_STRING}${API_LIST.POSITIONS.UPDATE_SL_TP}`,
      formData
    );
    return response.data;
  };

  confirmEmail = async (link: string, authUrl: string) => {
    const response = await axios.post<{ result: OperationApiResponseCodes }>(
      `${API_AUTH_STRING || authUrl}${AUTH_API_LIST.PERSONAL_DATA.CONFIRM}`,
      {
        link,
      }
    );
    return response.data;
  };

  forgotEmail = async (email: string, authUrl: string) => {
    const response = await axios.post<{ result: OperationApiResponseCodes }>(
      `${API_AUTH_STRING || authUrl}${AUTH_API_LIST.TRADER.FORGOT_PASSWORD}`,
      {
        email,
      }
    );
    return response.data;
  };

  recoveryPassword = async (
    params: RecoveryPasswordParams,
    authUrl: string
  ) => {
    const response = await axios.post<{ result: OperationApiResponseCodes }>(
      `${API_AUTH_STRING || authUrl}${AUTH_API_LIST.TRADER.PASSWORD_RECOVERY}`,
      params
    );
    return response.data;
  };

  getPositionsHistory = async (params: GetHistoryParams) => {
    const response = await axios.get<PositionsHistoryReportDTO>(
      `${API_STRING}${API_LIST.REPORTS.POSITIONS_HISTORY}`,
      {
        params,
      }
    );
    return response.data;
  };

  getBalanceHistory = async (params: GetHistoryParams) => {
    const response = await axios.get<BalanceHistoryReport>(
      `${API_STRING}${API_LIST.REPORTS.BALANCE_HISTORY}`,
      {
        params,
      }
    );
    return response.data;
  };

  changePassword = async (params: ChangePasswordParams, authUrl: string) => {
    const response = await axios.post<ChangePasswordRespone>(
      `${API_AUTH_STRING || authUrl}${AUTH_API_LIST.TRADER.CHANGE_PASSWORD}`,
      params
    );
    return response.data;
  };

  getPersonalData = async (processId: string, authUrl: string) => {
    const response = await axios.get<PersonalDataResponse>(
      `${API_AUTH_STRING || authUrl}${AUTH_API_LIST.PERSONAL_DATA.GET}`,
      {
        params: {
          processId,
        },
      }
    );
    return response.data;
  };

  getAdditionalRegistrationFields = async (authUrl: string) => {
    const response = await axios.get<string[]>(
      `${API_AUTH_STRING || authUrl}${
        AUTH_API_LIST.TRADER.ADDITIONAL_REGISTRATION_FIELDS
      }`
    );
    return response.data;
  };

  getGeolocationInfo = async (authUrl: string) => {
    const response = await axios.get<Country>(
      `${API_AUTH_STRING || authUrl}${AUTH_API_LIST.COMMON.GEOLOCATION_INFO}`
    );
    return response.data;
  };

  postPersonalData = async (params: PersonalDataParams, authUrl: string) => {
    const formData = this.convertParamsToFormData(params);

    const response = await axios.post<PersonalDataPostResponse>(
      `${API_AUTH_STRING || authUrl}${AUTH_API_LIST.PERSONAL_DATA.POST}`,
      formData
    );
    return response.data;
  };

  getCountries = async (lang = CountriesEnum.EN, authUrl: string) => {
    const response = await axios.get<Country[]>(
      `${API_AUTH_STRING || authUrl}${AUTH_API_LIST.COMMON.COUNTRIES}/${lang}`
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
      formData
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
      params
    );
    return response.data;
  };

  createDeposit = async (params: CreateDepositParams) => {
    const response = await axios.post<DepositCreateDTO>(
      `${API_DEPOSIT_STRING}${API_LIST.DEPOSIT.CREATE}`,
      params
    );
    return response.data;
  };

  createDepositInvoice = async (params: CreateDepositInvoiceParams) => {
    const response = await axios.post<CreateDepositInvoiceDTO>(
      `${API_DEPOSIT_STRING}${API_LIST.DEPOSIT.CREATE_INVOICE}`,
      params
    );
    return response.data;
  };

  getCryptoWallet = async (params: GetCryptoWalletParams) => {
    const response = await axios.post<GetCryptoWalletDTO>(
      `${API_DEPOSIT_STRING}${API_LIST.DEPOSIT.GET_CRYPTO_WALLET}`,
      params
    );
    return response.data;
  };

  getTradingUrl = async (authUrl: string) => {
    const response = await axios.get<ServerInfoType>(
      `${API_AUTH_STRING || authUrl}${AUTH_API_LIST.COMMON.SERVER_INFO}`
    );
    return response.data;
  };

  refreshToken = async (params: RefreshToken, authUrl: string) => {
    const response = await axios.post<RefreshTokenDTO>(
      `${API_AUTH_STRING || authUrl}${AUTH_API_LIST.TRADER.REFRESH_TOKEN}`,
      params
    );
    return response.data;
  };

  verifyUser = async (params: { processId: string }, authUrl: string) => {
    const response = await axios.post<{ result: OperationApiResponseCodes }>(
      `${API_AUTH_STRING || authUrl}${
        AUTH_API_LIST.PERSONAL_DATA.ON_VERIFICATION
      }`,
      params
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
          } as InitModel,
        }
      : await axios.get<InitModel>(`${API_LIST.INIT.GET}`);
    return response.data;
  };
  createWithdrawal = async (params: CreateWithdrawalParams) => {
    const response = await axios.post<{
      status: WithdrawalHistoryResponseStatus;
    }>(`${API_WITHDRAWAL_STRING}${API_LIST.WITHWRAWAL.CREATE}`, params);
    return response.data;
  };

  cancelWithdrawal = async (params: cancelWithdrawalParams) => {
    const response = await axios.post<WithdrawalHistoryDTO>(
      `${API_WITHDRAWAL_STRING}${API_LIST.WITHWRAWAL.CANCEL}`,
      params
    );
    return response.data;
  };

  getWithdrawalHistory = async () => {
    const response = await axios.get<WithdrawalHistoryDTO>(
      `${API_WITHDRAWAL_STRING}${API_LIST.WITHWRAWAL.HISTORY}`
    );
    return response.data;
  };

  postLpLoginToken = async (params: LpLoginParams, authUrl: string) => {
    const response = await axios.post<UserAuthenticateResponse>(
      `${API_AUTH_STRING || authUrl}${AUTH_API_LIST.TRADER.LP_LOGIN}`,
      params
    );
    return response.data;
  };
}

export default new API();

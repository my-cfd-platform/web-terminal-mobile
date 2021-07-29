import { WelcomeBonusResponseEnum } from './../enums/WelcomeBonusResponseEnum';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';

export interface UserAuthenticate {
  email: string;
  password: string;
}

export interface UserRegistration {
  email: string;
  password: string;
  userAgreement?: boolean;
  captcha?: string;
}

export interface UserForgotPassword {
  email: string;
}

export interface IResetPassword {
  password: string;
  repeatPassword?: string;
}

export interface ChangePassword {
  oldPassword: string;
  newPassword: string;
  repeatPassword?: string;
}

export interface RecoveryPasswordParams {
  password: string;
  token: string;
}

export interface ChangePasswordRespone {
  result: OperationApiResponseCodes;
}

export interface UserAuthenticateResponse {
  result: OperationApiResponseCodes;
  data: {
    token: string;
    tradingUrl: string;
    connectionTimeOut: string;
    reconnectTimeOut: string;
    refreshToken: string;
  };
}

export interface LpLoginParams {
  token: string;
}

export interface IWelcomeBonus {
  welcomeBonus: {
    ftdFrom: number,
    maxBonusAmount: number,
  },
  welcomeBonusExpirations: [
    {
      bonusPercentageFromFtd: number,
      expirationDateUtc: number,
    }
  ]
}

export interface IWelcomeBonusDTO {
  responseCode: WelcomeBonusResponseEnum,
  data: IWelcomeBonus
}

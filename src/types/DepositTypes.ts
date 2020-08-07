import { DepositApiResponseCodes } from './../enums/DepositApiResponseCodes';
import { DepositRequestStatusEnum } from '../enums/DepositRequestStatusEnum';

export interface CreateDepositParams {
  paymentMethod: string;
  depositSum: number;
  currency: string;
}

export interface GetCryptoWalletParams {
  currency: string;
  accountId: string;
}

export interface DepositCreateDTO {
  status: DepositApiResponseCodes;
  redirectUrl: string;
}

export interface GetCryptoWalletDTO {
  status: DepositApiResponseCodes;
  walletAddress: string;
}

export interface CreateDepositInvoiceParams {
  cardNumber: string;
  cvv: string;
  expirationDate: number;
  fullName: string;
  amount: number;
  postalCode?: string;
  country?: string;
  city?: string;
  address?: string;
  accountId: string;
}

export interface CreateDepositInvoiceDTO {
  secureLink: string;
  status: DepositRequestStatusEnum;
}

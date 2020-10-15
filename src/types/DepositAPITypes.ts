import { CreatePaymentInvoiceStatuses } from '../enums/CreatePaymentInvoiceStatuses';
import { GetCryptoWalletStatuses } from '../enums/GetCryptoWalletStatuses';

export interface DepositCreateRequest {
  paymentMethod: string;
  depositSum: number;
  currency: string;
}

export interface DepositCreateResponse {
  status: CreatePaymentInvoiceStatuses;
  redirectUrl: string;
}

export interface GetCryptoWalletRequest {
  currency: string;
}

export interface GetCryptoWalletResponse {
  status: GetCryptoWalletStatuses;
  walletAddress: string;
}

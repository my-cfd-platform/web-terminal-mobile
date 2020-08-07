export enum DepositRequestStatusEnum {
  Success,
  InvalidCardNumber,
  InvalidCredentials,
  UnsupportedCardType,
  MaxDepositAmountExceeded,
  MinDepositAmountExceeded,
  PaymentDeclined,
  ServerError,
}
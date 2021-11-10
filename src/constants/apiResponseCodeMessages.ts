import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';

const apiResponseCodeMessages = {
  [OperationApiResponseCodes.Expired]: 'Access token is expired',
  [OperationApiResponseCodes.FileNotFound]: 'File not found',
  [OperationApiResponseCodes.FileWrongExtension]:
    'Only files with the following extensions are allowed: jpg, png, pdf.',
  [OperationApiResponseCodes.OldPasswordNotMatch]: 'Old password not match.',
  [OperationApiResponseCodes.UserNotExist]: 'User not found.',
  [OperationApiResponseCodes.UserExists]: 'This email is already in use.',
  [OperationApiResponseCodes.InvalidUserNameOrPassword]:
    'Invalid login or password.',
  [OperationApiResponseCodes.Ok]: 'The order has been opened successfully.',
  [OperationApiResponseCodes.DayOff]:
    'The market is closed. Please try again when the market is open.',
  [OperationApiResponseCodes.MinOperationLotViolated]:
    'Your investment amount is too small.',
  [OperationApiResponseCodes.MaxOperationLotViolated]:
    'Your investment amount exceeds the maximum amount.',
  [OperationApiResponseCodes.MaxPositionByInstrumentViolated]:
    'Your cumulative investment amount for this instrument exceeds the maximum amount for this instrument.',
  [OperationApiResponseCodes.InsufficientMargin]:
    'Insufficient funds to open a position.',
  [OperationApiResponseCodes.NoLiquidity]:
    'No liquidity for this asset. Please try again later.',
  [OperationApiResponseCodes.PositionNotFound]: 'The position is not found.',
  [OperationApiResponseCodes.TpIsTooClose]:
    'Take profit level is too close to the current price.',
  [OperationApiResponseCodes.SlIsTooClose]:
    'Stop loss level is too close to the current price.',
  [OperationApiResponseCodes.PendingOrderNotFound]:
    'The position is not found.',
  [OperationApiResponseCodes.AccountNotFound]: 'The account is not found.',
  [OperationApiResponseCodes.InstrumentNotFound]: 'The asset is not found.',
  [OperationApiResponseCodes.InstrumentCanNotBeUsed]:
    'The asset is not available now.',
  [OperationApiResponseCodes.OperationIsNotPossibleDuringSwap]:
    'Operation is not possible during the swap.',
  [OperationApiResponseCodes.MaxAmountPendingOrders]:
    'You exceed the maximum amount for pending orders.',
  [OperationApiResponseCodes.TechnicalError]: 'Technical Error.',
  [OperationApiResponseCodes.MultiplierNotFound]: 'Multiplier not found.',
  [OperationApiResponseCodes.MaximumAmountOfDemoAccount]:
    'You exceed the maximum amount of demo account.',
  [OperationApiResponseCodes.TradingDisabled]:
    'Trading is not available for this asset now. Please try again later.',
  [OperationApiResponseCodes.MaxOpenPositionsAmount]:
    'You exceed the maximum amount for orders',
  [OperationApiResponseCodes.SystemError]: 'System Error',
  [OperationApiResponseCodes.PersonalDataNotValid]: 'Personal data is not valid.',
  [OperationApiResponseCodes.TooManyAttempts]:
    'Your account is blocked. We\'ve detected suspicious activity on your account. This block will expire in 15 min.',
  [OperationApiResponseCodes.CountryIsRestricted]:
    'Registration from your country is not allowed',
  [OperationApiResponseCodes.TradingDisabled]: 'Trading is temporarily disabled',
};

Object.freeze(apiResponseCodeMessages);

export default apiResponseCodeMessages;

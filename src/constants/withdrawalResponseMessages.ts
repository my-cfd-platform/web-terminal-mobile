import { WithdrawalHistoryResponseStatus } from '../enums/WithdrawalHistoryResponseStatus';

const withdrawalResponseMessages = {
  [WithdrawalHistoryResponseStatus.Successful]: 'Withdrawal request has been created successfully',
  [WithdrawalHistoryResponseStatus.Unauthorized]: 'You have to sign in to the platform to create a withdrawal request',
  [WithdrawalHistoryResponseStatus.WithdrawalRequestAlreadyCreated]: 'You already have one active withdrawal request',
  [WithdrawalHistoryResponseStatus.SystemError]: 'Technical Error',
}

Object.freeze(withdrawalResponseMessages);
export default withdrawalResponseMessages;
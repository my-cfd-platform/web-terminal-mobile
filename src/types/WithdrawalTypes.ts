import { WithdrawalTypesEnum } from './../enums/WithdrawalTypesEnum';
import { WithdrawalStatusesEnum } from './../enums/WithdrawalStatusesEnum';
import { WithdrawalHistoryResponseStatus } from '../enums/WithdrawalHistoryResponseStatus';

export interface CreateWithdrawalParams {
  accountId: string;
  currency: string;
  amount: number;
  withdrawalType: number;
  data: string;
}

export interface cancelWithdrawalParams {
  withdrawalId: string;
}

export interface WithdrawalHistoryModel {
  id: string;
  traderId: string;
  accountId: string;
  currency: string;
  amount: number;
  status: WithdrawalStatusesEnum;
  type: WithdrawalTypesEnum;
  data: string;
  processedId: string;
  creationDate: string;
  processDate: string;
}

export interface WithdrawalHistoryDTO {
  history: WithdrawalHistoryModel[] | null;
  status: WithdrawalHistoryResponseStatus;
}

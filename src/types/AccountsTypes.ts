import { AccountStatusEnum } from '../enums/AccountStatusEnum';
import { AccountTypeEnum } from '../enums/AccountTypeEnum';
import { InstrumentModelWSDTO } from './InstrumentsTypes';

export interface AccountModelDTO {
  id: string;
  balance: number;
  leverage: number;
  currency: string;
  instruments: InstrumentModelWSDTO[];
}

export interface AccountModelWebSocketDTO {
  id: string;
  balance: number;
  bonus: number;
  currency: string;
  digits: number;
  symbol: string;
  isLive: boolean;
  timestamp: number;
  freeToWithdrawal: number;
  achievementStatus: 'basic' | 'silver' | 'gold' | 'platinum';
  investAmount: [
    {
      amount: number;
    }
  ];
}


export interface AccountUserStatusInfo {
  id: string;
  name: string;
  order: number;
  type: AccountStatusEnum;
  depositsSumFrom: number;
  depositsSomTo: number;
}

export interface AccountUserStatusDTO {
  accountTypeModels: AccountUserStatusInfo[];
  currentAccountTypeId: string;
  percentageToNextAccountType: number,
  amountToNextAccountType: number;
}

export interface UserActiveStatus {
  currentAccountTypeId: string;
  percentageToNextAccountType: number,
  amountToNextAccountType: number;
}
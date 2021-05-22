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
  achievementStatus: 'basic' | 'silver' | 'gold' | 'platinum';
  investAmount: [
    {
      amount: number;
    }
  ];
}



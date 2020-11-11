import { AskBidEnum } from '../enums/AskBid';

export interface BidAskModelWSDTO {
  id: string;
  bid: HLOC;
  ask: HLOC;
  dt: number;
  dir: AskBidEnum;
}

export interface BidAskKeyValueList {
  [key: string]: BidAskModelWSDTO;
}

export interface HLOC {
  h: number;
  l: number;
  o: number;
  c: number;
}

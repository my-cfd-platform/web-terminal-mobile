import { AskBidEnum } from '../enums/AskBid';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import { TpSlTypeEnum } from '../enums/TpSlTypeEnum';

export interface PendingOrderWSDTO {
  id: number;
  investmentAmount: number;
  openPrice: number;
  created: number;
  instrument: string;
  multiplier: number;
  operation: AskBidEnum;
  tp: number | null;
  sl: number | null;
  tpType: TpSlTypeEnum | null;
  slType: TpSlTypeEnum | null;
  timeStamp: number;
  isToppingUpActive: boolean;
}


export interface PendingOrderResponseDTO {
  result: OperationApiResponseCodes;
  order: PendingOrderWSDTO;
}
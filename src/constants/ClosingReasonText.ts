import { ClosingReasonEnum } from "../enums/ClosingReasonEnum";

const closingReasonText = {
  [ClosingReasonEnum.None]: 'None',
  [ClosingReasonEnum.ClientCommand]: 'By user',
  [ClosingReasonEnum.StopOut]: 'Stop Out',
  [ClosingReasonEnum.TakeProfit]: 'Take Profit',
  [ClosingReasonEnum.StopLoss]: 'Stop Loss',
  [ClosingReasonEnum.Canceled]: 'Canceled',
}

Object.freeze(closingReasonText);
export default closingReasonText;
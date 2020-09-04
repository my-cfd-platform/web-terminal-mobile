import { ClosingReasonEnum } from "../enums/ClosingReasonEnum";

const closingReasonText = {
  [ClosingReasonEnum.None]: 'None',
  [ClosingReasonEnum.ClientCommand]: 'By User',
  [ClosingReasonEnum.StopOut]: 'By Stop out',
  [ClosingReasonEnum.TakeProfit]: 'By Take profit',
  [ClosingReasonEnum.StopLoss]: 'By Stop loss',
  [ClosingReasonEnum.Canceled]: 'By canceled',
}

Object.freeze(closingReasonText);
export default closingReasonText;
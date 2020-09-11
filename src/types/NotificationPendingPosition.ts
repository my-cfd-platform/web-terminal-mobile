export interface NotificationPendingPositionData {
  instrumentName: string;
  instrumentGroup: string;
  instrumentId: string;
  investmentAmount: number;
  openPrice: number;
  type: 'close' | 'open';
}

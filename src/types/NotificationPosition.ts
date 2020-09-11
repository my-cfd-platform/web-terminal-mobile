export interface NotificationPositionData {
  instrumentName: string;
  instrumentGroup: string;
  instrumentId: string;
  equity: number;
  percentPL?: number;
  type: 'close' | 'open';
}

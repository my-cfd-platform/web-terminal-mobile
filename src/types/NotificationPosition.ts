export interface NotificationPositionData {
  instrumentName: string;
  instrumentGroup: string;
  instrumentId: string;
  equity: number;
  type: 'close' | 'open';
}

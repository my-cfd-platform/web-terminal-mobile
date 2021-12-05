export interface NotificationPositionData {
  instrumentName: string;
  instrumentGroup: string;
  instrumentId: string;
  equity: number;
  percentPL?: number;
  positionId?: number;
  type: 'close' | 'open';
}

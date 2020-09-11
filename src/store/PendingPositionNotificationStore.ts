import { observable, action } from 'mobx';
import { NotificationPendingPositionData } from '../types/NotificationPendingPosition';

interface ContextProps {
  notificationMessageData: NotificationPendingPositionData;
  isActiveNotification: boolean;
  isSuccessfull: boolean;
  timer?: NodeJS.Timeout;
}

export class PendingPositionNotificationStore implements ContextProps {
  @observable notificationMessageData: NotificationPendingPositionData = {
    openPrice: 0,
    investmentAmount: 0,
    instrumentGroup: '',
    instrumentName: '',
    instrumentId: '',
    type: 'close',
  };
  @observable isActiveNotification: boolean = false;
  @observable isSuccessfull: boolean = false;
  @observable timer?: NodeJS.Timeout;

  @action
  closeNotification = () => {
    this.isActiveNotification = false;
  };

  @action
  openNotification = () => {
    this.isActiveNotification = true;
  };

  @action
  setNotification = (notification: NotificationPendingPositionData) => {
    this.notificationMessageData = notification;
  };
}

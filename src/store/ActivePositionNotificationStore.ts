import { observable, action } from 'mobx';
import { NotificationPositionData } from '../types/NotificationPosition';

interface ContextProps {
  notificationMessageData: NotificationPositionData;
  isActiveNotification: boolean;
  isSuccessfull: boolean;
  timer?: NodeJS.Timeout;
}

export class ActivePositionNotificationStore implements ContextProps {
  @observable notificationMessageData: NotificationPositionData = {
    equity: 0,
    instrumentGroup: '',
    instrumentName: '',
    instrumentId: '',
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
  setNotification = (notification: NotificationPositionData) => {
    this.notificationMessageData = notification;
  };
}

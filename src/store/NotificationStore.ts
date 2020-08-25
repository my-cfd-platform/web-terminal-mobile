import { observable, action } from 'mobx';
import { NotificationPositionData } from '../types/NotificationPosition';

interface ContextProps {
  notificationMessage?: string;
  notificationPositionMessage?: NotificationPositionData;
  isActiveNotification: boolean;
  isPositionNotification: boolean;
  isSuccessfull: boolean;
  timer?: NodeJS.Timeout;
}

export class NotificationStore implements ContextProps {
  @observable notificationMessage: string = '';
  @observable notificationPositionMessage?: NotificationPositionData;
  @observable isActiveNotification: boolean = false;
  @observable isPositionNotification: boolean = false;
  @observable isSuccessfull: boolean = false;
  @observable timer?: NodeJS.Timeout;

  @action
  closeNotification = () => {
    this.isActiveNotification = false;
    this.isPositionNotification = false;
  };

  @action
  openNotification = () => {
    this.isActiveNotification = true;
  };

  @action
  openPositionNotification = () => {
    this.isPositionNotification = true;
  };

  // TODO: rewrite to actions
  @action
  setNotification = (notification: string) => {
    this.notificationMessage = notification;
  }
}

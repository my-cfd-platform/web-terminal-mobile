import { observable, action } from 'mobx';

interface ContextProps {
  notificationMessage: string;
  isActiveNotification: boolean;
  isSuccessfull: boolean;
  timer?: NodeJS.Timeout;
  needTranslate: boolean;
}

export class NotificationStore implements ContextProps {
  @observable notificationMessage: string= '';
  @observable isActiveNotification: boolean = false;
  @observable isSuccessfull: boolean = false;
  @observable timer?: NodeJS.Timeout;
  @observable needTranslate: boolean = false;

  @action
  closeNotification = () => {
    this.isActiveNotification = false;
  };

  @action
  openNotification = () => {
    this.isActiveNotification = true;
  };

  @action
  setNotification = (notification: string) => {
    this.notificationMessage = notification;
  };

  @action
  setNeedTranslate = (newValue: boolean) => {
    this.needTranslate = newValue;
  };
}

import { observable, action } from 'mobx';

interface ContextProps {
  requestMessage?: string;
  isActive: boolean;
}

export class BadRequestPopupStore implements ContextProps {
  @observable requestMessage: string = '';
  @observable isActive: boolean = false;
  @observable isNetworkError: boolean = false;
  @observable isRecconect: boolean = false;
  @observable isReload: boolean = false;

  @action
  setNetwork = (status: boolean) => {
    this.isNetworkError = status;
  };

  @action
  setReload = () => {
    this.isReload = true;
  };

  @action
  initConectionReload = () => {
    setTimeout(() => {
      if (this.isNetworkError) {
        this.setReload();
      }
    }, 15000);
  };

  @action
  setRecconect = () => {
    this.isRecconect = true;
  };

  @action
  stopRecconect = () => {
    this.isRecconect = false;
  };

  @action
  closeModal = () => {
    this.isActive = false;
  };

  @action
  openModal = () => {
    this.isActive = !this.isNetworkError;
  };

  @action
  setMessage = (message: string) => {
    this.requestMessage = message;
  };
}

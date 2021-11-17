import { observable, action } from 'mobx';

interface ContextProps {
  isActive: boolean;
  reloadPayload: string;
}

export class ServerErrorPopupStore implements ContextProps {
  @observable isActive: boolean = false;
  @observable reloadPayload = '';

  @action
  closeModal = () => {
    this.isActive = false;
  };

  @action
  openModal = () => {
    this.isActive = true;
  };

  @action
  setReloadPayload = (payload: string) => this.reloadPayload = payload;
}

import { observable, action } from 'mobx';

interface ContextProps {
  isActive: boolean;
}

export class ServerErrorPopupStore implements ContextProps {
  @observable isActive: boolean = false;

  @action
  closeModal = () => {
    this.isActive = false;
  };

  @action
  openModal = () => {
    this.isActive = true;
  };
}

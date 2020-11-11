import { observable, action } from 'mobx';
import { WithdrawalHistoryModel } from './../types/WithdrawalTypes';


export class WithdrawalStore {
  @observable loading: boolean = false;
  @observable history: WithdrawalHistoryModel[] | null = null;
  @observable activeTab: number = 0;
  @observable pendingPopup: boolean = false;


  @action
  setPendingPopup = () => {
    this.pendingPopup = true;
  }

  @action
  closePendingPopup = () => {
    this.pendingPopup = false;
  }

  @action
  setLoad = () => {
    this.loading = true;
  }

  @action
  opentTab = (tab: number) => {
    this.activeTab = tab;
  }


  @action
  endLoad = () => {
    this.loading = false;
  }

  @action
  setHistory = (list: WithdrawalHistoryModel[] | null) => {
    this.history = list;
  }

  @action
  clearStore = () => {
    this.closePendingPopup();
    this.setHistory(null);
  }
}

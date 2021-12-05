import { observable, action } from 'mobx';
import { TpSlTypeEnum } from '../enums/TpSlTypeEnum';
import { OpenPositionModel } from '../types/Positions';

interface ContextProps {
  autoCloseTPType: TpSlTypeEnum | null;
  autoCloseSLType: TpSlTypeEnum | null;
  takeProfitValue: string;
  stopLossValue: string;
  purchaseAtValue: string;
  creatingPosition: OpenPositionModel | null;
  isSLTPMode: boolean;
}

export class SLTPStore implements ContextProps {
  @observable autoCloseTPType: TpSlTypeEnum | null = null;
  @observable autoCloseSLType: TpSlTypeEnum | null = null;
  @observable takeProfitValue: string = '';
  @observable stopLossValue: string = '';
  @observable purchaseAtValue: string = '';
  @observable creatingPosition: OpenPositionModel | null = null;
  @observable isSLTPMode: boolean = false;

  @action
  setCreatingPosition = (newPosition: OpenPositionModel | null) => {
    this.creatingPosition = newPosition;
  }

  @action
  setIsSLTPMode = (newValue: boolean) => {
    this.isSLTPMode = newValue;
  }

  @action
  clearStore = () => {
    this.purchaseAtValue = '';
    this.stopLossValue = '';
    this.takeProfitValue = '';
    this.autoCloseTPType = null;
    this.autoCloseSLType = null;
    this.creatingPosition = null;
    this.isSLTPMode = false;
  };
}

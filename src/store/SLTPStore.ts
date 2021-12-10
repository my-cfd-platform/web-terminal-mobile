import { observable, action } from 'mobx';
import { TpSlTypeEnum } from '../enums/TpSlTypeEnum';
import { OpenPositionModelFormik } from '../types/Positions';

interface ContextProps {
  autoCloseTPType: TpSlTypeEnum | null;
  autoCloseSLType: TpSlTypeEnum | null;
  takeProfitValue: string;
  stopLossValue: string;
  purchaseAtValue: string;
  creatingPosition: OpenPositionModelFormik | null;
  isSLTPMode: boolean;
}

export class SLTPStore implements ContextProps {
  @observable autoCloseTPType: TpSlTypeEnum | null = null;
  @observable autoCloseSLType: TpSlTypeEnum | null = null;
  @observable takeProfitValue: string = '';
  @observable stopLossValue: string = '';
  @observable purchaseAtValue: string = '';
  @observable creatingPosition: OpenPositionModelFormik | null = null;
  @observable isSLTPMode: boolean = false;

  @action
  setCreatingPosition = (newPosition: OpenPositionModelFormik | null) => {
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

import { observable, action } from 'mobx';
import { DepositTypeEnum } from '../enums/DepositTypeEnum';

interface Props {
  activeDepositType: DepositTypeEnum;
  isActivePopup: boolean;
}

export class DepositFundsStore implements Props {
  @observable activeDepositType: DepositTypeEnum = DepositTypeEnum.VisaMaster;
  @observable isActivePopup = false;

  @action
  togglePopup = () => {
    this.isActivePopup = !this.isActivePopup;
  }

  @action
  openPopup = () => {
    this.isActivePopup = true;
  }

  @action 
  setActiveDepositType = (newActiveDepositeType: DepositTypeEnum) => {
    this.activeDepositType = newActiveDepositeType;
  }
}

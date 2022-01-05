import { action, observable } from 'mobx';
import { KYCdocumentTypeEnum } from '../enums/KYC/KYCdocumentTypeEnum';
import { KYCstepsEnum } from '../enums/KYCsteps';

interface Props {
  currentStep: KYCstepsEnum;
  filledStep: KYCstepsEnum;
  activeDocumentStep: KYCdocumentTypeEnum | null;

  isVisibleButton: boolean;

  filledSteps: KYCdocumentTypeEnum[] | null;
}

export class KYCstore implements Props {
  @observable currentStep: KYCstepsEnum = KYCstepsEnum.PhoneVerification;
  @observable filledStep: KYCstepsEnum = KYCstepsEnum.PhoneVerification;

  @observable filledSteps: KYCdocumentTypeEnum[] | null = null;
  @observable activeDocumentStep: KYCdocumentTypeEnum | null = null;
  @observable isVisibleButton = true;

  @action 
  showConfirmButton = () => {
    this.isVisibleButton = true;
  }

  @action 
  hideConfirmButton = () => {
    this.isVisibleButton = false;
  }
  
  @action
  setActiveStep = (type: KYCdocumentTypeEnum) => {
    this.activeDocumentStep = type;
  };

  @action
  closeDocumentStep = () => {
    this.activeDocumentStep = null;
  };

  @action
  setFilledStep = (type: KYCdocumentTypeEnum) => {
    if (!this.filledSteps) {
      this.filledSteps = [type];
      return;
    }

    if (!this.filledSteps.includes(type)) {
      this.filledSteps = [...this.filledSteps, type];
    }
  };
}

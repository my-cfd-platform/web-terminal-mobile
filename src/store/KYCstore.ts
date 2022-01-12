import { DocumentTypeEnum } from './../enums/DocumentTypeEnum';
import { action, observable } from 'mobx';
import { KYCdocumentTypeEnum } from '../enums/KYC/KYCdocumentTypeEnum';
import { KYCstepsEnum } from '../enums/KYCsteps';
import { KYCFormDataType } from '../types/KYCFormDataType';

interface Props {
  currentStep: KYCstepsEnum;
  filledStep: KYCstepsEnum;
  activeDocumentStep: KYCdocumentTypeEnum | null;

  isVisibleButton: boolean;

  filledSteps: KYCdocumentTypeEnum[] | null;

  formKYCData: KYCFormDataType;
}

export class KYCstore implements Props {
  @observable currentStep: KYCstepsEnum = KYCstepsEnum.PhoneVerification;
  @observable filledStep: KYCstepsEnum = KYCstepsEnum.PhoneVerification;

  @observable filledSteps: KYCdocumentTypeEnum[] | null = null;
  @observable activeDocumentStep: KYCdocumentTypeEnum | null = null;
  @observable isVisibleButton = true;

  @observable formKYCData: KYCFormDataType = {
    [DocumentTypeEnum.Id]: null,
    [DocumentTypeEnum.ProofOfAddress]: null,
    [DocumentTypeEnum.FrontCard]: null,
    [DocumentTypeEnum.BackCard]: null,
    [DocumentTypeEnum.DepositLetter]: null,
    [DocumentTypeEnum.Other]: null,
    [DocumentTypeEnum.DriverLicenceFront]: null,
    [DocumentTypeEnum.DriverLicenceBack]: null,
    [DocumentTypeEnum.BankCardFront]: null,
    [DocumentTypeEnum.BankCardBack]: null,
    [DocumentTypeEnum.ProofOfPayment]: null,
    [DocumentTypeEnum.ProofOfWireTransfer]: null,
    [DocumentTypeEnum.CardAuthorizationForm]: null,
  };

  @action
  showConfirmButton = () => {
    this.isVisibleButton = true;
  };

  @action
  hideConfirmButton = () => {
    this.isVisibleButton = false;
  };

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

  @action
  removeFilledStep = (type: KYCdocumentTypeEnum) => {
    if (this.filledSteps !== null) {
      const index = this.filledSteps.findIndex((el) => el === type);
      if (index !== -1) {
        const result = [
          ...this.filledSteps.slice(0, index),
          ...this.filledSteps.slice(index + 1),
        ];
        this.filledSteps = result;
      }
    }
  };

  // KYC FORM
  @action
  setFiledData = (filed: DocumentTypeEnum, data: File | null) => {
    this.formKYCData[filed] = data;
  };


  @action
  resetFormData = () => {
    this.formKYCData = {
      [DocumentTypeEnum.Id]: null,
      [DocumentTypeEnum.ProofOfAddress]: null,
      [DocumentTypeEnum.FrontCard]: null,
      [DocumentTypeEnum.BackCard]: null,
      [DocumentTypeEnum.DepositLetter]: null,
      [DocumentTypeEnum.Other]: null,
      [DocumentTypeEnum.DriverLicenceFront]: null,
      [DocumentTypeEnum.DriverLicenceBack]: null,
      [DocumentTypeEnum.BankCardFront]: null,
      [DocumentTypeEnum.BankCardBack]: null,
      [DocumentTypeEnum.ProofOfPayment]: null,
      [DocumentTypeEnum.ProofOfWireTransfer]: null,
      [DocumentTypeEnum.CardAuthorizationForm]: null,
    };
  };
  // END KYC FORM

  @action
  resetStore = () => {
    this.resetFormData();
    this.filledSteps = null;
    this.activeDocumentStep = null;
  }
}

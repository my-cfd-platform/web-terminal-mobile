import { observable } from 'mobx';
import { KYCstepsEnum } from '../enums/KYCsteps';

interface Props {
  currentStep: KYCstepsEnum;
  filledStep: KYCstepsEnum;
}

export class KYCstore implements Props {
  @observable currentStep: KYCstepsEnum = KYCstepsEnum.PhoneVerification;
  @observable filledStep: KYCstepsEnum = KYCstepsEnum.PhoneVerification;
}

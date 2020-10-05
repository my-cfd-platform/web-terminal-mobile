import { PersonalDataKYCEnum } from '../enums/PersonalDataKYCEnum';

const KYCStatus = {
  [PersonalDataKYCEnum.NotVerified]: 'not verified',
  [PersonalDataKYCEnum.OnVerification]: 'on verification',
  [PersonalDataKYCEnum.Verified]: 'verified',
  [PersonalDataKYCEnum.Restricted]: 'restricted',
};

Object.freeze(KYCStatus);

export default KYCStatus;

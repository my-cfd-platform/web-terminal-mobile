import { SexEnum } from '../enums/Sex';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import { PersonalDataKYCEnum } from '../enums/PersonalDataKYCEnum';

export interface PersonalDataParams {
  processId: string;
  firstName: string;
  lastName: string;
  city: string;
  dateOfBirth: number;
  countryOfResidence: string;
  countryOfCitizenship: string;
  postalCode: string;
  phone: string;
  sex?: SexEnum;
  address: string;
  uSCitizen: boolean;
}

export interface PersonalDataResponse {
  result: OperationApiResponseCodes;
  data: PersonalDataDTO;
}

export interface PersonalDataDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  city: string;
  dateOfBirth: number;
  countryOfResidence: string;
  countryOfCitizenship: string;
  postalCode: string;
  sex: SexEnum;
  phone: string;
  kyc: PersonalDataKYCEnum;
  avatar: string;
}

export interface PersonalDataPostResponse {
  result: OperationApiResponseCodes;
  data: {
    firstName: string;
    lastName: string;
    city: string;
    dateOfBirth: string;
    countryOfResidence: string;
    countryOfCitizenship: string;
    postalCode: string;
    sex: SexEnum;
    phone: string;
    processId: string;
  };
}

export interface PhoneVerificationFormParams {
  customCountryCode: string;
  phone: string;
}

export interface ProofOfIdentityFormParams {
  customPassportId: Blob;
  customProofOfAddress: Blob;
}
import { DocumentTypeEnum } from "../enums/DocumentTypeEnum";

export type KYCFormDataType = {
  [key in DocumentTypeEnum]: null | File;
}
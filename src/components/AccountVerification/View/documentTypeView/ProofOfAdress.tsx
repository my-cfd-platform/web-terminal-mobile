import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '../../../../styles/Buttons';
import {
  FlexContainer,
  ResponsiveImage,
} from '../../../../styles/FlexContainer';
import SvgIcon from '../../../SvgIcon';

import IconPassport from '../../../../assets/svg_no_compress/kyc/icons-document/form-view/icon-proof-of-adress.svg';
import { PrimaryTextSpan } from '../../../../styles/TextsElements';
import InputPhoto from '../../../InputPhoto/InputPhoto';
import { MAX_FILE_UPLOAD_5_MB } from '../../../../constants/global';

import Image1 from '../../../../assets/images/kyc/document-images-requirement/proof-of-adress/1.png';
import Image2 from '../../../../assets/images/kyc/document-images-requirement/proof-of-adress/2.png';
import Image3 from '../../../../assets/images/kyc/document-images-requirement/proof-of-adress/3.png';
import Image4 from '../../../../assets/images/kyc/document-images-requirement/proof-of-adress/4.png';
import { DocumentTypeEnum } from '../../../../enums/DocumentTypeEnum';
import { KYCdocumentTypeEnum } from '../../../../enums/KYC/KYCdocumentTypeEnum';
import { useStores } from '../../../../hooks/useStores';
import { observer } from 'mobx-react-lite';

const ProofOfAdress = observer(() => {
  const { t } = useTranslation();
  const { kycStore } = useStores();

  const [file, setFile] = useState<File | null>(
    kycStore.formKYCData[DocumentTypeEnum.ProofOfAddress]
  );
  const [image, setImage] = useState('');

  const [error, setError] = useState('');

  const handlerUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (!e.target.files || !e.target.files.length) {
      return;
    }
    if (e.target.files[0].size > MAX_FILE_UPLOAD_5_MB) {
      setError('Allowed maximum size 5MB');
      return;
    } else {
      kycStore.setFiledData(DocumentTypeEnum.ProofOfAddress, e.target.files[0]);

      setFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (event: any) => {
        if (event.target) {
          setImage(event.target.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleRemoveImage = (inputName: string) => {
    const docType = Number(inputName.split('kyc-image-')[1]);
    setFile(null);
    setImage('');
    kycStore.removeFilledStep(KYCdocumentTypeEnum.PROOF_OF_ADRESS);
    kycStore.setFiledData(docType, null);
  };

  const handleSubmit = () => {
    kycStore.setFilledStep(KYCdocumentTypeEnum.PROOF_OF_ADRESS);
    kycStore.closeDocumentStep();
  };

  useEffect(() => {
    const photo1 = kycStore.formKYCData[DocumentTypeEnum.ProofOfAddress];
    if (photo1 !== null) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        if (event.target) {
          setImage(event.target.result);
        }
      };
      reader.readAsDataURL(photo1);
    }
  }, [kycStore.formKYCData]);

  return (
    <FlexContainer flex="1" flexDirection="column" padding="0 0 80px 0">
      <FlexContainer
        flex="1"
        overflow="auto"
        flexDirection="column"
        alignItems="center"
      >
        <FlexContainer
          flexDirection="column"
          width="255px"
          maxWidth="100%"
          alignItems="center"
          justifyContent="center"
          marginBottom="32px"
        >
          <FlexContainer marginBottom="4px">
            <SvgIcon {...IconPassport} fillColor="#ffffff" />
          </FlexContainer>
          <PrimaryTextSpan
            color="#ffffff"
            fontWeight={600}
            fontSize="16px"
            textAlign="center"
            marginBottom="4px"
          >
            {`${t('Proof of Address')} ${t('(Required)')}`}
          </PrimaryTextSpan>
          <PrimaryTextSpan color="#ffffff" fontSize="13px" textAlign="center">
            {t('You need to upload proof of address. It can be your bank statement or utility bill.')}
          </PrimaryTextSpan>
        </FlexContainer>

        <InputPhoto
          name={`kyc-image-${DocumentTypeEnum.ProofOfAddress}`}
          label={t('Upload the Proof of Address')}
          file={file}
          image={image}
          onUpload={handlerUploadImage}
          onRemoveImage={handleRemoveImage}
          hasError={!!error}
          errorText={error}
        />

        <FlexContainer width="100%" flexDirection="column" padding="16px">
          <PrimaryTextSpan fontSize="16px" fontWeight={600} color="#ffffff">
            {t('Image Requirements')}
          </PrimaryTextSpan>

          <FlexContainer
            width="100%"
            justifyContent="space-between"
            padding="12px 0"
            alignItems="flex-end"
          >
            <FlexContainer
              width="calc(25% - 9px)"
              flexDirection="column"
              alignItems="center"
            >
              <ResponsiveImage width="48px" marginBottom="8px" src={Image1} />
              <PrimaryTextSpan color="#ffffff" fontSize="12px">
                {t('Good')}
              </PrimaryTextSpan>
            </FlexContainer>
            <FlexContainer
              width="calc(25% - 9px)"
              flexDirection="column"
              alignItems="center"
            >
              <ResponsiveImage width="48px" marginBottom="8px" src={Image2} />
              <PrimaryTextSpan color="#ffffff" fontSize="12px">
                {t('Not cut')}
              </PrimaryTextSpan>
            </FlexContainer>
            <FlexContainer
              width="calc(25% - 9px)"
              flexDirection="column"
              alignItems="center"
            >
              <ResponsiveImage width="48px" marginBottom="8px" src={Image3} />
              <PrimaryTextSpan color="#ffffff" fontSize="12px">
                {t('Not blurry')}
              </PrimaryTextSpan>
            </FlexContainer>
            <FlexContainer
              width="calc(25% - 9px)"
              flexDirection="column"
              alignItems="center"
            >
              <ResponsiveImage width="48px" marginBottom="8px" src={Image4} />
              <PrimaryTextSpan color="#ffffff" fontSize="12px">
                {t('Not reflective')}
              </PrimaryTextSpan>
            </FlexContainer>
          </FlexContainer>

          <FlexContainer flexDirection="column">
            <PrimaryTextSpan
              marginBottom="8px"
              fontSize="13px"
              color="rgba(255, 255, 255, 0.64)"
            >
              + {t('Original full-size, unedited documents')}
            </PrimaryTextSpan>
            <PrimaryTextSpan
              marginBottom="8px"
              fontSize="13px"
              color="rgba(255, 255, 255, 0.64)"
            >
              + {t('Readable, well-lit, colored images')}
            </PrimaryTextSpan>
            <PrimaryTextSpan
              marginBottom="8px"
              fontSize="13px"
              color="rgba(255, 255, 255, 0.64)"
            >
              + {t('Сreated less than 3 months old')}
            </PrimaryTextSpan>

            <PrimaryTextSpan
              marginBottom="8px"
              fontSize="13px"
              color="rgba(255, 255, 255, 0.64)"
            >
              - {t('No black and white images')}
            </PrimaryTextSpan>
            <PrimaryTextSpan
              marginBottom="8px"
              fontSize="13px"
              color="rgba(255, 255, 255, 0.64)"
            >
              - {t('No edited or expired documents')}
            </PrimaryTextSpan>
            <PrimaryTextSpan
              marginBottom="8px"
              fontSize="13px"
              color="rgba(255, 255, 255, 0.64)"
            >
              {t('File size must be less 5 MB in PNG, JPEG, PDF format')}
            </PrimaryTextSpan>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>

      <FlexContainer
        width="100%"
        padding="12px 16px"
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        backgroundColor="#1C1F26"
      >
        <PrimaryButton disabled={!image} width="100%" onClick={handleSubmit}>
          {t('Continue')}
        </PrimaryButton>
      </FlexContainer>
    </FlexContainer>
  );
});

export default ProofOfAdress;

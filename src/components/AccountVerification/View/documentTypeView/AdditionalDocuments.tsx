import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '../../../../styles/Buttons';
import {
  FlexContainer,
  ResponsiveImage,
} from '../../../../styles/FlexContainer';
import SvgIcon from '../../../SvgIcon';

import IconPassport from '../../../../assets/svg_no_compress/kyc/icons-document/form-view/icon-additional-doc.svg';
import { PrimaryTextSpan } from '../../../../styles/TextsElements';
import InputPhoto from '../../../InputPhoto/InputPhoto';
import { MAX_FILE_UPLOAD_5_MB } from '../../../../constants/global';

import Image1 from '../../../../assets/images/kyc/document-images-requirement/additional-doc/1.png';
import Image2 from '../../../../assets/images/kyc/document-images-requirement/additional-doc/2.png';
import Image3 from '../../../../assets/images/kyc/document-images-requirement/additional-doc/3.png';
import Image4 from '../../../../assets/images/kyc/document-images-requirement/additional-doc/4.png';
import { observer } from 'mobx-react-lite';
import { DocumentTypeEnum } from '../../../../enums/DocumentTypeEnum';
import { KYCdocumentTypeEnum } from '../../../../enums/KYC/KYCdocumentTypeEnum';
import { useStores } from '../../../../hooks/useStores';

const AdditionalDocuments = observer(() => {
  const { t } = useTranslation();
  const { kycStore } = useStores();

  const [file1, setFile1] = useState<File | null>(
    kycStore.formKYCData[DocumentTypeEnum.ProofOfPayment]
  );
  const [file2, setFile2] = useState<File | null>(
    kycStore.formKYCData[DocumentTypeEnum.ProofOfWireTransfer]
  );
  const [file3, setFile3] = useState<File | null>(
    kycStore.formKYCData[DocumentTypeEnum.CardAuthorizationForm]
  );
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');

  const [error1, setError1] = useState('');
  const [error2, setError2] = useState('');
  const [error3, setError3] = useState('');

  const handlerUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const docType = Number(e.target.name.split('image-')[1]);

    if (!e.target.files || !e.target.files.length) {
      return;
    }

    if (e.target.files[0].size > MAX_FILE_UPLOAD_5_MB) {
      if (docType === DocumentTypeEnum.ProofOfPayment) {
        setError1('Allowed maximum size 5MB');
      } else if (docType === DocumentTypeEnum.ProofOfWireTransfer) {
        setError2('Allowed maximum size 5MB');
      } else {
        setError3('Allowed maximum size 5MB');
      }
      return;
    } else {
      if (docType === DocumentTypeEnum.ProofOfPayment) {
        setFile1(e.target.files[0]);
        const reader = new FileReader();
        reader.onload = (event: any) => {
          if (event.target) {
            setImage1(event.target.result);
          }
        };
        reader.readAsDataURL(e.target.files[0]);
      } else if (docType === DocumentTypeEnum.ProofOfWireTransfer) {
        setFile2(e.target.files[0]);
        const reader = new FileReader();
        reader.onload = (event: any) => {
          if (event.target) {
            setImage2(event.target.result);
          }
        };
        reader.readAsDataURL(e.target.files[0]);
      } else {
        setFile3(e.target.files[0]);
        const reader = new FileReader();
        reader.onload = (event: any) => {
          if (event.target) {
            setImage3(event.target.result);
          }
        };
        reader.readAsDataURL(e.target.files[0]);
      }
      kycStore.setFiledData(docType, e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    kycStore.setFilledStep(KYCdocumentTypeEnum.ADDITIONAL_DOCUMENT);
    kycStore.closeDocumentStep();
  };

  const handleRemoveImage = (inputName: string) => {
    const docType = Number(inputName.split('kyc-image-')[1]);

    if (docType === DocumentTypeEnum.ProofOfPayment) {
      setFile1(null);
      setImage1('');
    } else if (docType === DocumentTypeEnum.ProofOfWireTransfer) {
      setFile2(null);
      setImage2('');
    } else {
      setFile3(null);
      setImage3('');
    }
    kycStore.removeFilledStep(KYCdocumentTypeEnum.ADDITIONAL_DOCUMENT);
    kycStore.setFiledData(docType, null);
  };

  useEffect(() => {
    const photo1 = kycStore.formKYCData[DocumentTypeEnum.ProofOfPayment];
    const photo2 = kycStore.formKYCData[DocumentTypeEnum.ProofOfWireTransfer];
    const photo3 = kycStore.formKYCData[DocumentTypeEnum.CardAuthorizationForm];

    if (photo1 !== null) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        if (event.target) {
          setImage1(event.target.result);
        }
      };
      reader.readAsDataURL(photo1);
    }

    if (photo2 !== null) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        if (event.target) {
          setImage2(event.target.result);
        }
      };
      reader.readAsDataURL(photo2);
    }

    if (photo3 !== null) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        if (event.target) {
          setImage3(event.target.result);
        }
      };
      reader.readAsDataURL(photo3);
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
            {t('Additional documents')}
          </PrimaryTextSpan>
          <PrimaryTextSpan
            color="#ffffff"
            fontWeight={600}
            fontSize="16px"
            textAlign="center"
            marginBottom="4px"
          >
            {t('(Upon the request)')}
          </PrimaryTextSpan>
        </FlexContainer>

        <InputPhoto
          name={`kyc-image-${DocumentTypeEnum.ProofOfPayment}`}
          label={t('Upload Proof of Payment')}
          file={file1}
          image={image1}
          onUpload={handlerUploadImage}
          onRemoveImage={handleRemoveImage}
          hasError={!!error1}
          errorText={error1}
        />

        <InputPhoto
          name={`kyc-image-${DocumentTypeEnum.ProofOfWireTransfer}`}
          label={t('Upload Proof of Wire Transfer (Invoice)')}
          file={file2}
          image={image2}
          onUpload={handlerUploadImage}
          onRemoveImage={handleRemoveImage}
          hasError={!!error2}
          errorText={error2}
        />

        <InputPhoto
          name={`kyc-image-${DocumentTypeEnum.CardAuthorizationForm}`}
          label={t('Upload Card Authorization Form')}
          file={file3}
          image={image3}
          onUpload={handlerUploadImage}
          onRemoveImage={handleRemoveImage}
          hasError={!!error3}
          errorText={error3}
        />

        <FlexContainer width="100%" flexDirection="column" padding="16px">
          <PrimaryTextSpan fontSize="16px" fontWeight={600} color="#ffffff">
            {t('Image Requirements')}
          </PrimaryTextSpan>

          <FlexContainer
            width="100%"
            justifyContent="space-between"
            alignItems="flex-end"
            padding="12px 0"
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
        <PrimaryButton
          disabled={!(image1 || image2 || image3)}
          onClick={handleSubmit}
          width="100%"
        >
          {t('Continue')}
        </PrimaryButton>
      </FlexContainer>
    </FlexContainer>
  );
});

export default AdditionalDocuments;

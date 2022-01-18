import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '../../../../styles/Buttons';
import {
  FlexContainer,
  ResponsiveImage,
} from '../../../../styles/FlexContainer';
import SvgIcon from '../../../SvgIcon';

import IconPassport from '../../../../assets/svg_no_compress/kyc/icons-document/form-view/icon-driving-licence.svg';
import { PrimaryTextSpan } from '../../../../styles/TextsElements';
import InputPhoto from '../../../InputPhoto/InputPhoto';
import { MAX_FILE_UPLOAD_5_MB } from '../../../../constants/global';

import Image1 from '../../../../assets/images/kyc/document-images-requirement/driving-licence/1.png';
import Image2 from '../../../../assets/images/kyc/document-images-requirement/driving-licence/2.png';
import Image3 from '../../../../assets/images/kyc/document-images-requirement/driving-licence/3.png';
import Image4 from '../../../../assets/images/kyc/document-images-requirement/driving-licence/4.png';
import { observer } from 'mobx-react-lite';
import { DocumentTypeEnum } from '../../../../enums/DocumentTypeEnum';
import { KYCdocumentTypeEnum } from '../../../../enums/KYC/KYCdocumentTypeEnum';
import { useStores } from '../../../../hooks/useStores';

const IdentityDrivingLicence = observer(() => {
  const { t } = useTranslation();
  const { kycStore } = useStores();
  const [file1, setFile1] = useState<File | null>(
    kycStore.formKYCData[DocumentTypeEnum.DriverLicenceFront]
  );
  const [file2, setFile2] = useState<File | null>(
    kycStore.formKYCData[DocumentTypeEnum.DriverLicenceBack]
  );
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');

  const [error1, setError1] = useState('');
  const [error2, setError2] = useState('');

  const handlerUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const docType = Number(e.target.name.split('image-')[1]);

    if (!e.target.files || !e.target.files.length) {
      return;
    }

    if (e.target.files[0].size > MAX_FILE_UPLOAD_5_MB) {
      if (docType === DocumentTypeEnum.DriverLicenceFront) {
        setError1('Allowed maximum size 5MB');
      } else {
        setError2('Allowed maximum size 5MB');
      }
      return;
    } else {
      if (docType === DocumentTypeEnum.DriverLicenceFront) {
        setFile1(e.target.files[0]);
        const reader = new FileReader();
        reader.onload = (event: any) => {
          console.log('stopped file read');
          if (event.target) {
            setImage1(event.target.result);
          }
        };
        reader.readAsDataURL(e.target.files[0]);
      } else {
        setFile2(e.target.files[0]);
        const reader = new FileReader();
        reader.onload = (event: any) => {
          console.log('stopped file read');
          if (event.target) {
            setImage2(event.target.result);
          }
        };
        reader.readAsDataURL(e.target.files[0]);
      }
      kycStore.setFiledData(docType, e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    kycStore.setFilledStep(KYCdocumentTypeEnum.IDENTITY_DOCUMENT);
    kycStore.closeDocumentStep();
  };

  const handleRemoveImage = (inputName: string) => {
    const docType = Number(inputName.split('kyc-image-')[1]);

    if (docType === DocumentTypeEnum.DriverLicenceFront) {
      setFile1(null);
      setImage1('');
    } else {
      setFile2(null);
      setImage2('');
    }
    kycStore.removeFilledStep(KYCdocumentTypeEnum.IDENTITY_DOCUMENT);
    kycStore.setFiledData(docType, null);
  };

  useEffect(() => {
    const photo1 = kycStore.formKYCData[DocumentTypeEnum.DriverLicenceFront];
    const photo2 = kycStore.formKYCData[DocumentTypeEnum.DriverLicenceBack];

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
            {`${t('Driving Licence')} ${t('(Required)')}`}
          </PrimaryTextSpan>
          <PrimaryTextSpan color="#ffffff" fontSize="13px" textAlign="center">
            {t(
              'Upload photos of the front and back sides of your driving licence'
            )}
          </PrimaryTextSpan>
        </FlexContainer>

        <InputPhoto
          name={`kyc-image-${DocumentTypeEnum.DriverLicenceFront}`}
          label={t('Upload Front Side')}
          file={file1}
          image={image1}
          onUpload={handlerUploadImage}
          onRemoveImage={handleRemoveImage}
          hasError={!!error1}
          errorText={error1}
        />

        <InputPhoto
          name={`kyc-image-${DocumentTypeEnum.DriverLicenceBack}`}
          label={t('Upload Back Side')}
          file={file2}
          image={image2}
          onUpload={handlerUploadImage}
          onRemoveImage={handleRemoveImage}
          hasError={!!error2}
          errorText={error2}
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
              <ResponsiveImage width="77px" marginBottom="8px" src={Image1} />
              <PrimaryTextSpan color="#ffffff" fontSize="12px">
                {t('Good')}
              </PrimaryTextSpan>
            </FlexContainer>
            <FlexContainer
              maxWidth="calc(25% - 9px)"
              width="77px"
              flexDirection="column"
              alignItems="center"
            >
              <ResponsiveImage width="77px" marginBottom="8px" src={Image2} />
              <PrimaryTextSpan color="#ffffff" fontSize="12px">
                {t('Not cut')}
              </PrimaryTextSpan>
            </FlexContainer>
            <FlexContainer
              width="calc(25% - 9px)"
              flexDirection="column"
              alignItems="center"
            >
              <ResponsiveImage width="77px" marginBottom="8px" src={Image3} />
              <PrimaryTextSpan color="#ffffff" fontSize="12px">
                {t('Not blurry')}
              </PrimaryTextSpan>
            </FlexContainer>
            <FlexContainer
              width="calc(25% - 9px)"
              flexDirection="column"
              alignItems="center"
            >
              <ResponsiveImage width="77px" marginBottom="8px" src={Image4} />
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
          disabled={!(image1 && image2)}
          width="100%"
          onClick={handleSubmit}
        >
          <PrimaryTextSpan color="#1C1F26" fontWeight={700} fontSize="16px">
            {t('Continue')}
          </PrimaryTextSpan>
        </PrimaryButton>
      </FlexContainer>
    </FlexContainer>
  );
});

export default IdentityDrivingLicence;

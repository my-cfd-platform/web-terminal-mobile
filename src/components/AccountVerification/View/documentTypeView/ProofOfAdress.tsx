import React, { useState } from 'react';
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

const ProofOfAdress = () => {
  const { t } = useTranslation();

  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState('');

  const handlerUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) {
      return;
    }
    if (e.target.files[0].size > MAX_FILE_UPLOAD_5_MB) {
      console.log('no file uploaded');
      return;
    } else {
      setFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (event: any) => {
        console.log('stopped file read');
        if (event.target) {
          setImage(event.target.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleRemoveImage = (inputName: string) => {
    setFile(null);
    setImage('');
  };

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
          name="driving-licence-front-image"
          label={t('Upload the Proof of Address')}
          file={file}
          image={image}
          onUpload={handlerUploadImage}
          onRemoveImage={handleRemoveImage}
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
              <ResponsiveImage src={Image1} />
              <PrimaryTextSpan color="#ffffff" fontSize="12px">
                {t('Good')}
              </PrimaryTextSpan>
            </FlexContainer>
            <FlexContainer
              width="calc(25% - 9px)"
              flexDirection="column"
              alignItems="center"
            >
              <ResponsiveImage src={Image2} />
              <PrimaryTextSpan color="#ffffff" fontSize="12px">
                {t('Not cut')}
              </PrimaryTextSpan>
            </FlexContainer>
            <FlexContainer
              width="calc(25% - 9px)"
              flexDirection="column"
              alignItems="center"
            >
              <ResponsiveImage src={Image3} />
              <PrimaryTextSpan color="#ffffff" fontSize="12px">
                {t('Not blurry')}
              </PrimaryTextSpan>
            </FlexContainer>
            <FlexContainer
              width="calc(25% - 9px)"
              flexDirection="column"
              alignItems="center"
            >
              <ResponsiveImage src={Image4} />
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
        <PrimaryButton disabled={!image} width="100%">
          {t('Continue')}
        </PrimaryButton>
      </FlexContainer>
    </FlexContainer>
  );
};

export default ProofOfAdress;

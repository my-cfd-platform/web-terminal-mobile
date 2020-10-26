import React, {FC, useEffect, useState} from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import BackFlowLayout from '../BackFlowLayout';
import { useStores } from '../../hooks/useStores';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import SvgIcon from '../SvgIcon';
import IconIdentCard from '../../assets/svg/profile/icon-ident-card.svg';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import styled from '@emotion/styled';
import { PrimaryButton } from '../../styles/Buttons';
import Colors from '../../constants/Colors';
import accountVerifySteps from '../../constants/accountVerifySteps';
import AccountVerificationPreview from './AccountVerificationPreview';
import IconCamera from '../../assets/svg/profile/icon-open-camera.svg';
import IconPhotos from '../../assets/svg/profile/icon-upload.svg';
import { DocumentTypeEnum } from '../../enums/DocumentTypeEnum';
import API from '../../helpers/API';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../../constants/mixpanelEvents';
import LoaderForComponents from '../../components/LoaderForComponents';

interface Props {
  changeStep?: any;
}

const AccountVerificationIdentify: FC<Props> = (props) => {
  const { changeStep } = props;
  const { mainAppStore } = useStores();
  const [file, setFile] = useState(new Blob());
  const [image, setImage] = useState('');
  const [isOpen, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();

  const handlerUploadImage = (e: any) => {
    if (e.target.files[0].size > 5242880) {
      changeStep(accountVerifySteps.VERIFICATION_LARGE_FILE);
    } else {
      setFile(e.target.files[0]);
      setOpen(false);
      const reader = new FileReader();
      reader.onload = (event: any) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmitPhoto = async () => {
    try {
      setLoader(true);
      await API.postDocument(
        DocumentTypeEnum.Id,
        file,
        mainAppStore.initModel.authUrl
      )
      mixpanel.track(mixpanelEvents.KYC_STEP_1);
      setLoader(false);
      changeStep(accountVerifySteps.VERIFICATION_RESIDENCE);
    } catch (error) {}
  };

  const backToFlow = () => {
    changeStep(accountVerifySteps.VERIFICATION_FLOW);
  };

  return (
    <BackFlowLayout handleGoBack={backToFlow} pageTitle={t('Proof of Identity')}>
      <LoaderForComponents isLoading={loader} />
      {image
        ? <AccountVerificationPreview
          changeStep={changeStep}
          pageTitle={'Proof of Identity'}
          toClosePopup={() => setImage('')}
          nextPage={accountVerifySteps.VERIFICATION_RESIDENCE}
          photo={image}
          submit={handleSubmitPhoto}
        />
      : <FlexContainer
          flexDirection="column"
          justifyContent="space-between"
          width="100%"
          height="100%"
        >
          <FlexContainer
            margin={'10px auto 50px'}
            justifyContent={'center'}
            width={'100%'}
            flexDirection={'column'}
          >
            <FlexContainer
              padding={'0 30px'}
              justifyContent={'center'}
              flexDirection={'column'}
              alignItems={'center'}
              width={'100%'}
              marginBottom={'40px'}
              flex={'1 0 auto'}
            >
              <FlexContainer
                width="184px"
                height="184px"
                backgroundColor="#fffccc"
                borderRadius="50%"
                justifyContent="center"
                alignItems="center"
                marginBottom="16px"
              >
                <SvgIcon width={82} height={68} {...IconIdentCard} fillColor="#111111" />
              </FlexContainer>
              <PrimaryTextSpan
                fontSize="18px"
                color="#ffffff"
                textAlign={'center'}
                marginBottom={'10px'}
              >
                {t('Proof of Identity')}
              </PrimaryTextSpan>
              <PrimaryTextSpan
                fontSize="13px"
                color="rgba(196, 196, 196, 0.5)"
                textAlign={'center'}
                marginBottom={'20px'}
              >
                {t('Please upload a photo of your Proof of Identity document (Passport, ID card, Driving License, Residence Permit)')}
              </PrimaryTextSpan>
              <IdentifyRequire flexDirection={'column'}>
                <PrimaryTextSpan
                  fontSize="13px"
                  color="#ffffff"
                  textAlign={'center'}
                  marginBottom={'10px'}
                >
                  {t('The document should clearly show')}:
                </PrimaryTextSpan>
                <PrimaryTextSpan
                  fontSize="13px"
                  color="#FFFCCC"
                  textAlign={'center'}
                >
                  {t('Your Full Name')}
                </PrimaryTextSpan>
                <PrimaryTextSpan
                  fontSize="13px"
                  color="#FFFCCC"
                  textAlign={'center'}
                >
                  {t('Your Photo')}
                </PrimaryTextSpan>
                <PrimaryTextSpan
                  fontSize="13px"
                  color="#FFFCCC"
                  textAlign={'center'}
                >
                  {t('Date of Birth')}
                </PrimaryTextSpan>
                <PrimaryTextSpan
                  fontSize="13px"
                  color="#FFFCCC"
                  textAlign={'center'}
                >
                  {t('Expiry Date')}
                </PrimaryTextSpan>
                <PrimaryTextSpan
                  fontSize="13px"
                  color="#FFFCCC"
                  textAlign={'center'}
                >
                  {t('Document Number')}
                </PrimaryTextSpan>
              </IdentifyRequire>
              <FlexContainer>
                <PrimaryTextSpan
                  fontSize="13px"
                  color="#ffffff"
                  marginRight="7px"
                >
                  {t('Extension')}:
                </PrimaryTextSpan>
                <PrimaryTextSpan
                  fontSize="13px"
                  color="#fffccc"
                >
                  {t('png, jpg, psd')}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer>
                <PrimaryTextSpan
                  fontSize="13px"
                  color="#ffffff"
                  marginRight="7px"
                >
                  {t('Allowed maximum size')}:
                </PrimaryTextSpan>
                <PrimaryTextSpan
                  fontSize="13px"
                  color="#fffccc"
                >
                  {t('5MB')}
                </PrimaryTextSpan>
              </FlexContainer>
            </FlexContainer>
          </FlexContainer>
          <FlexContainer
            width="100%"
            alignItems="center"
            justifyContent="center"
            padding="0 16px 40px"
            position="relative"
          >
            {isOpen
              ? <>
                <MenuToUpload flexDirection={'column'}>
                  <input type="file" onChange={handlerUploadImage} accept="image/*" capture="camera" id='fileFromCamera' />
                  <input type="file" onChange={handlerUploadImage} accept="image/*" id='fileWithoutCamera' />
                  <MenuToUploadItem>
                    <label htmlFor={'fileFromCamera'}>
                      <FlexContainer alignItems="center">
                        <FlexContainer
                          width="24px"
                          height="24px"
                          justifyContent="center"
                          alignItems="center"
                          marginRight="14px"
                        >
                          <SvgIcon {...IconCamera} width={24} height={24} fillColor="#ffffff" />
                        </FlexContainer>
                        <PrimaryTextSpan
                          color="#ffffff"
                          fontSize="18px"
                          fontWeight="normal"
                        >
                          {t('Use camera')}
                        </PrimaryTextSpan>
                      </FlexContainer>
                    </label>
                  </MenuToUploadItem>
                  <MenuToUploadItem>
                    <label htmlFor={'fileWithoutCamera'}>
                      <FlexContainer alignItems="center">
                        <FlexContainer
                          width="24px"
                          height="24px"
                          justifyContent="center"
                          alignItems="center"
                          marginRight="14px"
                        >
                          <SvgIcon {...IconPhotos} width={24} height={24} fillColor="#ffffff" />
                        </FlexContainer>
                        <PrimaryTextSpan
                          color="#ffffff"
                          fontSize="18px"
                          fontWeight="normal"
                        >
                          {t('Photos')}
                        </PrimaryTextSpan>
                      </FlexContainer>
                    </label>
                  </MenuToUploadItem>
                </MenuToUpload>
                <PrimaryButton
                  padding="12px"
                  type="button"
                  width="100%"
                  backgroundColor={Colors.NOTIFICATION_BG}
                  onClick={() => setOpen(false)}
                >
                  <PrimaryTextSpan
                    color="#ffffff"
                    fontWeight="bold"
                    fontSize="16px"
                  >
                    {t('Cancel')}
                  </PrimaryTextSpan>
                </PrimaryButton>
              </>
              : <PrimaryButton
                padding="12px"
                type="button"
                width="100%"
                onClick={() => setOpen(true)}
              >
                <PrimaryTextSpan
                  color={Colors.BLACK}
                  fontWeight="bold"
                  fontSize="16px"
                >
                  {t('Upload documents')}
                </PrimaryTextSpan>
              </PrimaryButton>
            }
          </FlexContainer>
        </FlexContainer>}
    </BackFlowLayout>
  );
};

export default AccountVerificationIdentify;

const IdentifyRequire = styled(FlexContainer)`
  background: ${Colors.NOTIFICATION_BG};
  border: 1px solid ${Colors.NOTIFICATION_BG};
  box-sizing: border-box;
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 35px;
`;

const MenuToUpload = styled(FlexContainer)`
  background: ${Colors.NOTIFICATION_BG};
  box-sizing: border-box;
  border-radius: 5px;
  padding: 0;
  margin-bottom: 35px;
  position: absolute;
  bottom: 75px;
  width: calc(100% - 30px);
  input[type=file] {
    display: none;
  }
`;

const MenuToUploadItem = styled(FlexContainer)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 62px;
  padding: 8px 16px;
  text-decoration: none;
  margin-bottom: 1px;
  label {
    width: 100%;
  }
  &:hover {
    text-decoration: none;
  }
  &:first-child {
    border-bottom: 1px solid ${Colors.DARK_BLACK};
  }
`;

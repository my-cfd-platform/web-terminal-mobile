import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import IconCheck from '../assets/svg_no_compress/kyc/icon-send-kyc.svg';
import { PrimaryButton } from '../styles/Buttons';
import { PrimaryTextSpan } from '../styles/TextsElements';
import BackFlowLayout from '../components/BackFlowLayout';
import SvgIcon from '../components/SvgIcon';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Page from '../constants/Pages';

const AccountKYCSuccessPage = () => {
  const { t } = useTranslation();
  const { push } = useHistory();
  const handleClose = () => {
    push(Page.DASHBOARD);
  };
  return (
    <BackFlowLayout pageTitle="" type="close" handleGoBack={handleClose}>
      <FlexContainer
        flexDirection="column"
        flex="1"
        padding="16px"
        overflow="auto"
        alignItems="center"
      >
        <FlexContainer flexDirection="column" flex="1" alignItems="center">
          <FlexContainer marginBottom="32px">
            <SvgIcon {...IconCheck} />
          </FlexContainer>
          <PrimaryTextSpan
            textAlign="center"
            color="#fff"
            fontSize="18px"
            marginBottom="16px"
          >
            {t('Your documents were successfuly send')}
          </PrimaryTextSpan>

          <PrimaryTextSpan
            textAlign="center"
            color="rgba(255, 255, 255, 0.64)"
            fontSize="16px"
            lineHeight="150%"
          >
            {t(
              'Our Compliance Department will review your data in a timely manner. This process usually takes no more than 48 business hours.'
            )}
          </PrimaryTextSpan>
        </FlexContainer>

        <PrimaryButton width="100%" onClick={handleClose}>
          {t('Close')}
        </PrimaryButton>
      </FlexContainer>
    </BackFlowLayout>
  );
};

export default AccountKYCSuccessPage;

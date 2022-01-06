import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import AccountVerificationsList from '../components/AccountVerification/View/AccountVerificationsList';

import BackFlowLayout from '../components/BackFlowLayout';
import Page from '../constants/Pages';
import { KYCdocumentTypeEnum } from '../enums/KYC/KYCdocumentTypeEnum';
import { useStores } from '../hooks/useStores';
import { PrimaryButton } from '../styles/Buttons';
import { FlexContainer } from '../styles/FlexContainer';

import BankCard from '../components/AccountVerification/View/documentTypeView/BankCard';
import IdentityDocument from '../components/AccountVerification/View/documentTypeView/IdentityDocument';
import ProofOfAdress from '../components/AccountVerification/View/documentTypeView/ProofOfAdress';
import AdditionalDocuments from '../components/AccountVerification/View/documentTypeView/AdditionalDocuments';
import { DocumentTypeEnum } from '../enums/DocumentTypeEnum';
import API from '../helpers/API';
import { getProcessId } from '../helpers/getProcessId';
import { PersonalDataKYCEnum } from '../enums/PersonalDataKYCEnum';
import SvgIcon from '../components/SvgIcon';
import IconCheck from '../assets/svg_no_compress/kyc/icon-send-kyc.svg';
import { PrimaryTextSpan } from '../styles/TextsElements';

const AccountVerification = observer(() => {
  const { t } = useTranslation();
  const { mainAppStore, userProfileStore, kycStore } = useStores();
  const { push } = useHistory();

  const renderView = useCallback(() => {
    switch (kycStore.activeDocumentStep) {
      case KYCdocumentTypeEnum.IDENTITY_DOCUMENT:
        return <IdentityDocument />;
      case KYCdocumentTypeEnum.PROOF_OF_ADRESS:
        return <ProofOfAdress />;
      case KYCdocumentTypeEnum.BANK_CARD:
        return <BankCard />;
      case KYCdocumentTypeEnum.ADDITIONAL_DOCUMENT:
        return <AdditionalDocuments />;

      default:
        return <AccountVerificationsList />;
    }
  }, [kycStore.activeDocumentStep]);

  const handleClose = () => {
    if (kycStore.activeDocumentStep === null) {
      return push(Page.ACCOUNT_PROFILE);
    }
    kycStore.closeDocumentStep();
  };

  const sendFile = async (type: DocumentTypeEnum, file: File) => {
    try {
      const response = await API.postDocument(
        type,
        file,
        mainAppStore.initModel.authUrl
      );
      return response;
    } catch (error) {}
  };

  const postPersonalData = async () => {
    try {
      await API.verifyUser(
        { processId: getProcessId() },
        mainAppStore.initModel.authUrl
      );

      const response = await API.getPersonalData(
        getProcessId(),
        mainAppStore.initModel.authUrl
      );
      userProfileStore.setUser(response.data);
    } catch (error) {}
  };

  const handleSubmitKYC = async () => {
    const fileTypesKeys: DocumentTypeEnum[] = Object.keys(
      kycStore.formKYCData
    ).map((el) => +el);
    const filesForSend = fileTypesKeys.filter(
      (el: DocumentTypeEnum) => kycStore.formKYCData[el] !== null
    );
    let response: any[] = [];

    if (filesForSend.length > 0) {
      filesForSend.map(async (fileType) => {
        const file = kycStore.formKYCData[fileType];
        if (file !== null) {
          const res = await sendFile(fileType, file);
          response.push(res);
        }
      });
    }

    try {
      await postPersonalData();
    } catch (error) {}
  };

  const isSubmited = useCallback(() => {
    if (kycStore.filledSteps !== null) {
      return (
        kycStore.filledSteps.filter(
          (el) =>
            el === KYCdocumentTypeEnum.IDENTITY_DOCUMENT ||
            el === KYCdocumentTypeEnum.PROOF_OF_ADRESS
        ).length === 2
      );
    }
    return false;
  }, [kycStore.filledSteps]);

  useEffect(() => {
    if (mainAppStore.isPromoAccount) {
      push(Page.DASHBOARD);
    }
  }, [mainAppStore.isPromoAccount]);

  if (
    userProfileStore.userProfile?.kyc !== PersonalDataKYCEnum.NotVerified &&
    userProfileStore.userProfile?.kyc !== PersonalDataKYCEnum.Restricted
  ) {
    return (
      <BackFlowLayout pageTitle="" type="close">
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
  }

  return (
    <BackFlowLayout
      pageTitle={t('Account verification')}
      handleGoBack={handleClose}
      type="close"
    >
      <FlexContainer flexDirection="column" flex="1">
        <FlexContainer flexDirection="column" flex="1" overflow="auto">
          {renderView()}
        </FlexContainer>
        {kycStore.isVisibleButton && (
          <FlexContainer width="100%" padding="12px 16px">
            <PrimaryButton
              disabled={!isSubmited()}
              width="100%"
              onClick={handleSubmitKYC}
            >
              {t('Send to Verification')}
            </PrimaryButton>
          </FlexContainer>
        )}
      </FlexContainer>
    </BackFlowLayout>
  );
});

export default AccountVerification;

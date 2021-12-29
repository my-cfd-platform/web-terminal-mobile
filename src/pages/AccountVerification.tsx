import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import AccountVerificationsList from '../components/AccountVerification/View/AccountVerificationsList';

import BackFlowLayout from '../components/BackFlowLayout';
import Page from '../constants/Pages';
import { KYCdocumentTypeEnum } from '../enums/KYC/KYCdocumentTypeEnum';
import { useStores } from '../hooks/useStores';
import { PrimaryButton } from '../styles/Buttons';
import { FlexContainer } from '../styles/FlexContainer';

import AdditionalDocuments from '../components/AccountVerification/View/documentTypeView/AdditionalDocuments';
import BankCard from '../components/AccountVerification/View/documentTypeView/BankCard';
import IdentityDocument from '../components/AccountVerification/View/documentTypeView/IdentityDocument';
import ProofOfAdress from '../components/AccountVerification/View/documentTypeView/ProofOfAdress';

const AccountVerification = observer(() => {
  const { t } = useTranslation();
  const { kycStore } = useStores();
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
        <FlexContainer width="100%" padding="12px 16px">
          <PrimaryButton disabled={true} width="100%">
            {t('Send to Verification')}
          </PrimaryButton>
        </FlexContainer>
      </FlexContainer>
    </BackFlowLayout>
  );
});

export default AccountVerification;

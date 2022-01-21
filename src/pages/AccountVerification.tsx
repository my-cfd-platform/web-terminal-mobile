import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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

import apiResponseCodeMessages from '../constants/apiResponseCodeMessages';
import Axios from 'axios';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import { PrimaryTextSpan } from '../styles/TextsElements';
import PreloaderButtonMask from '../components/PreloaderButtonMask';

const AccountVerification = observer(() => {
  const { t } = useTranslation();
  const {
    mainAppStore,
    notificationStore,
    userProfileStore,
    kycStore,
  } = useStores();
  const { push } = useHistory();
  const KYCWrapper = useRef<HTMLDivElement>(null);

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
      if (response.result === OperationApiResponseCodes.Ok) {
        userProfileStore.setUser(response.data);
        push(Page.VERIFICATION_SUCCESS_SEND);
      }
      kycStore.setIsFileLoading(false);
    } catch (error) {
      kycStore.setIsFileLoading(false);
    }
  };

  const handleSubmitKYC = async () => {
    const fileTypesKeys: DocumentTypeEnum[] = Object.keys(
      kycStore.formKYCData
    ).map((el) => +el);
    const filesForSend = fileTypesKeys.filter(
      (el: DocumentTypeEnum) => kycStore.formKYCData[el] !== null
    );
    try {
      if (filesForSend.length === 0) {
        return;
      }
      kycStore.setIsFileLoading(true);
      const response: any = await Axios.all(
        filesForSend.map((item) => {
          return API.postDocument(
            item,
            // @ts-ignore
            kycStore.formKYCData[item],
            mainAppStore.initModel.authUrl
          );
        })
      );

      const fileWrongExtension = response.some(
        (res: any) =>
          res.result === OperationApiResponseCodes.FileWrongExtension
      );

      if (fileWrongExtension) {
        notificationStore.notificationMessage = t(
          apiResponseCodeMessages[OperationApiResponseCodes.FileWrongExtension]
        );
        notificationStore.isSuccessfull = false;
        notificationStore.openNotification();
        kycStore.setIsFileLoading(false);
        return;
      }
      await postPersonalData();
      //
    } catch (error) {
      kycStore.setIsFileLoading(false);
      notificationStore.notificationMessage = t(apiResponseCodeMessages[-8]);
      notificationStore.isSuccessfull = false;
      notificationStore.openNotification();
    }
  };

  const isSubmited = useCallback(() => {
    if (kycStore.filledSteps !== null) {
      if (
        userProfileStore.userProfile?.kyc === PersonalDataKYCEnum.Restricted
      ) {
        return (
          kycStore.filledSteps.filter(
            (el) =>
              el === KYCdocumentTypeEnum.IDENTITY_DOCUMENT ||
              el === KYCdocumentTypeEnum.PROOF_OF_ADRESS
          ).length > 0
        );
      }

      return (
        kycStore.filledSteps.filter(
          (el) =>
            el === KYCdocumentTypeEnum.IDENTITY_DOCUMENT ||
            el === KYCdocumentTypeEnum.PROOF_OF_ADRESS
        ).length === 2
      );
    }
    return false;
  }, [kycStore.filledSteps, userProfileStore.userProfile]);

  useEffect(() => {
    if (KYCWrapper.current) {
      KYCWrapper.current.scrollTop = 0;
    }
  }, [kycStore.activeDocumentStep]);

  return (
    <BackFlowLayout
      pageTitle={t('Account verification')}
      handleGoBack={handleClose}
      type="close"
    >
      <FlexContainer flexDirection="column" flex="1">
        <FlexContainer
          flexDirection="column"
          flex="1"
          overflow="auto"
          ref={KYCWrapper}
        >
          {renderView()}
        </FlexContainer>
        {kycStore.activeDocumentStep === null && (
          <FlexContainer width="100%" padding="12px 16px">
            <FlexContainer
              width="100%"
              flexWrap="wrap"
              flexDirection="column"
              position="relative"
              overflow="hidden"
              borderRadius="8px"
            >
              <PreloaderButtonMask loading={kycStore.isFileLoading} />
              <PrimaryButton
                disabled={!isSubmited()}
                width="100%"
                onClick={handleSubmitKYC}
              >
                <PrimaryTextSpan
                  color="#1C1F26"
                  fontWeight={700}
                  fontSize="16px"
                >
                  {t('Send to Verification')}
                </PrimaryTextSpan>
              </PrimaryButton>
            </FlexContainer>
          </FlexContainer>
        )}
      </FlexContainer>
    </BackFlowLayout>
  );
});

export default AccountVerification;

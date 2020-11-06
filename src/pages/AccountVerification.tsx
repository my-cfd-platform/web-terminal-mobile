import React, { useState } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import accountVerifySteps from '../constants/accountVerifySteps';
import AccountVerificationFlow from '../components/AccountVerification/AccountVerificationFlow';
import AccountVerificationIdentify from '../components/AccountVerification/AccountVerificationIdentify';
import AccountVerificationResidence from '../components/AccountVerification/AccountVerificationResidence';
import AccountVerificationSuccess from '../components/AccountVerification/AccountVerificationSuccess';
import AccountVerificationLargeFile from '../components/AccountVerification/AccountVerificationLargeFile';

const AccountVerification = () => {
  const [stepOfVerification, setStepOfVerification] = useState(
    localStorage.getItem(accountVerifySteps.KYC_STEP) ||
      accountVerifySteps.VERIFICATION_FLOW
  );
  const [lastStep, setLastStep] = useState('');

  const changePage = (name: string) => {
    if (name === accountVerifySteps.VERIFICATION_LARGE_FILE) {
      setLastStep(stepOfVerification);
      setStepOfVerification(name);
    } else {
      localStorage.setItem(accountVerifySteps.KYC_STEP, name);
      setStepOfVerification(name);
    }
  };

  const stepOfIdentify = () => {
    switch (stepOfVerification) {
      case accountVerifySteps.VERIFICATION_FLOW:
        return <AccountVerificationFlow changeStep={changePage} />;

      case accountVerifySteps.VERIFICATION_IDENTIFY:
        return <AccountVerificationIdentify changeStep={changePage} />;

      case accountVerifySteps.VERIFICATION_RESIDENCE:
        return <AccountVerificationResidence changeStep={changePage} />;

      case accountVerifySteps.VERIFICATION_LARGE_FILE:
        return (
          <AccountVerificationLargeFile
            changeStep={changePage}
            lastStep={lastStep}
          />
        );

      case accountVerifySteps.VERIFICATION_SUCCESS:
        return <AccountVerificationSuccess changeStep={changePage} />;

      default:
        return <div></div>;
    }
  };

  return (
    <FlexContainer
      flexDirection="column"
      justifyContent="space-between"
      width="100%"
      height="100%"
    >
      {stepOfIdentify()}
    </FlexContainer>
  );
};

export default AccountVerification;

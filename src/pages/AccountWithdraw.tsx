import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import BackFlowLayout from '../components/BackFlowLayout';

const AccountWithdraw = () => {
  return (
    <BackFlowLayout pageTitle="Withdraw">
      <FlexContainer
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="center"
        padding="0 40px"
      >
        <PrimaryTextSpan fontSize="16px" textAlign="center">
          Please open the Withdrawal section on your desktop device. This
          section will be available on Mobile soon. Sorry for the temporary
          inconvenience
        </PrimaryTextSpan>
      </FlexContainer>
    </BackFlowLayout>
  );
};

export default AccountWithdraw;

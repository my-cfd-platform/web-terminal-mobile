import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import BackFlowLayout from '../components/BackFlowLayout';

const AccountBalanceHistory = () => {
  return (
    <BackFlowLayout pageTitle="Withdraw">
      <FlexContainer
        alignItems="center"
        justifyContent="center"
        height="100%"
        width="100%"
      >
        <PrimaryTextSpan fontSize="16px" color="#fff">
          Coming soon...
        </PrimaryTextSpan>
      </FlexContainer>
    </BackFlowLayout>
  );
};

export default AccountBalanceHistory;

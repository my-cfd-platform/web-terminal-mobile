import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import BackFlowLayout from '../components/BackFlowLayout';
import { useTranslation } from 'react-i18next';

const AccountBalanceHistory = () => {
  const { t } = useTranslation();
  return (
    <BackFlowLayout pageTitle={t('Balance History')}>
      <FlexContainer
        alignItems="center"
        justifyContent="center"
        height="100%"
        width="100%"
      >
        <PrimaryTextSpan fontSize="16px" color="#fff">
          {`${t('Coming soon')}...`}
        </PrimaryTextSpan>
      </FlexContainer>
    </BackFlowLayout>
  );
};

export default AccountBalanceHistory;

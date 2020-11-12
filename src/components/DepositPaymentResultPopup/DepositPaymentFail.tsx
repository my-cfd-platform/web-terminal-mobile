import React, { FC, useEffect, useState } from 'react';
import styled from '@emotion/styled';

import FailImage from '../../assets/images/fail.png';
import { FlexContainer } from '../../styles/FlexContainer';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks/useStores';
import Page from '../../constants/Pages';

const DepositPaymentFail: FC = () => {
  const { mainAppStore, userProfileStore } = useStores();
  const [parsedParams, setParsedParams] = useState('');
  const { replace } = useHistory();
  useEffect(() => {
    urlParams.set('token', mainAppStore.token);
    urlParams.set(
      'active_account_id',
      mainAppStore.accounts.find((item) => item.isLive)?.id || ''
    );
    urlParams.set('lang', mainAppStore.lang);
    urlParams.set('env', 'web_mob');
    urlParams.set('trader_id', userProfileStore.userProfileId || '');
    setParsedParams(urlParams.toString());
  }, [
    mainAppStore.token,
    mainAppStore.lang,
    mainAppStore.accounts,
    userProfileStore.userProfileId,
  ]);
  const urlParams = new URLSearchParams();
  const { t } = useTranslation();

  const replaceCurrentState = () => {
    replace(Page.DASHBOARD);
    return true;
  };
  return (
    <>
      <FlexContainer
        flexDirection="column"
        alignItems="center"
        marginBottom="112px"
      >
        <FlexContainer
          justifyContent={'center'}
          alignItems={'center'}
          marginBottom="40px"
        >
          <img src={FailImage} width={138} />
        </FlexContainer>
        <FailText>{t('Failed')}</FailText>
        <FailDescription>
          {t('Something went wrong.')}
          <br />
          {t('Try again or use another payment method.')}
        </FailDescription>
      </FlexContainer>
      <FlexContainer padding="0 16px" width="100%">
        <OtherMethodsButton
          href={`${
            IS_LIVE ? mainAppStore.initModel.tradingUrl : ''
          }${API_DEPOSIT_STRING}/?${parsedParams}`}
          onClick={replaceCurrentState}
        >
          {t('Back to Deposit')}
        </OtherMethodsButton>
      </FlexContainer>
    </>
  );
};

export default DepositPaymentFail;

const OtherMethodsButton = styled.a`
  background-color: #00ffdd;
  border-radius: 10px;
  width: 100%;
  padding: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #252636;
  text-align: center;
`;

const FailText = styled.span`
  font-weight: 500;
  font-size: 18px;
  line-height: 18px;
  text-align: center;
  color: #ffffff;
  margin-bottom: 18px;
`;

const FailDescription = styled.span`
  font-size: 13px;
  line-height: 16px;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
`;

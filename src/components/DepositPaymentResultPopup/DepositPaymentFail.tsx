import React, { FC, useEffect, useState } from 'react';
import styled from '@emotion/styled';

import { FlexContainer } from '../../styles/FlexContainer';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks/useStores';
import Page from '../../constants/Pages';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../../constants/mixpanelEvents';
import * as FailImage from '../../assets/lotties/fail-icon.json';
import Lottie from 'react-lottie';

const DepositPaymentFail: FC = () => {
  const { mainAppStore, userProfileStore } = useStores();
  const [parsedParams, setParsedParams] = useState('');
  const { replace } = useHistory();

  const getLottieIconOptions = () => {
    return {
      loop: false,

      autoplay: true,
      pause: false,
      animationData: FailImage.default,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
        clearCanvas: false,
      },
    };
  };

  useEffect(() => {
    urlParams.set('token', mainAppStore.token);
    urlParams.set(
      'active_account_id',
      mainAppStore.accounts.find((item) => item.isLive)?.id || ''
    );
    urlParams.set('lang', mainAppStore.lang);
    urlParams.set('env', 'web_mob');
    urlParams.set('trader_id', userProfileStore.userProfileId || '');
    urlParams.set('api', mainAppStore.initModel.tradingUrl);
    urlParams.set('rt', mainAppStore.refreshToken);
    setParsedParams(urlParams.toString());
  }, [
    mainAppStore.token,
    mainAppStore.lang,
    mainAppStore.accounts,
    userProfileStore.userProfileId,
  ]);

  useEffect(() => {
    mixpanel.track(mixpanelEvents.DEPOSIT_PAGE_FAILED);
  }, []);

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
          height="138px"
        >
          <Lottie
            options={getLottieIconOptions()}
            height="136px"
            width="136px"
            isClickToPauseDisabled={true}
          />
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
          href={`${API_DEPOSIT_STRING}/?${parsedParams}`}
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
  &:hover {
    color: #252636;
    text-decoration: none;
  }
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

import React, { FC, useEffect, useState } from 'react';
import styled from '@emotion/styled';

import { FlexContainer } from '../../styles/FlexContainer';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks/useStores';
import Page from '../../constants/Pages';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../../constants/mixpanelEvents';
import SvgIcon from '../SvgIcon';
import { PrimaryTextSpan } from '../../styles/TextsElements';

import * as PendingImage from '../../assets/lotties/pending-icon.json';
import Lottie from 'react-lottie';

const DepositPaymentPending: FC = () => {
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
    urlParams.set('api', mainAppStore.initModel.tradingUrl);
    urlParams.set('rt', mainAppStore.refreshToken);
    setParsedParams(urlParams.toString());
  }, [
    mainAppStore.token,
    mainAppStore.lang,
    mainAppStore.accounts,
    userProfileStore.userProfileId,
  ]);

  const getLottieIconOptions = () => {
    return {
      loop: false,

      autoplay: true,
      pause: false,
      animationData: PendingImage.default,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
        clearCanvas: false,
      },
    };
  };

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
        marginBottom="40px"
        width="100%"
      >
        <FlexContainer
          justifyContent={'center'}
          alignItems={'center'}
          marginBottom="25px"
          height="138px"
        >
          <Lottie
            options={getLottieIconOptions()}
            height="136px"
            width="136px"
            isClickToPauseDisabled={true}
          />
        </FlexContainer>
        <FailText>{t('Pending')}</FailText>
        <PrimaryTextSpan></PrimaryTextSpan>
        <FlexContainer flexDirection="column" padding="4px">
          <PrimaryTextSpan
            fontSize="13px"
            color="rgba(255, 255, 255, 0.4)"
            textAlign="center"
            marginBottom="12px"
          >
            {t('Thank you for your transaction')}
          </PrimaryTextSpan>
          <PrimaryTextSpan
            fontSize="13px"
            color="rgba(255, 255, 255, 0.4)"
            textAlign="center"
            marginBottom="12px"
          >
            {t(
              'Please note, that it is now being processed and it might take up to 2 business days'
            )}
          </PrimaryTextSpan>
          <PrimaryTextSpan
            fontSize="13px"
            color="rgba(255, 255, 255, 0.4)"
            textAlign="center"
          >
            {t('You will receive an update to your e-mail')}
          </PrimaryTextSpan>
        </FlexContainer>
      </FlexContainer>
      <FlexContainer padding="0 16px" width="100%">
        <OtherMethodsButton href={Page.DASHBOARD} onClick={replaceCurrentState}>
          {t('Back to Trading')}
        </OtherMethodsButton>
      </FlexContainer>
    </>
  );
};

export default DepositPaymentPending;

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

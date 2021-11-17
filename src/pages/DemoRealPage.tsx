import React, { useEffect, useState } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import BackFlowLayout from '../components/BackFlowLayout';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { useStores } from '../hooks/useStores';
import { observer } from 'mobx-react-lite';
import mixpanel from 'mixpanel-browser';
import Colors from '../constants/Colors';
import mixpanelEvents from '../constants/mixpanelEvents';
import mixapanelProps from '../constants/mixpanelProps';
import { PrimaryTextSpan } from '../styles/TextsElements';
import SuccessImage from '../assets/images/success.png';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import Fields from '../constants/fields';
import KeysInApi from '../constants/keysInApi';
import Topics from '../constants/websocketTopics';
import API from '../helpers/API';
import { useHistory } from 'react-router';
import Page from '../constants/Pages';
import { HintEnum } from '../enums/HintEnum';

const DemoRealPage = observer(() => {
  const {
    mainAppStore,
    badRequestPopupStore,
    userProfileStore,
    educationStore,
  } = useStores();
  const urlParams = new URLSearchParams();
  const { t } = useTranslation();
  const [parsedParams, setParsedParams] = useState('');
  const { push } = useHistory();

  useEffect(() => {
    urlParams.set('token', mainAppStore.token);
    urlParams.set(
      'active_account_id',
      mainAppStore.accounts.find((item) => item.isLive)?.id || ''
    );
    urlParams.set('env', 'web_mob');
    urlParams.set('lang', mainAppStore.lang);
    urlParams.set('trader_id', userProfileStore.userProfileId || '');
    urlParams.set('api', mainAppStore.initModel.tradingUrl);
    urlParams.set('rt', mainAppStore.refreshToken);
    setParsedParams(urlParams.toString());
  }, [
    mainAppStore.token,
    mainAppStore.lang,
    mainAppStore.accounts,
    userProfileStore,
  ]);

  const sendMixpanelEvents = (demoRealFunds: 'real' | 'demo') => {
    mixpanel.track(mixpanelEvents.DEMO_REAL_WELCOME, {
      [mixapanelProps.DEMO_REAL_FUNDS]: demoRealFunds,
    });
  };

  const selectDemoAccount = async () => {
    const acc = mainAppStore.accounts.find((item) => !item.isLive);
    if (acc) {
      try {
        await API.setKeyValue(
          {
            key: KeysInApi.ACTIVE_ACCOUNT_ID,
            value: acc.id,
          },
          mainAppStore.initModel.tradingUrl
        );
        mainAppStore.activeSession?.send(Topics.SET_ACTIVE_ACCOUNT, {
          [Fields.ACCOUNT_ID]: acc.id,
        });
        mainAppStore.setActiveAccount(acc);
        sendMixpanelEvents('demo');
        mainAppStore.addTriggerDissableOnboarding();
        mainAppStore.isDemoRealPopup = false;
        educationStore.setFTopenHint(HintEnum.DemoACC);
        push(Page.DASHBOARD);
      } catch (error) {
        badRequestPopupStore.openModal();
        badRequestPopupStore.setMessage(`${error}`);
      }
    }
  };

  const selectRealAccount = async () => {
    educationStore.setFTopenHint(HintEnum.Deposit);
    const acc = mainAppStore.accounts.find((item) => item.isLive);
    if (acc) {
      mainAppStore.setActiveAccount(acc);
      mainAppStore.activeSession?.send(Topics.SET_ACTIVE_ACCOUNT, {
        [Fields.ACCOUNT_ID]: acc.id,
      });
      mainAppStore.isLoading = true;
      sendMixpanelEvents('real');



      if (userProfileStore.isBonus) {
        userProfileStore.showBonusPopup();
      } else {
        window.location.href = `${API_DEPOSIT_STRING}/?${parsedParams}`;
      }

      mainAppStore.addTriggerDissableOnboarding();
      mainAppStore.isDemoRealPopup = false;
    }
  };

  useEffect(() => {
    if (!mainAppStore.isDemoRealPopup) {
      push(Page.DASHBOARD);
    }
  }, [mainAppStore.isDemoRealPopup]);

  return (
    <FlexContainer
      backgroundColor="#1C1F26"
      flexDirection="column"
      justifyContent="space-between"
      padding="24px 0"
      flex="1"
    >
      <FlexContainer
        flexDirection="column"
        alignItems="center"
        padding="60px 0 0 0"
      >
        <SuccessImageWrapper src={SuccessImage} />
        <PrimaryTextSpan
          color="#fff"
          fontSize="18px"
          marginBottom="8px"
          fontWeight={500}
        >
          {t('Congratulations!')}
        </PrimaryTextSpan>
        <PrimaryTextSpan color="rgba(196, 196, 196, 0.5)" fontSize="13px">
          {t('You Have Been Successfully Registered')}
        </PrimaryTextSpan>
      </FlexContainer>
      <FlexContainer justifyContent="space-between" padding="0 24px">
        <PracticeOnDemoButton onClick={selectDemoAccount}>
          <PrimaryTextSpan fontSize="13px" fontWeight="bold" color="#fff">
            {t('Practice on Demo')}
          </PrimaryTextSpan>
        </PracticeOnDemoButton>
        <InvestRealFunds onClick={selectRealAccount}>
          <PrimaryTextSpan
            fontSize="13px"
            fontWeight="bold"
            color={Colors.BLACK}
          >
            {t('Deposit')}
          </PrimaryTextSpan>
        </InvestRealFunds>
      </FlexContainer>
    </FlexContainer>
  );
});

export default DemoRealPage;

const PracticeOnDemoButton = styled(ButtonWithoutStyles)`
  background-color: ${Colors.RED};
  border-radius: 10px;
  height: 56px;
  padding: 0 12px;
  width: 100%;
  margin-right: 8px;
  width: 50%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const InvestRealFunds = styled(ButtonWithoutStyles)`
  background-color: ${Colors.ACCENT_BLUE};
  border-radius: 10px;
  height: 56px;
  padding: 0 12px;
  width: 100%;
  font-size: 13px;
  font-weight: bold;
  color: ${Colors.BLACK};
  width: 50%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const SuccessImageWrapper = styled.img`
  display: block;
  object-fit: contain;
  width: 100px;
  height: 100px;
  margin-bottom: 24px;
`;

import React, { useState, useEffect } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import Colors from '../constants/Colors';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { useStores } from '../hooks/useStores';
import { useTranslation } from 'react-i18next';
import SuccessImage from '../assets/images/success.png';
import API from '../helpers/API';
import KeysInApi from '../constants/keysInApi';
import Topics from '../constants/websocketTopics';
import Fields from '../constants/fields';
import Modal from './Modal';

const DemoRealPopup = () => {
  const { mainAppStore, badRequestPopupStore } = useStores();
  const urlParams = new URLSearchParams();
  const { t } = useTranslation();
  const [parsedParams, setParsedParams] = useState('');

  useEffect(() => {
    urlParams.set('token', mainAppStore.token);
    urlParams.set('active_account_id', mainAppStore.activeAccountId);
    urlParams.set('lang', mainAppStore.lang);
    setParsedParams(urlParams.toString());
  }, [mainAppStore.token, mainAppStore.lang, mainAppStore.activeAccountId]);

  const selectDemoAccount = async () => {
    const acc = mainAppStore.accounts.find((item) => !item.isLive);
    if (acc) {
      try {
        await API.setKeyValue({
          key: KeysInApi.ACTIVE_ACCOUNT_ID,
          value: acc.id,
        });
        mainAppStore.activeSession?.send(Topics.SET_ACTIVE_ACCOUNT, {
          [Fields.ACCOUNT_ID]: acc.id,
        });
        mainAppStore.setActiveAccount(acc);
        mainAppStore.isDemoRealPopup = false;
      } catch (error) {
        badRequestPopupStore.openModal();
        badRequestPopupStore.setMessage(error);
      }
    }
  };

  const selectRealAccount = async () => {
    const acc = mainAppStore.accounts.find((item) => item.isLive);
    if (acc) {
      try {
        await API.setKeyValue({
          key: KeysInApi.ACTIVE_ACCOUNT_ID,
          value: acc.id,
        });
        mainAppStore.activeSession?.send(Topics.SET_ACTIVE_ACCOUNT, {
          [Fields.ACCOUNT_ID]: acc.id,
        });
        mainAppStore.setActiveAccount(acc);
        mainAppStore.isDemoRealPopup = false;
        window.location.href = `${API_DEPOSIT_STRING}/?${parsedParams}`;
      } catch (error) {
        badRequestPopupStore.openModal();
        badRequestPopupStore.setMessage(error);
      }
    }
  };
  return (
    <Modal>
      <FlexContainer
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        backgroundColor="#1C1F26"
        flexDirection="column"
        justifyContent="space-between"
        zIndex="103"
        padding="24px 0"
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
            {t('You have been successfully registered')}
          </PrimaryTextSpan>
        </FlexContainer>
        <FlexContainer justifyContent="space-between">
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
    </Modal>
  );
};

export default DemoRealPopup;

const PracticeOnDemoButton = styled(ButtonWithoutStyles)`
  background-color: ${Colors.RED};
  border-radius: 10px;
  height: 56px;
  padding: 20px;
  width: 100%;
  margin-right: 8px;
`;

const InvestRealFunds = styled(ButtonWithoutStyles)`
  background-color: ${Colors.ACCENT_BLUE};
  border-radius: 10px;
  height: 56px;
  padding: 20px;
  width: 100%;
  font-size: 13px;
  font-weight: bold;
  color: ${Colors.BLACK};
`;

const SuccessImageWrapper = styled.img`
  display: block;
  object-fit: contain;
  width: 100px;
  height: 100px;
  margin-bottom: 24px;
`;
import React, { useState, useEffect } from 'react';
import BackFlowLayout from '../components/BackFlowLayout';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { useStores } from '../hooks/useStores';
import { Observer } from 'mobx-react-lite';
import Colors from '../constants/Colors';
import { autorun } from 'mobx';

import IconUSDAcc from '../assets/svg/accounts/icon-usd-account.svg';
import IconDemoAcc from '../assets/svg/accounts/icon-demo-account.svg';
import SvgIcon from '../components/SvgIcon';
import Topics from '../constants/websocketTopics';
import Fields from '../constants/fields';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Page from '../constants/Pages';

const AccountsPage = () => {
  const { push } = useHistory();
  const { t } = useTranslation();
  const { quotesStore, mainAppStore, notificationStore } = useStores();

  const [total, setTotal] = useState(quotesStore.total);

  const handleSwitch = (accId: string) => {
    if (mainAppStore.activeAccount?.id === accId) {
      return;
    }
    
    mainAppStore.activeSession?.send(Topics.SET_ACTIVE_ACCOUNT, {
      [Fields.ACCOUNT_ID]: accId,
    });
    const account = mainAppStore.accounts.find(acc => acc.id === accId);
    account && mainAppStore.setActiveAccount(account);

    notificationStore.notificationMessage = `${t(
      'Your account has been switched on'
    )} ${account?.isLive ? t('Real') : t('Demo')}`;
    notificationStore.isSuccessfull = true;
    notificationStore.openNotification();
    push(Page.DASHBOARD);
  };

  useEffect(
    () =>
      autorun(
        () => {
          setTotal(quotesStore.total);
        },
        { delay: 2000 }
      ),
    []
  );

  return (
    <BackFlowLayout pageTitle="Select Account">
      <FlexContainer flexDirection="column" width="100%">
        <FlexContainer padding="0 16px" marginBottom="8px">
          <PrimaryTextSpan
            color="rgba(255, 255, 255, 0.4)"
            fontSize="13px"
            textTransform="uppercase"
          >
            Usd account
          </PrimaryTextSpan>
        </FlexContainer>

        <Observer>
          {() => (
            <AccountItem onClick={() => handleSwitch(mainAppStore.accounts.find((acc) => acc.isLive)?.id || '')}>
              <FlexContainer marginRight="16px">
                <ImageWrap
                  isActive={
                    mainAppStore.accounts.find((acc) => acc.isLive)?.id ===
                    mainAppStore.activeAccount?.id
                  }
                >
                  <SvgIcon {...IconUSDAcc} fillColor="#1C1F26"></SvgIcon>
                </ImageWrap>
              </FlexContainer>
              <FlexContainer flexDirection="column">
                <PrimaryTextSpan
                  color={
                    mainAppStore.accounts.find((acc) => acc.isLive)?.id ===
                    mainAppStore.activeAccount?.id
                      ? Colors.ACCENT
                      : 'rgba(255, 255, 255, 0.4)'
                  }
                  fontSize="16px"
                  textAlign="left"
                >
                  {mainAppStore.accounts.find((acc) => acc.isLive)?.symbol}
                  {mainAppStore.accounts.find((acc) => acc.isLive)?.balance}
                </PrimaryTextSpan>
                <PrimaryTextSpan
                  color="rgba(196, 196, 196, 0.5)"
                  fontSize="11px"
                  textAlign="left"
                >
                  Total: &nbsp;
                  {mainAppStore.accounts.find((acc) => acc.isLive)?.symbol}
                  {mainAppStore.accounts.find((acc) => acc.isLive)?.id === mainAppStore.activeAccount?.id ? total.toFixed(2) : (0).toFixed(2)}
                  
                </PrimaryTextSpan>
              </FlexContainer>

              <FlexContainer flex="1" justifyContent="flex-end">
                <AccountBadge isActive={!!mainAppStore.activeAccount?.isLive}>
                  Real
                </AccountBadge>
              </FlexContainer>
            </AccountItem>
          )}
        </Observer>

        <FlexContainer padding="0 16px" marginBottom="8px">
          <PrimaryTextSpan
            color="rgba(255, 255, 255, 0.4)"
            fontSize="13px"
            textTransform="uppercase"
          >
            Demo
          </PrimaryTextSpan>
        </FlexContainer>

        <Observer>
          {() => (
            <AccountItem onClick={() => handleSwitch(mainAppStore.accounts.find((acc) => !acc.isLive)?.id || '')}>
              <FlexContainer marginRight="16px">
                <ImageWrap
                  isActive={
                    mainAppStore.accounts.find((acc) => acc.isLive)?.id !==
                    mainAppStore.activeAccount?.id
                  }
                >
                  <SvgIcon {...IconDemoAcc} fillColor="#1C1F26"></SvgIcon>
                </ImageWrap>
              </FlexContainer>
              <FlexContainer flexDirection="column">
                <PrimaryTextSpan
                  color={
                    mainAppStore.accounts.find((acc) => acc.isLive)?.id ===
                    mainAppStore.activeAccount?.id
                      ? Colors.ACCENT
                      : 'rgba(255, 255, 255, 0.4)'
                  }
                  fontSize="16px"
                  textAlign="left"
                >
                  {mainAppStore.accounts.find((acc) => !acc.isLive)?.symbol}
                  {mainAppStore.accounts.find((acc) => !acc.isLive)?.balance}
                </PrimaryTextSpan>
                <PrimaryTextSpan
                  color="rgba(196, 196, 196, 0.5)"
                  fontSize="11px"
                  textAlign="left"
                >
                  Total: &nbsp;
                  {mainAppStore.accounts.find((acc) => !acc.isLive)?.symbol}
                  {mainAppStore.accounts.find((acc) => !acc.isLive)?.id === mainAppStore.activeAccount?.id ? total.toFixed(2) : (0).toFixed(2)}
                </PrimaryTextSpan>
              </FlexContainer>

              <FlexContainer flex="1" justifyContent="flex-end">
                <AccountBadge isActive={!mainAppStore.activeAccount?.isLive}>
                  Demo
                </AccountBadge>
              </FlexContainer>
            </AccountItem>
          )}
        </Observer>
      </FlexContainer>
    </BackFlowLayout>
  );
};

export default AccountsPage;

const AccountItem = styled(ButtonWithoutStyles)`
  display: flex;
  align-items: center;
  background: #2a2d38;
  padding: 8px 16px;
  margin-bottom: 16px;
`;

const ImageWrap = styled(FlexContainer)<{ isActive: boolean }>`
  width: 40px;
  height: 40px;
  background-color: ${(props) =>
    props.isActive ? Colors.ACCENT : 'rgba(196, 196, 196, 0.5)'};
  border-radius: 50%;
  align-items: center;
  justify-content: center;
`;

const AccountBadge = styled.span<{ isActive: boolean }>`
  font-size: 13px;
  font-weight: bold;
  background: ${(props) =>
    props.isActive ? Colors.ACCENT : 'rgba(255, 255, 255, 0.4)'};
  border-radius: 4px;
  padding: 4px 8px;
  text-transform: uppercase;
  width: 64px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

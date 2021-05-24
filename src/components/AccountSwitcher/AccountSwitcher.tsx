import { css, keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import { Observer, observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Fields from '../../constants/fields';
import Topics from '../../constants/websocketTopics';
import { PortfolioTabEnum } from '../../enums/PortfolioTabEnum';
import { useStores } from '../../hooks/useStores';
import { FlexContainer } from '../../styles/FlexContainer';
import Modal from '../Modal';
import AccountSwitchItem from './AccountSwitchItem';

import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './style-carousel.css';
import { FULL_VH } from '../../constants/global';

interface IAccountSwitcherProps {
  show: boolean;
}
const AccountSwitcher = observer(({ show }: IAccountSwitcherProps) => {
  const {
    mainAppStore,
    notificationStore,
    portfolioNavLinksStore,
    userProfileStore,
  } = useStores();

  // helpers
  const { t } = useTranslation();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setRender] = useState(mainAppStore.showAccountSwitcher);
  // --

  // functions
  const handleSwitch = (accId: string) => {
    if (mainAppStore.activeAccount?.id === accId) {
      return;
    }

    mainAppStore.balanceWas = 0;
    mainAppStore.activeSession?.send(Topics.SET_ACTIVE_ACCOUNT, {
      [Fields.ACCOUNT_ID]: accId,
    });
    const account = mainAppStore.accounts.find((acc) => acc.id === accId);

    if (account) {
      mainAppStore.setActiveAccount(account);
      portfolioNavLinksStore.setPortfolioNavLink(PortfolioTabEnum.ACTIVE);
    }
    mainAppStore.isLoading = true;
    // --- --- --- --- ---
    notificationStore.notificationMessage = `${t(
      'Your account has been switched on'
    )} ${account?.isLive ? t('Real') : t('Demo')}`;
    notificationStore.isSuccessfull = true;
    notificationStore.openNotification();
    mainAppStore.closeAccountSwitcher();
  };
  // --

  const handleClickClose = () => {
    mainAppStore.closeAccountSwitcher();
  };

  const onAnimationEnd = () => {
    if (!mainAppStore.showAccountSwitcher) {
      setRender(false);
    }
  };

  useEffect(() => {
    if (mainAppStore.showAccountSwitcher) {
      setRender(true);
    }
  }, [mainAppStore.showAccountSwitcher]);

  return (
    <Modal>
      <Wrapper flexDirection="column" show={show} justifyContent="flex-end">
        <FlexContainer
          height={`calc(${FULL_VH} - 398px)`}
          onClick={handleClickClose}
        />
        <AccountSlider
          className="account-switch-slider"
          show={show}
          onAnimationEnd={onAnimationEnd}
          width="100vw"
        >
          <Observer>
            {() => (
              <OwlCarousel
                className="owl-theme"
                items={1}
                stagePadding={44}
                margin={16}
              >
                {mainAppStore.sortedAccounts.map((acc) => (
                  <AccountSwitchItem
                    className="item"
                    key={acc.id}
                    onSwitch={handleSwitch}
                    account={acc}
                    isActive={mainAppStore.activeAccountId === acc.id}
                  />
                ))}
              </OwlCarousel>
            )}
          </Observer>
        </AccountSlider>
      </Wrapper>
    </Modal>
  );
});

export default AccountSwitcher;

const translateAnimationIn = keyframes`
    from {
      transform: translateY(1000px);
    }
    to {
      transform: translateY(0);
    }
`;

interface IAnimationProps {
  show: boolean;
  onAnimationEnd?: any;
  ref?: any;
}

const translateAnimationOut = keyframes`
    from {
        transform: translateY(0);
    }
    to {
      transform: translateY(1000px);
    }
`;

const Wrapper = styled(FlexContainer)<IAnimationProps>`
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  width: 100%;
  height: ${`calc(${FULL_VH})`};
  overflow: hidden;
  padding-bottom: 16px;
  background: rgba(18, 21, 28, 0.8);
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    backdrop-filter: blur(6px);
  }
`;

const AccountSlider = styled(FlexContainer)<IAnimationProps>`
  animation: ${(props) =>
      props.show ? translateAnimationIn : translateAnimationOut}
    0.8s ease;
`;

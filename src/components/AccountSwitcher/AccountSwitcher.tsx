import { css, keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
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
    console.log(accId);
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

  const handleClickOutside = (e: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      mainAppStore.closeAccountSwitcher();
    }
  };

  const onAnimationEnd = () => {
    if (!mainAppStore.showAccountSwitcher) {
      setRender(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (mainAppStore.showAccountSwitcher) {
      setRender(true);
    }
  }, [mainAppStore.showAccountSwitcher]);

  return (
    <Modal>
      <Wrapper alignItems="flex-end" show={show}>
        <AccountSlider
          className="account-switch-slider"
          show={show}
          ref={wrapperRef}
          onAnimationEnd={onAnimationEnd}
          width="100vw"
        >
          <OwlCarousel
            className="owl-theme"
            items={1}
            stagePadding={44}
            margin={16}
          >
            {mainAppStore.accounts.map((acc, i) => (
              <span className="item">
                <AccountSwitchItem
                  onSwitch={handleSwitch}
                  key={acc.id}
                  account={acc}
                  isActive={mainAppStore.activeAccountId === acc.id}
                />
              </span>
            ))}
          </OwlCarousel>
        </AccountSlider>
      </Wrapper>
    </Modal>
  );
});

export default AccountSwitcher;

const translateAnimationFadeIn = keyframes`
   from { opacity: 0; }
   to { opacity: 1; }
`;

const translateAnimationFadeOut = keyframes(`
  0% {
    opacity: 1; 
    visibility: visible; 
  } 
  99% { 
    opacity: 0;
    visibility: visible; 
  } 
  100% { 
    opacity: 0;  
    visibility: hidden; 
  }
`);

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
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  width: 100%;
  height: 100%;
  overflow: hidden;
  animation: ${(props) =>
    props.show
      ? css`
          ${translateAnimationFadeIn} 0.6s linear forwards
        `
      : css`
          ${translateAnimationFadeOut} 0.3s linear forwards
        `};
  padding-bottom: 16px;
  background: rgba(18, 21, 28, 0.6);
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    backdrop-filter: blur(1px);
  }
`;

const AccountSlider = styled(FlexContainer)<IAnimationProps>`
  animation: ${(props) =>
      props.show ? translateAnimationIn : translateAnimationOut}
    0.8s ease;
`;

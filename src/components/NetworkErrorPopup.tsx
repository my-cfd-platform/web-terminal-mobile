import React, { useEffect, useCallback } from 'react';
import Modal from './Modal';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextParagraph } from '../styles/TextsElements';
import { useStores } from '../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

const NetworkErrorPopup = observer(() => {
  const { badRequestPopupStore, mainAppStore } = useStores();
  const { t } = useTranslation();

  const handleLostConnection = () => {
    badRequestPopupStore.setNetwork(true);
    badRequestPopupStore.initConectionReload();
  };

  const handleSetConnection = () => {
    window.location.reload();
  };

  const handleVisibilityChange = useCallback(() => {
    window.location.reload();
  }, [mainAppStore.socketError]);

  useEffect(() => {
    window.addEventListener('offline', handleLostConnection);
    window.addEventListener('online', handleSetConnection);
    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
      false
    );

    return () => {
      window.removeEventListener('offline', handleLostConnection);
      window.removeEventListener('online', handleSetConnection);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return badRequestPopupStore.isNetworkError ? (
    <Modal>
      <ModalWrap>
        <PrimaryTextParagraph
          fontSize="16px"
          color="#ffffff"
          textAlign="center"
          marginBottom="8px"
        >
          {t('There is no Internet connection')}.
        </PrimaryTextParagraph>
        <PrimaryTextParagraph
          fontSize="14px"
          textAlign="center"
          color="rgba(255, 255, 255, 0.4)"
        >
          {t('Please make sure you are connected to the Internet')}.
        </PrimaryTextParagraph>
        {badRequestPopupStore.isRecconect && (
          <PrimaryTextParagraph
            fontSize="12px"
            textAlign="center"
            color="rgba(255, 255, 255, 0.4)"
          >
            <br />
            {t('Reconnecting')}...
          </PrimaryTextParagraph>
        )}
      </ModalWrap>
    </Modal>
  ) : null;
});

export default NetworkErrorPopup;

const translateAnimationIn = keyframes`
    from {
      transform: translateY(1000px);
    }
    to {
      transform: translateY(0);
    }
`;
const translateAnimationOut = keyframes`
    from {
        transform: translateY(0);
    }
    to {
      transform: translateY(1000px);
    }
`;

const ModalWrap = styled(FlexContainer)`
  position: fixed;
  top: 0%;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-color: #fff;
  min-height: 150px;
  width: 100vw;
  color: #fff;
  padding: 30px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.7);
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(0, 0, 0, 0.34);
    backdrop-filter: blur(12px);
  }
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.25),
    0px 6px 12px rgba(0, 0, 0, 0.25);
  animation: ${translateAnimationIn} 0.5s ease;
`;

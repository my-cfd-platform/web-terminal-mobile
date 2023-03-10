import React, { FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { keyframes, css } from '@emotion/core';
import styled from '@emotion/styled';
import Modal from './Modal';
import LoaderComponent from './LoaderComponent';
import Logo from './Logo';
import { useStores } from '../hooks/useStores';
import { useTranslation } from 'react-i18next';
import LogoMonfex from '../assets/images/logo.png';
import { FULL_VH } from '../constants/global';

interface Props {
  isLoading: boolean;
}

const LoaderFullscreen: FC<Props> = ({ isLoading }) => {
  const { mainAppStore } = useStores();
  const { t } = useTranslation();
  return (
    <FlexContainerMain
      position="fixed"
      top="0"
      left="0"
      right="0"
      minHeight={`calc(${FULL_VH})`}
      zIndex="999"
      backgroundColor="#1C2026"
      isLoading={isLoading}
    >
      <Modal>
        <FixedContainerWrapper isLoading={isLoading}>
          <FlexContainer
            position="fixed"
            top="0"
            left="0"
            right="0"
            minHeight={`calc(${FULL_VH})`}
            zIndex="1000"
            backgroundColor="#1C2026"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <FlexContainer
              alignItems="center"
              justifyContent="center"
              marginBottom="32px"
            >
              <FlexContainer margin="0 6px 0 0" width="250px">
                <Logo src={mainAppStore.initModel.logo || LogoMonfex} />
              </FlexContainer>
            </FlexContainer>
            <FlexContainer alignItems="center">
              <LoaderComponent />
              <TextLoader>{t('Loading')}</TextLoader>
            </FlexContainer>
          </FlexContainer>
        </FixedContainerWrapper>
      </Modal>
    </FlexContainerMain>
  );
};

export default LoaderFullscreen;

const fadeOut = keyframes(`
  0 {
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

const FixedContainerWrapper = styled.div<{ isLoading: boolean }>`
  animation: ${(props) =>
    !props.isLoading &&
    css`
      ${fadeOut} 0.5s linear forwards
    `};
  z-index: 1000;
`;

const FlexContainerMain = styled(FlexContainer)<{ isLoading: boolean }>`
  animation: ${(props) =>
    !props.isLoading &&
    css`
      ${fadeOut} 0.5s linear forwards
    `};
  z-index: 1000;
`;

const TextLoader = styled.span`
  color: rgba(255, 255, 255, 0.4);
  margin-left: 16px;
  font-weight: normal;
  font-size: 12px;
`;

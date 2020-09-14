import styled from '@emotion/styled';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import LoaderComponent from './LoaderComponent';
import Modal from './Modal';

const ServerErrorPopup = () => {
  const { t } = useTranslation();
  const reloadPage = () => {
    window.location.reload();
  };
  //Please wait while we processing your request. Click "Reload" if the request failed to be processed.
  return (
    <Modal>
      <ModalBody zIndex="103">
        <Wrapper>
          <FlexContainer
            flexDirection="column"
            padding="20px"
            alignItems="center"
          >
            <PrimaryTextSpan
              color="#fff"
              fontSize="20px"
              fontWeight="bold"
              marginBottom="16px"
              textAlign="center"
            >
              {t('Something went wrong')}
            </PrimaryTextSpan>
            <PrimaryTextSpan
              color="rgba(255, 255, 255, 0.5)"
              fontSize="16px"
              marginBottom="16px"
              textAlign="center"
            >
              {t('Please wait while we processing your request')}.
            </PrimaryTextSpan>
            <PrimaryTextSpan
              color="rgba(255, 255, 255, 0.5)"
              fontSize="16px"
              marginBottom="20px"
              textAlign="center"
            >
              {t('Click "Reload" if the request failed to be processed')}.
            </PrimaryTextSpan>
            <LoaderComponent />
          </FlexContainer>
          <FlexContainer
            flexDirection="column"
            alignItems="center"
            padding="10px 0"
          >
            <ButtonWithoutStyles onClick={reloadPage}>
              <PrimaryTextSpan fontSize="16px" color="#fff">
                {t('Reload')}
              </PrimaryTextSpan>
            </ButtonWithoutStyles>
          </FlexContainer>
        </Wrapper>
      </ModalBody>
    </Modal>
  );
};

export default ServerErrorPopup;

const Wrapper = styled(FlexContainer)`
  background-color: #23262f;
  border-radius: 14px;
  width: calc(100vw - 60px);
  flex-direction: column;
`;

const ModalBody = styled(FlexContainer)`
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #23262f;
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(35, 38, 47, 0.7);
    backdrop-filter: blur(12px);
  }
`;

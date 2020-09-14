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
  //Please wait while we processing your request. Click "Reload" if the request failed to be processed.
  return (
    <Modal>
      <Wrapper zIndex="103">
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
          <ButtonWithoutStyles onClick={window.location.reload}>
            <PrimaryTextSpan fontSize="16px" color="#fff">
              {t('Reload')}
            </PrimaryTextSpan>
          </ButtonWithoutStyles>
        </FlexContainer>
      </Wrapper>
    </Modal>
  );
};

export default ServerErrorPopup;

const Wrapper = styled(FlexContainer)`
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: fixed;
  background-color: #23262f;
  border-radius: 14px;
  width: calc(100vw - 60px);
  flex-direction: column;
`;

import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useStores } from '../hooks/useStores';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import LoaderComponent from './LoaderComponent';
import Modal from './Modal';

const ServerErrorPopup = observer(() => {
  const { serverErrorPopupStore } = useStores();
  const { push } = useHistory();
  const { t } = useTranslation();

  const reloadPage = () => {
    if (serverErrorPopupStore.reloadPayload) {
      push(serverErrorPopupStore.reloadPayload);
      serverErrorPopupStore.setReloadPayload('');
      serverErrorPopupStore.closeModal();
      return
    }
    window.location.reload();
  };

  return (
    <Modal>
      <ModalBody zIndex="103">
        <Wrapper>
          <MainTextContainer
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
              {t(
                `Please wait while we processing your request or click 'Reload'`
              )}
              .
            </PrimaryTextSpan>
            <LoaderComponent />
          </MainTextContainer>
          <FlexContainer
            flexDirection="column"
            alignItems="center"
            padding="10px 0"
          >
            <ButtonWithoutStyles onClick={reloadPage}>
              <PrimaryTextSpan fontSize="20px" color="#fff">
                {t('Reload')}
              </PrimaryTextSpan>
            </ButtonWithoutStyles>
          </FlexContainer>
        </Wrapper>
      </ModalBody>
    </Modal>
  );
});

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
    background-color: rgba(18, 21, 28, 0.8);
    backdrop-filter: blur(12px);
  }
`;

const MainTextContainer = styled(FlexContainer)`
  border-bottom: 1px solid #1d1e23;
`;

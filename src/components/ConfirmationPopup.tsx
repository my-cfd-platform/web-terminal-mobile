import React, { FC } from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../styles/FlexContainer';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { PrimaryTextSpan, PrimaryTextParagraph } from '../styles/TextsElements';
import { useTranslation } from 'react-i18next';
import LoaderForComponents from './LoaderForComponents';

interface Props {
  confirmAction: (status: boolean) => void;
  isLoading?: boolean;
  isInfo?: boolean;
}

const ConfirmationPopup: FC<Props> = (props) => {
  const { children, confirmAction, isLoading = false, isInfo = false } = props;
  const { t } = useTranslation();

  const handleConfirm = () => confirmAction(true);
  const handleCancel = () => confirmAction(false);

  return (
    <PopupWrap>
      {isLoading && <LoaderForComponents isLoading={isLoading} />}
      <ModalBody flexDirection="column" opacity={isLoading ? '0.35' : '1'}>
        <FlexContainer
          padding="24px 16px"
          justifyContent="center"
          alignItems="center"
        >
          <PrimaryTextParagraph
            color="#ffffff"
            fontSize="13px"
            textAlign="center"
          >
            {children}
          </PrimaryTextParagraph>
        </FlexContainer>

        <ButtonsWrap>
          {!isInfo && (
            <FlexContainer width="50%">
              <ActionButton onClick={handleCancel}>
                <PrimaryTextSpan color="#fff">{t('Cancel')}</PrimaryTextSpan>
              </ActionButton>
            </FlexContainer>
          )}

          <FlexContainer width={isInfo ? "100%" : "50%"}>
            <ActionButton onClick={handleConfirm}>
              <PrimaryTextSpan textTransform={isInfo ? 'uppercase' : 'none'} color={isInfo ? "#ffffff" : "#fffccc"}>{t('Ok')}</PrimaryTextSpan>
            </ActionButton>
          </FlexContainer>
        </ButtonsWrap>
      </ModalBody>
    </PopupWrap>
  );
};

export default ConfirmationPopup;

const PopupWrap = styled(FlexContainer)`
  position: fixed;
  z-index: 99;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(18, 21, 28, 0.8);
  justify-content: center;
  align-items: center;
  text-transform: none;
`;

const ModalBody = styled(FlexContainer)`
  width: 270px;
  border-radius: 16px;
  background-color: #23262f;

  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(35, 38, 47, 0.7);
    backdrop-filter: blur(12px);
  }
`;

const ButtonsWrap = styled(FlexContainer)`
  border-top: 1px solid #000;
`;

const ActionButton = styled(ButtonWithoutStyles)`
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

import React, { useState } from 'react';
import { FULL_VH } from '../constants/global';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import ConfirmationPopup from './ConfirmationPopup';
import Modal from './Modal';

interface InformationPopupProps {
  infoText: string;
}
const InformationPopup = ({ infoText }: InformationPopupProps) => {
  const [on, toggle] = useState(false);
  const handleOpen = () => () => {
    toggle(true);
  };

  const handleConfirm = () => {
    toggle(false);
  };

  return (
    <>
      <ButtonWithoutStyles onClick={handleOpen()}>
        <FlexContainer
          backgroundColor="rgba(255, 255, 255, 0.4)"
          borderRadius="50%"
          height="18px"
          width="18px"
          justifyContent="center"
          alignItems="center"
        >
          <PrimaryTextSpan color="#23262F" fontWeight={700} fontSize="14px">
            i
          </PrimaryTextSpan>
        </FlexContainer>
      </ButtonWithoutStyles>

      {on && (
        <Modal>
          <ConfirmationPopup isInfo confirmAction={handleConfirm}>
            {infoText}
          </ConfirmationPopup>
        </Modal>
      )}
    </>
  );
};

export default InformationPopup;

import React, { useState, FC } from 'react';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import Colors from '../constants/Colors';
import { useTranslation } from 'react-i18next';
import ConfirmationPopup from './ConfirmationPopup';
import LoaderForComponents from './LoaderForComponents';

interface Props {
  applyHandler: () => void;
  buttonLabel?: string;
  isLoadingConfirmation?: boolean;
}

const ClosePositionButton: FC<Props> = (props) => {
  const { applyHandler, buttonLabel, children, isLoadingConfirmation = false } = props;
  const { t } = useTranslation();
  const [on, toggle] = useState(false);

  const handleConfirmAction = (confirm: boolean) => {
    if (confirm) {
      applyHandler();
      toggle(false);
    } else {
      toggle(false);
    }
  };

  const handleClickClose = () => toggle(true);
  return (
    <>
      <ClosePositionBtn onClick={handleClickClose}>
        {isLoadingConfirmation}
        {buttonLabel || t('Close')}
      </ClosePositionBtn>
      {on && (
        <ConfirmationPopup isLoading={isLoadingConfirmation} confirmAction={handleConfirmAction}>
          {children}
        </ConfirmationPopup>
      )}
    </>
  );
};
export default ClosePositionButton;

const ClosePositionBtn = styled(ButtonWithoutStyles)`
  border-radius: 12px;
  background-color: ${Colors.RED};
  color: #ffffff;
  height: 56px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
`;

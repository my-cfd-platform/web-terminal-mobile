import React, { useEffect, FC, useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';
import { FlexContainer } from '../styles/FlexContainer';
import { useTranslation } from 'react-i18next';
import testIds from '../constants/testIds';

interface Props {
  show: boolean;
  isSuccessfull: boolean;
  text?: string;
  toggleNotify: (arg0: boolean) => void;
}

const TimeoutNotificationPopup: FC<Props> = ({
  show,
  isSuccessfull,
  text = ''
}) => {
  const [shouldRender, setRender] = useState(show);
  const [isActiveNotification, setActive] = useState(true);
  const { t } = useTranslation();

  let timer: NodeJS.Timeout;

  useEffect(() => {
    if (show) {
      setRender(true);
    }
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) {
      setRender(false);
    }
  };

  return shouldRender ? (
    <NotificationPopupWrap
      flexDirection="column"
      isSuccessfull={isSuccessfull}
      show={isActiveNotification}
      backgroundColor="#23262f"
      boxShadow="0px 12px 26px #12151c"
      borderRadius="4px"
      width="calc(100% - 30px)"
      margin="0 auto"
      position="fixed"
      padding="16px"
      onAnimationEnd={onAnimationEnd}
      zIndex="999"
      alignItems="center"
    >
      {!isSuccessfull && <ErrorTitie>Oooopsss</ErrorTitie>}
      <NotifyText data-testid={testIds.NOTIFICATION_POPUP_MESSAGE}>
        {t('We are trying to connect to the server')} <br />
        {t('Reconnecting…')}
      </NotifyText>
    </NotificationPopupWrap>
  ) : null;
};

export default TimeoutNotificationPopup;

const translateAnimationIn = keyframes`
    from {
      transform: translateY(-1000px);
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
      transform: translateY(-1000px);
    }
`;

const NotificationPopupWrap = styled(FlexContainer)<{
  isSuccessfull: boolean;
  show: boolean;
}>`
  top: 16px;
  left: 0;
  right: 0;
  animation: ${props =>
      props.show ? translateAnimationIn : translateAnimationOut}
    0.5s ease;
`;

const ErrorTitie = styled.span`
  font-weight: 500;
  font-size: 16px;
  line-height: 18px;
  color: #ed145b;
  margin-bottom: 8px;
  text-align: center;
`;

const NotifyText = styled.p`
  margin: 0;
  padding: 0;
  color: #ffffff;
  line-height: 18px;
  font-size: 13px;
  text-align: center;
`;

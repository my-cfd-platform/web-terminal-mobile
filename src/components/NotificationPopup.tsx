import React, { useEffect, FC, useState } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';
import { useStores } from '../hooks/useStores';
import { observer } from 'mobx-react-lite';
import Colors from '../constants/Colors';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { useTranslation } from 'react-i18next';

interface Props {}

// TODO: can i do it without should render?

const NotificationPopup: FC<Props> = observer(() => {
  const { notificationStore } = useStores();
  const { t } = useTranslation();

  const [shouldRender, setRender] = useState(
    notificationStore.isActiveNotification
  );

  useEffect(() => {
    if (notificationStore.isActiveNotification) {
      setRender(true);
    }
  }, [notificationStore.isActiveNotification]);

  const onAnimationEnd = () => {
    if (!notificationStore.isActiveNotification) {
      setRender(false);
    }
  };

  const closeNotification = () => {
    if (notificationStore.timer) {
      clearTimeout(notificationStore.timer);
    }
    notificationStore.closeNotification();
  };

  useEffect(() => {
    if (notificationStore.isActiveNotification) {
      if (notificationStore.timer) {
        clearTimeout(notificationStore.timer);
      }
      notificationStore.timer = setTimeout(() => {
        notificationStore.closeNotification();
      }, 2000);
    }
    return;
  }, [notificationStore.isActiveNotification]);

  return shouldRender ? (
    <NotificationWrapper
      boxShadow="0px 4px 8px rgba(41, 42, 57, 0.09), 0px 8px 16px rgba(37, 38, 54, 0.24)"
      borderRadius="4px"
      isSuccessfull={notificationStore.isSuccessfull}
      padding="12px 16px"
      position="fixed"
      flexDirection="column"
      top="8px"
      right="8px"
      left="8px"
      zIndex="101"
      show={notificationStore.isActiveNotification}
      onAnimationEnd={onAnimationEnd}
    >
      {notificationStore.isSuccessfull ? (
        <PrimaryTextSpan
          color={Colors.ACCENT_BLUE}
          fontSize="16px"
          fontWeight="bold"
          marginBottom="12px"
        >
          {t('Success')}!
        </PrimaryTextSpan>
      ) : (
        <PrimaryTextSpan
          color={Colors.RED}
          fontSize="16px"
          fontWeight="bold"
          marginBottom="12px"
        >
          {t('Error')}!
        </PrimaryTextSpan>
      )}
      <PrimaryTextSpan fontSize="13px" color="#fff">
        {notificationStore.notificationMessage}
      </PrimaryTextSpan>
    </NotificationWrapper>
  ) : null;
});

export default NotificationPopup;

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

const NotificationWrapper = styled(FlexContainer)<{
  isSuccessfull: boolean;
  show: boolean;
}>`
  width: 100%;
  max-width: 400px;
  animation: ${(props) =>
      props.show ? translateAnimationIn : translateAnimationOut}
    0.5s ease;

  background-color: ${Colors.NOTIFICATION_BG};

  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(35, 38, 47, 0.9);
    backdrop-filter: blur(12px);
  }
`;

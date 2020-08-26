import React, { useEffect, FC, useState } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';
import { useStores } from '../hooks/useStores';
import { observer } from 'mobx-react-lite';
import Colors from '../constants/Colors';
import ImageContainer from './ImageContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { useTranslation } from 'react-i18next';
import { getNumberSign } from '../helpers/getNumberSign';

interface Props {}

// TODO: can i do it without should render?

const NotificationActivePositionPopup: FC<Props> = observer(() => {
  const { activePositionNotificationStore, mainAppStore } = useStores();
  const { t } = useTranslation();

  const [shouldRender, setRender] = useState(
    activePositionNotificationStore.isActiveNotification
  );

  useEffect(() => {
    if (activePositionNotificationStore.isActiveNotification) {
      setRender(true);
    }
  }, [activePositionNotificationStore.isActiveNotification]);

  const onAnimationEnd = () => {
    if (!activePositionNotificationStore.isActiveNotification) {
      setRender(false);
    }
  };

  const closeNotification = () => {
    if (activePositionNotificationStore.timer) {
      clearTimeout(activePositionNotificationStore.timer);
    }
    activePositionNotificationStore.closeNotification();
  };

  useEffect(() => {
    if (activePositionNotificationStore.isActiveNotification) {
      if (activePositionNotificationStore.timer) {
        clearTimeout(activePositionNotificationStore.timer);
      }
      activePositionNotificationStore.timer = setTimeout(() => {
        activePositionNotificationStore.closeNotification();
      }, 5000);
    }
    return;
  }, [activePositionNotificationStore.isActiveNotification]);

  return shouldRender ? (
    <NotificationWrapper
      boxShadow="0px 4px 8px rgba(41, 42, 57, 0.09), 0px 8px 16px rgba(37, 38, 54, 0.24)"
      borderRadius="4px"
      isSuccessfull={activePositionNotificationStore.isSuccessfull}
      padding="12px 16px"
      position="fixed"
      top="8px"
      right="8px"
      left="8px"
      flexDirection="column"
      alignItems="flex-start"
      zIndex="101"
      show={activePositionNotificationStore.isActiveNotification}
      onAnimationEnd={onAnimationEnd}
    >
      <FlexContainer flexDirection="column">
        <FlexContainer marginBottom="8px">
          <FlexContainer width="24px" height="24px" marginRight="8px">
            <ImageContainer
              instrumentId={
                activePositionNotificationStore.notificationMessageData
                  .instrumentId
              }
            />
          </FlexContainer>
          <FlexContainer flexDirection="column" justifyContent="center">
            <PrimaryTextSpan color="#ffffff" fontSize="10px">
              {
                activePositionNotificationStore.notificationMessageData
                  .instrumentName
              }
            </PrimaryTextSpan>
            <PrimaryTextSpan
              fontSize="10px"
              color="rgba(255, 255, 255, 0.4)"
              textTransform="capitalize"
            >
              {
                activePositionNotificationStore.notificationMessageData
                  .instrumentGroup
              }
            </PrimaryTextSpan>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer alignItems="center">
          <PrimaryTextSpan color="#ffffff" fontSize="13px">
            {t('Position Close')}:&nbsp;
          </PrimaryTextSpan>
          <PrimaryTextSpan
            fontSize="13px"
            color={
              activePositionNotificationStore.notificationMessageData.equity > 0
                ? Colors.ACCENT_BLUE
                : Colors.RED
            }
          >
            {getNumberSign(
              activePositionNotificationStore.notificationMessageData.equity
            )}
            {mainAppStore.activeAccount?.symbol}
            {Math.abs(
              activePositionNotificationStore.notificationMessageData.equity
            )}
          </PrimaryTextSpan>
        </FlexContainer>
      </FlexContainer>
    </NotificationWrapper>
  ) : null;
});

export default NotificationActivePositionPopup;

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

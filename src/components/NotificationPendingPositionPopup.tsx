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
import { useSwipeable } from 'react-swipeable';

interface Props {}

// TODO: can i do it without should render?

const NotificationPendingPositionPopup: FC<Props> = observer(() => {
  const { pendingPositionNotificationStore, mainAppStore } = useStores();
  const { t } = useTranslation();

  const [shouldRender, setRender] = useState(
      pendingPositionNotificationStore.isActiveNotification
  );

  useEffect(() => {
    if (pendingPositionNotificationStore.isActiveNotification) {
      setRender(true);
    }
  }, [pendingPositionNotificationStore.isActiveNotification]);

  const handlers = useSwipeable({
    onSwipedUp: () => pendingPositionNotificationStore.closeNotification(),
  });

  const onAnimationEnd = () => {
    if (!pendingPositionNotificationStore.isActiveNotification) {
      setRender(false);
    }
  };

  const closeNotification = () => {
    if (pendingPositionNotificationStore.timer) {
      clearTimeout(pendingPositionNotificationStore.timer);
    }
    pendingPositionNotificationStore.closeNotification();
  };

  useEffect(() => {
    if (pendingPositionNotificationStore.isActiveNotification) {
      if (pendingPositionNotificationStore.timer) {
        clearTimeout(pendingPositionNotificationStore.timer);
      }
      pendingPositionNotificationStore.timer = setTimeout(() => {
        pendingPositionNotificationStore.closeNotification();
      }, 2000);
    }
    return;
  }, [pendingPositionNotificationStore.isActiveNotification]);

  return shouldRender ? (
    <NotificationWrapper
      boxShadow="0px 4px 8px rgba(41, 42, 57, 0.09), 0px 8px 16px rgba(37, 38, 54, 0.24)"
      borderRadius="4px"
      isSuccessfull={pendingPositionNotificationStore.isSuccessfull}
      padding="12px 16px"
      position="fixed"
      top="8px"
      right="8px"
      left="8px"
      flexDirection="column"
      alignItems="flex-start"
      zIndex="101"
      show={pendingPositionNotificationStore.isActiveNotification}
      onAnimationEnd={onAnimationEnd}
      {...handlers}
    >
      <FlexContainer flexDirection="column">
        <FlexContainer marginBottom="8px">
          <FlexContainer width="24px" height="24px" marginRight="8px">
            <ImageContainer
              instrumentId={
                pendingPositionNotificationStore.notificationMessageData
                  .instrumentId
              }
            />
          </FlexContainer>
          <FlexContainer flexDirection="column" justifyContent="center">
            <PrimaryTextSpan color="#ffffff" fontSize="10px">
              {
                pendingPositionNotificationStore.notificationMessageData
                  .instrumentName
              }
            </PrimaryTextSpan>
            <PrimaryTextSpan
              fontSize="10px"
              color="rgba(255, 255, 255, 0.4)"
              textTransform="capitalize"
            >
              {
                pendingPositionNotificationStore.notificationMessageData
                  .instrumentGroup
              }
            </PrimaryTextSpan>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer alignItems="center">
          <>
            <PrimaryTextSpan color="#ffffff" fontSize="13px">
              {t('Position Closed')}:&nbsp;
            </PrimaryTextSpan>
            <PrimaryTextSpan
              fontSize="13px"
              color="#ffffff"
            >
              {mainAppStore.activeAccount?.symbol}
              {Math.abs(
                  pendingPositionNotificationStore.notificationMessageData.investmentAmount
              ).toFixed(2)}
              &nbsp; (at &nbsp;{
                pendingPositionNotificationStore.notificationMessageData.openPrice.toFixed(2)
              })
            </PrimaryTextSpan>
          </>
        </FlexContainer>
      </FlexContainer>
    </NotificationWrapper>
  ) : null;
});

export default NotificationPendingPositionPopup;

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

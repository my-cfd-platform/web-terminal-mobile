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
import Page from '../constants/Pages';
import { useHistory } from 'react-router-dom';

interface Props {}

// TODO: can i do it without should render?

const NotificationActivePositionPopup: FC<Props> = observer(() => {
  const { activePositionNotificationStore, mainAppStore } = useStores();
  const { t } = useTranslation();
  const { push } = useHistory();

  const [shouldRender, setRender] = useState(
    activePositionNotificationStore.isActiveNotification
  );

  useEffect(() => {
    if (activePositionNotificationStore.isActiveNotification) {
      setRender(true);
    }
  }, [activePositionNotificationStore.isActiveNotification]);

  const handlers = useSwipeable({
    onSwipedUp: () => activePositionNotificationStore.closeNotification(),
  });

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

  const handleOpenPosition = () => {
    push(`${Page.PORTFOLIO_MAIN}/active/${
      activePositionNotificationStore.notificationMessageData.positionId
    }`);
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
      boxShadow="0px 12px 26px #12151C"
      borderRadius="5px"
      isSuccessfull={activePositionNotificationStore.isSuccessfull}
      padding="10px 16px"
      position="fixed"
      top="8px"
      right="16px"
      left="16px"
      flexDirection="column"
      alignItems="flex-start"
      zIndex="101"
      show={activePositionNotificationStore.isActiveNotification}
      onAnimationEnd={onAnimationEnd}
      {...handlers}
    >
      <FlexContainer
        flexDirection="column"
        position="relative"
        width="100%"
      >
        <FlexContainer marginBottom="6px">
          <FlexContainer width="36px" height="36px" marginRight="12px">
            <ImageContainer
              instrumentId={
                activePositionNotificationStore.notificationMessageData
                  .instrumentId
              }
            />
          </FlexContainer>
          <FlexContainer flexDirection="column" justifyContent="center">
            <PrimaryTextSpan color="#ffffff" fontSize="12px" lineHeight="18px">
              {
                activePositionNotificationStore.notificationMessageData
                  .instrumentName
              }
            </PrimaryTextSpan>
            <PrimaryTextSpan
              fontSize="12px"
              color="rgba(255, 255, 255, 0.4)"
              textTransform="capitalize"
              lineHeight="18px"
            >
              {
                activePositionNotificationStore.notificationMessageData
                  .instrumentGroup
              }
            </PrimaryTextSpan>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer alignItems="center">
          {activePositionNotificationStore.notificationMessageData.type ===
          'close' ? (
            <>
              <PrimaryTextSpan color="#ffffff" fontSize="12px" lineHeight="18px">
                {t('Position Closed')}:&nbsp;
              </PrimaryTextSpan>
              <PrimaryTextSpan
                fontSize="12px"
                lineHeight="18px"
                color={
                  activePositionNotificationStore.notificationMessageData
                    .equity > 0
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
                ).toFixed(2)}
                &nbsp; (
                {
                  activePositionNotificationStore.notificationMessageData
                    .percentPL
                }
                %)
              </PrimaryTextSpan>
            </>
          ) : (
            <>
              <PrimaryTextSpan color="#ffffff" fontSize="12px" lineHeight="18px">
                {t('Position opened')}.
              </PrimaryTextSpan>
              <FlexContainer
                position="absolute"
                top="10px"
                right="0"
                width="30px"
                height="30px"
                alignItems="center"
                justifyContent="center"
              >
                <NotificationButton
                  color="#77797D"
                  fontSize="18px"
                  lineHeight="24px"
                  fontWeight={600}
                  onClick={handleOpenPosition}
                >
                  {'>'}
                </NotificationButton>
              </FlexContainer>
            </>
          )}
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
  width: calc(100% - 32px);
  max-width: 400px;
  animation: ${(props) =>
      props.show ? translateAnimationIn : translateAnimationOut}
    0.5s ease;

  background-color: #2F323C;

  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(35, 38, 47, 0.9);
    backdrop-filter: blur(12px);
  }
`;

const NotificationButton = styled(PrimaryTextSpan)`
  font-feature-settings: 'ss15' on;
`;

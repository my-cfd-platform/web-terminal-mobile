import React, { useEffect, FC, useState } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import SvgIcon from './SvgIcon';
import { keyframes } from '@emotion/core';
import { useStores } from '../hooks/useStores';
import { observer } from 'mobx-react-lite';
import Colors from '../constants/Colors';

interface Props {
  show: boolean;
}

const NotificationPopup: FC<Props> = observer(({ show }) => {
  const { notificationStore } = useStores();

  const [shouldRender, setRender] = useState(show);
  let test: NodeJS.Timeout;

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
      }, 5000);
    }
    return;
  }, [notificationStore.isActiveNotification]);

  return shouldRender ? (
    <NotificationWrapper
      boxShadow="0px 4px 8px rgba(41, 42, 57, 0.09), 0px 8px 16px rgba(37, 38, 54, 0.24)"
      borderRadius="4px"
      isSuccessfull={notificationStore.isSuccessfull}
      alignItems="center"
      padding="12px 16px"
      justifyContent="space-between"
      position="relative"
      show={show}
      onAnimationEnd={onAnimationEnd}
    >
      {!notificationStore.isSuccessfull && (
        <FlexContainer flexDirection="column">
          <PrimaryTextSpan
            color={Colors.RED}
            fontSize="16px"
            lineHeight="18px"
            marginBottom="4px"
          >
            Error!
          </PrimaryTextSpan>
          <PrimaryTextSpan color="#ffffff" fontSize="12px" lineHeight="18px">
            {notificationStore.notificationMessage}
          </PrimaryTextSpan>
        </FlexContainer>
      )}
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

const NotificationWrapper = styled(FlexContainer)<{isSuccessfull: boolean; show: boolean; }>`
  width: 100%;
  max-width: 400px;
  animation: ${(props) =>
      props.show ? translateAnimationIn : translateAnimationOut}
    0.5s ease;

    background-color: ${Colors.NOTIFICATION_BG};

    @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(35,38,47,0.9);
    backdrop-filter: blur(12px);
  }
    
`;

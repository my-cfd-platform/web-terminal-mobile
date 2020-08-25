import React from 'react';
import { useStores } from '../hooks/useStores';
import { FlexContainer } from '../styles/FlexContainer';
import ImageContainer from './ImageContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { useTranslation } from 'react-i18next';
import Colors from '../constants/Colors';

const NotificationPositionPopup = () => {
  const { notificationStore } = useStores();
  const { t } = useTranslation();
  return (
    <FlexContainer flexDirection="column">
      <FlexContainer marginBottom="8px">
        <FlexContainer width="24px" height="24px" marginRight="8px">
          <ImageContainer
            instrumentId={
              notificationStore.notificationPositionMessage?.imageId || ''
            }
          />
        </FlexContainer>
        <FlexContainer flexDirection="column" justifyContent="center">
          <PrimaryTextSpan color="#ffffff" fontSize="10px">
            {notificationStore.notificationPositionMessage?.intstrument}
          </PrimaryTextSpan>
          <PrimaryTextSpan
            fontSize="10px"
            color="rgba(255, 255, 255, 0.4)"
            textTransform="capitalize"
          >
            {notificationStore.notificationPositionMessage?.groupName}
          </PrimaryTextSpan>
        </FlexContainer>
      </FlexContainer>

      <FlexContainer>
        {notificationStore.notificationPositionMessage?.action === 'close' && (
          <>
            <PrimaryTextSpan color="#ffffff" fontSize="13px">
            {t('Position Close')}:
          </PrimaryTextSpan>
          <PrimaryTextSpan
            color={notificationStore.notificationPositionMessage.isGrow ? Colors.ACCENT_BLUE : Colors.RED}
          >
            {notificationStore.notificationPositionMessage.equity}
          </PrimaryTextSpan>
          </>
        )}

      </FlexContainer>
    </FlexContainer>
  );
};

export default NotificationPositionPopup;

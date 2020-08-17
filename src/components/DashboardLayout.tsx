import React, { FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import NavigationPanel from './NavigationPanel';
import NavBar from './NavBar/NavBar';
import { Observer } from 'mobx-react-lite';
import NotificationPopup from './NotificationPopup';
import { useStores } from '../hooks/useStores';

interface Props {}

const DashboardLayout: FC<Props> = (props) => {
  const { children } = props;
  const { notificationStore } = useStores();
  
  return (
    <DashboardLayoutWrap flexDirection="column">
      <FlexContainer
        position="absolute"
        top="10px"
        left="16px"
        right="16px"
        zIndex="100"
        justifyContent="center"
      >
        <Observer>
          {() => (
            <NotificationPopup
              show={notificationStore.isActiveNotification}
            ></NotificationPopup>
          )}
        </Observer>
      </FlexContainer>
      <NavBar />
      <FlexContainer height="calc(100vh - 128px)">{children}</FlexContainer>
      <NavigationPanel />
    </DashboardLayoutWrap>
  );
};

export default DashboardLayout;

const DashboardLayoutWrap = styled(FlexContainer)`
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

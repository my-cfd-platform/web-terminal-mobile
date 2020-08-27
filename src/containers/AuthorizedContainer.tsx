import React, { FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { Observer } from 'mobx-react-lite';
import NotificationPopup from '../components/NotificationPopup';
import NotificationActivePositionPopup from '../components/NotificationActivePositionPopup';
import NavBar from '../components/NavBar/NavBar';
import ChartContainer from './ChartContainer';
import NavigationPanel from '../components/NavigationPanel';
import { useRouteMatch } from 'react-router-dom';
import Page from '../constants/Pages';
import styled from '@emotion/styled';
import { FULL_VH } from '../constants/global';

const AuthorizedContainer: FC = ({ children }) => {
  const match = useRouteMatch(Page.POSITION_DETAILS);
  const showNavbarAndNav = !match?.isExact;

  return (
    <WrapperLayoutFix
      position="relative"
      width="100vw"
      flexDirection="column"
      overflow="hidden"
    >
      <Observer>
        {() => (
          <>
            <NotificationPopup></NotificationPopup>
            <NotificationActivePositionPopup></NotificationActivePositionPopup>
          </>
        )}
      </Observer>
      {showNavbarAndNav && <NavBar />}
      <FlexContainer
        height={
          showNavbarAndNav ? `calc(${FULL_VH} - 128px)` : `calc(${FULL_VH})`
        }
        flexDirection="column"
      >
        {children}
        <Observer>{() => <ChartContainer />}</Observer>
      </FlexContainer>
      {showNavbarAndNav && <NavigationPanel />}
    </WrapperLayoutFix>
  );
};

export default AuthorizedContainer;

const WrapperLayoutFix = styled(FlexContainer)`
  height: 100vh;
  height: calc(${FULL_VH});
`;

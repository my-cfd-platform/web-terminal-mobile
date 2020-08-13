import React, { FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import NavigationPanel from './NavigationPanel';
import NavBar from './NavBar/NavBar';

interface Props {}

const DashboardLayout: FC<Props> = (props) => {
  const { children } = props;
  return (
    <DashboardLayoutWrap flexDirection="column">
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
`;

import React from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import AccountsSwitchLink from './AccountsSwitchLink';
import { Link, useParams, useRouteMatch } from 'react-router-dom';
import Colors from '../../constants/Colors';
import Page from '../../constants/Pages';
import AccountLabel from './AccountLabel';

const NavBar = () => {
  return (
    <FlexContainer
      width="100vw"
      position="relative"
      alignItems="center"
      justifyContent="center"
      height="48px"
    >
      <AccountLabel />
      <AccountsSwitchLink />
      <DepositLink to={Page.DEPOSIT}>Deposit</DepositLink>
    </FlexContainer>
  );
};

export default NavBar;

const DepositLink = styled(Link)`
  font-size: 16px;
  line-height: 1;
  font-weight: 500;
  color: ${Colors.ACCENT_BLUE};
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
`;

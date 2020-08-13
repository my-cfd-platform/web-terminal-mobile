import React from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import AccountsSwitchLink from './AccountsSwitchLink';
import { Link } from 'react-router-dom';
import Colors from '../../constants/Colors';
import Page from '../../constants/Pages';

const NavBar = () => {
  return (
    <NavBarWrap>
      <AccountsSwitchLink />
      <DepositLink to={Page.DEPOSIT}>Deposit</DepositLink>
    </NavBarWrap>
  );
};

export default NavBar;

const NavBarWrap = styled(FlexContainer)`
  width: 100vw;
  height: 48px;
  align-items: center;
  justify-content: center;
  position: relative;
`;

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
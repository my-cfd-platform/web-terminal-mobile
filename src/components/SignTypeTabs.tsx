import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';
import Page from '../constants/Pages';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { useTranslation } from 'react-i18next';
import Colors from '../constants/Colors';

function SignTypeTabs() {
  const { t } = useTranslation();
  return (
    <NavWrap>
      <CustomNavLink to={Page.SIGN_UP} activeClassName="selected">
        {t('Sign Up')}
      </CustomNavLink>
      <CustomNavLink to={Page.SIGN_IN} activeClassName="selected">
        {t('Log In')}
      </CustomNavLink>
    </NavWrap>
  );
}

export default SignTypeTabs;


const NavWrap = styled(FlexContainer)`
  margin-bottom: 48px;
  width: calc(100% - 32px);
  background-color: ${Colors.INPUT_BG};
  height: 32px;
  justify-content: center;
  border-radius: 8px;
  padding: 2px;

  overflow: hidden;
`;

const CustomNavLink = styled(NavLink)`
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: ${Colors.INPUT_LABEL_TEXT};
  font-size: 12px;
  font-weight: 500;
  transition: all .4s ease;
  &:hover {
    text-decoration: none;
    color: ${Colors.ACCENT};
  }

  &.selected {
    color: ${Colors.ACCENT};
    background-color: #494c53;
    border-radius: 8px;
  }
`;

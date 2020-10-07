import React from 'react';
import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PortfolioTabEnum } from '../../enums/PortfolioTabEnum';
import Page from '../../constants/Pages';
import { FlexContainer } from '../../styles/FlexContainer';
import Colors from '../../constants/Colors';

const PortfolioTab = [
  {
    type: PortfolioTabEnum.ACTIVE,
    name: 'Active',
  },
  {
    type: PortfolioTabEnum.PENDING,
    name: 'Pending',
  },
  {
    type: PortfolioTabEnum.CLOSED,
    name: 'Closed',
  },
];

function PortfolioTypeTabs() {
  const { t } = useTranslation();
  return (
    <NavWrap>
      {PortfolioTab.map((tab) => (
        <CustomNavLink
          key={tab.type}
          to={`${Page.PORTFOLIO_MAIN}/${tab.type}`}
          activeClassName="selected"
        >
          {t(tab.name)}
        </CustomNavLink>
      ))}
    </NavWrap>
  );
}

export default PortfolioTypeTabs;

const NavWrap = styled(FlexContainer)`
  width: 100%;
  background-color: ${Colors.INPUT_BG};
  height: 32px;
  justify-content: center;
  border-radius: 8px;
  padding: 2px;

  overflow: hidden;
`;

const CustomNavLink = styled(NavLink)`
  width: 100%;
  flex: 1;
  flex-basis: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: ${Colors.INPUT_LABEL_TEXT};
  font-size: 12px;
  font-weight: 500;
  transition: all 0.4s ease;
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

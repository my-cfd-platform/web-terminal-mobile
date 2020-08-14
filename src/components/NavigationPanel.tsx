import React from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../styles/FlexContainer';
import { NavLink } from 'react-router-dom';
import Page from '../constants/Pages';
import SvgIcon from './SvgIcon';

import IconMarkets from '../assets/svg/navigation/markets.svg';
import IconPortfolio from '../assets/svg/navigation/portfolio.svg';
import IconChart from '../assets/svg/navigation/chart.svg';
import IconNews from '../assets/svg/navigation/news.svg';
import IconUser from '../assets/svg/navigation/user.svg';
import Colors from '../constants/Colors';

const NavigationPanel = () => {
  return (
    <NavigationPanelWrap>
      <FlexContainer
        justifyContent="space-around"
        alignItems="center"
        width="100%"
        maxWidth="375px"
      >
        <CustomNavLink to={Page.MARKETS} activeClassName="selected">
          <SvgIcon
            {...IconMarkets}
            fillColor="#979797"
            hoverFillColor={Colors.ACCENT}
          />
        </CustomNavLink>
        <CustomNavLink to={Page.PORTFOLIO} activeClassName="selected">
          <SvgIcon
            {...IconPortfolio}
            fillColor="#979797"
            hoverFillColor={Colors.ACCENT}
          />
        </CustomNavLink>
        <CustomNavLink to={Page.DASHBOARD} exact activeClassName="selected">
          <SvgIcon
            {...IconChart}
            fillColor="#979797"
            hoverFillColor={Colors.ACCENT}
          />
        </CustomNavLink>
        <CustomNavLink to={Page.NEWS} activeClassName="selected">
          <SvgIcon
            {...IconNews}
            fillColor="#979797"
            hoverFillColor={Colors.ACCENT}
          />
        </CustomNavLink>
        <CustomNavLink to={Page.ACCOUNT_PROFILE} activeClassName="selected">
          <SvgIcon
            {...IconUser}
            fillColor="#979797"
            hoverFillColor={Colors.ACCENT}
          />
        </CustomNavLink>
      </FlexContainer>
    </NavigationPanelWrap>
  );
};

export default NavigationPanel;

const NavigationPanelWrap = styled(FlexContainer)`
  background-color: ${Colors.BACKGROUD_PAGE};
  align-items: center;
  justify-content: center;
  width: 100%;
  position: fixed;
  z-index: 3;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px 0;
`;

const CustomNavLink = styled(NavLink)`
  &.selected {
    svg {
      fill: ${Colors.ACCENT};
    }
  }
`;

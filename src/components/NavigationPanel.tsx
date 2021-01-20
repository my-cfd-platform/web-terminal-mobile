import React, {useCallback, useEffect} from 'react';
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
import { useStores } from '../hooks/useStores';
import { Observer } from 'mobx-react-lite';
import Topics from '../constants/websocketTopics';
import { ResponseFromWebsocket } from '../types/ResponseFromWebsocket';
import { PositionModelWSDTO } from '../types/Positions';
import { PendingOrderWSDTO } from '../types/PendingOrdersTypes';

const NavigationPanel = () => {
  const { portfolioNavLinksStore, mainAppStore, quotesStore } = useStores();

  const activeOrdersCount = useCallback(() => {
      if (quotesStore.activePositions.length > 10) {
        return '9+';
      } else if (quotesStore.activePositions.length === 10) {
        return '10';
      }
      return `${quotesStore.activePositions.length}`;
    },
    [quotesStore.activePositions]
  );

  useEffect(() => {
    if (mainAppStore.activeAccount) {
      mainAppStore.activeSession?.on(
        Topics.ACTIVE_POSITIONS,
        (response: ResponseFromWebsocket<PositionModelWSDTO[]>) => {
          if (response.accountId === mainAppStore.activeAccount?.id) {
            quotesStore.setActivePositions(response.data);
          }
        }
      );

      mainAppStore.activeSession?.on(
        Topics.PENDING_ORDERS,
        (response: ResponseFromWebsocket<PendingOrderWSDTO[]>) => {
          if (mainAppStore.activeAccount?.id === response.accountId) {
            quotesStore.pendingOrders = response.data;
          }
        }
      );
    }
  }, [mainAppStore.activeAccount]);
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
        <Observer>
          {() => (
            <CustomNavLink
              to={`${Page.PORTFOLIO_MAIN}/${portfolioNavLinksStore.currentPortfolioNav}`}
              activeClassName="selected"
            >
              <SvgIcon
                {...IconPortfolio}
                fillColor="#979797"
                hoverFillColor={Colors.ACCENT}
              />
              <CustomBadge count={activeOrdersCount()}>
                {activeOrdersCount()}
              </CustomBadge>
            </CustomNavLink>
          )}
        </Observer>
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
  /* position: fixed; */
  /* z-index: 3;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%); */
  padding: 16px 0;
`;

const CustomNavLink = styled(NavLink)`
  position: relative;
  &.selected {
    svg {
      fill: ${Colors.ACCENT};
    }
  }
`;

const CustomBadge = styled(FlexContainer)<{ count: string }>`
  display: ${(props) => props.count === '0' ? 'none' : 'flex'};
  background-color: #00ffdd;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  box-sizing: border-box;
  border: 3px solid #1C1F26;
  flex-direction: column;
  overflow: hidden;
  font-size: ${(props) => props.count.length > 1 ? '8px' : '11px'};
  font-weight: 700;
  justify-content: center;
  align-items: center;
  position: absolute;
  color: #1C1F26;
  top: -8px;
  right: -8px;
`;

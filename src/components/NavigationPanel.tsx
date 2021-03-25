import React, { useEffect, useState } from 'react';
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
import { observer } from 'mobx-react-lite';
import Topics from '../constants/websocketTopics';
import { ResponseFromWebsocket } from '../types/ResponseFromWebsocket';
import { PositionModelWSDTO } from '../types/Positions';
import { PendingOrderWSDTO } from '../types/PendingOrdersTypes';

const NavigationPanel = observer(() => {
  const { portfolioNavLinksStore, mainAppStore, quotesStore } = useStores();

  const [orderCount, setOrderCount] = useState<string>('');
  const [oldValue, setOldValue] = useState<string>('');
  const [spin, setSpin] = useState<boolean>(false);

  useEffect(() => {
    setOldValue(`${quotesStore.activePositions.length}`);
    setOrderCount(`${quotesStore.activePositions.length}`);
  }, [quotesStore.activePositions]);

  useEffect(() => {
    let cleanupFunction = false;
    if (mainAppStore.activeAccount) {
      mainAppStore.activeSession?.on(
        Topics.ACTIVE_POSITIONS,
        (response: ResponseFromWebsocket<PositionModelWSDTO[]>) => {
          if (response.accountId === mainAppStore.activeAccount?.id) {
            if(!cleanupFunction) {
              setSpin(true);
              setTimeout(() => setSpin(false), 500);
            }
          }
        }
      );

      mainAppStore.activeSession?.on(
        Topics.PENDING_ORDERS,
        (response: ResponseFromWebsocket<PendingOrderWSDTO[]>) => {
          if (mainAppStore.activeAccount?.id === response.accountId) {
            setSpin(false);
            quotesStore.pendingOrders = response.data;
          }
        }
      );
    }
    return () => {
      cleanupFunction = true
    };
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
        <CustomNavLink
          to={`${Page.PORTFOLIO_MAIN}/${portfolioNavLinksStore.currentPortfolioNav}`}
          activeClassName="selected"
        >
          <SvgIcon
            {...IconPortfolio}
            fillColor="#979797"
            hoverFillColor={Colors.ACCENT}
          />
          <CustomBadge count={orderCount}>
            <CounterOld count={orderCount} spin={spin}>{oldValue}</CounterOld>
            <CounterNew count={orderCount} spin={spin}>{orderCount}</CounterNew>
          </CustomBadge>
          <OutDots spin={spin}></OutDots>
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
});

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
  opacity: ${(props) => props.count === '0' ? 0 : 1};
  position: relative;
  flex-direction: column;
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

const OutDots = styled(FlexContainer)<{ spin: boolean }>`
  display: block;
  position: absolute;
  transition: 0.5s;
  width: ${(props) => props.spin ? '30px' : '16px'};
  height: ${(props) => props.spin ? '30px' : '16px'};
  border-radius: 20px;
  border: ${(props) => props.spin ? '1px dotted #00ffdd' : 'none'};
  top: ${(props) => props.spin ? '-13px' : '-6px'};
  right: ${(props) => props.spin ? '-13px' : '-6px'};
  transition: none;
`;

const CounterOld = styled(FlexContainer)<{ spin: boolean, count: string }>`
  position: absolute;
  transition: ${(props) => props.spin ? '0.5s' : 'none'};
  top: ${(props) => props.spin
    ? (props) => props.count.length === 1 ? '12px' : '10px'
    : (props) => props.count.length === 1 ? '-1px' :'1px'
  };
  left: 50%;
  transform: translateX(-50%);
`;

const CounterNew = styled(FlexContainer)<{ spin: boolean, count: string }>`
  position: absolute;
  transition: ${(props) => props.spin ? '0.5s' : 'none'};
  top: ${(props) => props.spin
    ? (props) => props.count.length === 1 ? '-1px' : '1px'
    : (props) => props.count.length === 1 ? '-12px' :'-10px'
  };
  left: 50%;
  transform: translateX(-50%);
`;

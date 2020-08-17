import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { PortfolioTabEnum } from '../enums/PortfolioTabEnum';
import { FlexContainer } from '../styles/FlexContainer';
import PortfolioTypeTabs from '../components/Portfolio/PortfolioTypeTabs';
import DashboardLayout from '../components/DashboardLayout';
import Page from '../constants/Pages';
import { PrimaryTextSpan } from '../styles/TextsElements';
import Colors from '../constants/Colors';
import { autorun, reaction } from 'mobx';
import { useStores } from '../hooks/useStores';
import { getNumberSign } from '../helpers/getNumberSign';
import { Observer } from 'mobx-react-lite';
import ActivePositionItem from '../components/Portfolio/ActivePositionItem';
import PendingOrderItem from '../components/Portfolio/PendingOrderItem';

const Portfolio = () => {
  let { type } = useParams();
  const { push } = useHistory();
  const { quotesStore, mainAppStore } = useStores();

  const [profit, setProfit] = useState(quotesStore.profit);

  useEffect(() => {
    const dispose = reaction(
      () => quotesStore.profit,
      (newProfit) => setProfit(newProfit),
      {
        delay: 2000,
      }
    );
    return dispose;
  }, []);

  useEffect(() => {
    if (!type) {
      push(`${Page.PORTFOLIO_MAIN}/${PortfolioTabEnum.ACTIVE}`);
    }
  }, [type]);
  return (
    <DashboardLayout>
      <FlexContainer flexDirection="column" width="100%">
        <FlexContainer
          padding="0 16px"
          flexDirection="column"
          position="relative"
          marginBottom="32px"
          width="100%"
        >
          <FlexContainer
            padding="20px 0 12px"
            justifyContent="space-between"
            alignItems="center"
          >
            <PrimaryTextSpan color="#ffffff" fontWeight={600} fontSize="24px">
              Portfolio
            </PrimaryTextSpan>

            <FlexContainer
              flexDirection="column"
              flex="1"
              alignItems="flex-end"
            >
              <Observer>
                {() => (
                  <PrimaryTextSpan fontSize="16px" fontWeight={500}>
                    {mainAppStore.activeAccount?.symbol}
                    {quotesStore.invest.toFixed(2)}
                  </PrimaryTextSpan>
                )}
              </Observer>
              <PrimaryTextSpan
                fontSize="13px"
                fontWeight={500}
                color={profit >= 0 ? Colors.ACCENT_BLUE : Colors.RED}
              >
                {getNumberSign(profit)}
                {mainAppStore.activeAccount?.symbol}
                {Math.abs(profit).toFixed(2)}
              </PrimaryTextSpan>
            </FlexContainer>
          </FlexContainer>
          <PortfolioTypeTabs />
        </FlexContainer>

        <FlexContainer
          maxHeight="calc(100% - 130px)"
          flexDirection="column"
          overflow="auto"
        >
          <Observer>
            {() => (
              <>
                {type === PortfolioTabEnum.PENDING &&
                  quotesStore.sortedPendingOrders.map((item) => (
                    <PendingOrderItem
                      key={item.id}
                      pendingOrder={item}
                      currencySymbol={mainAppStore.activeAccount?.symbol || ''}
                    />
                  ))}
              </>
            )}
          </Observer>
          <Observer>
            {() => (
              <>
                {type === PortfolioTabEnum.ACTIVE &&
                  quotesStore.sortedActivePositions.map((item) => (
                    <ActivePositionItem key={item.id} position={item} />
                  ))}
              </>
            )}
          </Observer>
        </FlexContainer>
      </FlexContainer>
    </DashboardLayout>
  );
};

export default Portfolio;

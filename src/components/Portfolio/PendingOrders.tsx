import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks/useStores';
import PendingOrderItem from './PendingOrderItem';
import EmptyListText from '../EmptyListText';
import { FlexContainer } from '../../styles/FlexContainer';
import { PortfolioTabEnum } from '../../enums/PortfolioTabEnum';
import { useHistory } from 'react-router-dom';
import Page from '../../constants/Pages';

const PendingOrders = () => {
  const { t } = useTranslation();
  const { push } = useHistory();

  const {
    quotesStore,
    mainAppStore,
    historyStore,
    portfolioNavLinksStore,
  } = useStores();

  useEffect(() => {
    historyStore.clearPositionsHistory();
    portfolioNavLinksStore.setPortfolioNavLink(PortfolioTabEnum.PENDING);
  }, []);

  useEffect(() => {
    if (
      quotesStore.sortedPendingOrders.length &&
      mainAppStore.paramsPortfolioPending
    ) {
      const positionId = parseInt(mainAppStore.paramsPortfolioPending);
      const positionById = quotesStore.pendingOrders.find(
        (item) => item.id === positionId
      );
      if (positionById) {
        push(`${Page.PORTFOLIO_MAIN}/pending/${positionId}`);
      } else {
        mainAppStore.setParamsPortfolioPending(null);
      }
    }
  }, [
    mainAppStore.paramsPortfolioPending,
    quotesStore.sortedPendingOrders
  ]);

  return (
    <>
      {quotesStore.sortedPendingOrders.length ? (
        quotesStore.sortedPendingOrders.map((item) => (
          <FlexContainer
            key={item.id}
            marginBottom="2px"
            backgroundColor="rgba(42, 45, 56, 0.5)"
          >
            <PendingOrderItem
              key={item.id}
              pendingOrder={item}
              currencySymbol={mainAppStore.activeAccount?.symbol || ''}
            />
          </FlexContainer>
        ))
      ) : (
        <EmptyListText text={t("You haven't opened any positions yet")} />
      )}
    </>
  );
};

export default PendingOrders;

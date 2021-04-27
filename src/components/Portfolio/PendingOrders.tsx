import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks/useStores';
import PendingOrderItem from './PendingOrderItem';
import EmptyListText from '../EmptyListText';
import { FlexContainer } from '../../styles/FlexContainer';
import { PortfolioTabEnum } from '../../enums/PortfolioTabEnum';

const PendingOrders = () => {
  const { t } = useTranslation();

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

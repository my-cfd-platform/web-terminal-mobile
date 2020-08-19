import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks/useStores';
import PendingOrderItem from './PendingOrderItem';
import EmptyListText from '../EmptyListText';

const PendingOrders = () => {
  const { t } = useTranslation();

  const { quotesStore, mainAppStore } = useStores();
  return (
    <>
      {quotesStore.sortedPendingOrders.length ? (
        quotesStore.sortedPendingOrders.map((item) => (
          <PendingOrderItem
            key={item.id}
            pendingOrder={item}
            currencySymbol={mainAppStore.activeAccount?.symbol || ''}
          />
        ))
      ) : (
        <EmptyListText text={t("You haven't opened any positions yet")} />
      )}
    </>
  );
};

export default PendingOrders;

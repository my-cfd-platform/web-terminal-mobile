import React, { useState, useEffect } from 'react';
import { useStores } from '../../hooks/useStores';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import InfinityScrollList from '../InfinityScrollList';
import ClosedPositionItem from './ClosedPositionItem';
import EmptyListText from '../EmptyListText';
import LoaderForComponents from '../LoaderForComponents';
import { FlexContainer } from '../../styles/FlexContainer';
import { PortfolioTabEnum } from '../../enums/PortfolioTabEnum';
import Page from '../../constants/Pages';
import { useHistory } from 'react-router-dom';

const ClosedPositions = observer(() => {
  const { mainAppStore, historyStore, portfolioNavLinksStore } = useStores();
  const { t } = useTranslation();
  const { push } = useHistory();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (mainAppStore.activeAccountId) {
      if (!historyStore.positionsHistoryReport.positionsHistory.length) {
        historyStore.fetchPositionsHistory().finally(() => {
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    }
  }, [mainAppStore.activeAccountId]);

  useEffect(() => {
    if (
      historyStore.positionsHistoryReport.positionsHistory.length &&
      mainAppStore.paramsPortfolioClosed
    ) {
      const positionId = parseInt(mainAppStore.paramsPortfolioClosed);
      const currentHistoryPosition = historyStore.positionsHistoryReport.positionsHistory.find(
        (item) => item.id === positionId
      );
      if (currentHistoryPosition) {
        push(`${Page.PORTFOLIO_MAIN}/closed/${positionId}`);
      } else {
        mainAppStore.setParamsPortfolioClosed(null);
      }
    }
  }, [
    mainAppStore.paramsPortfolioClosed,
    historyStore.positionsHistoryReport.positionsHistory
  ])

  useEffect(() => {
    portfolioNavLinksStore.setPortfolioNavLink(PortfolioTabEnum.CLOSED);
  }, []);

  return (
    <>
      <LoaderForComponents isLoading={isLoading} />

      {!isLoading && (
        <>
          {historyStore.positionsHistoryReport.positionsHistory.length ? (
            <InfinityScrollList
              getData={historyStore.fetchPositionsHistory}
              listData={historyStore.positionsHistoryReport.positionsHistory}
              isFetching={isLoading}
              // WATCH CLOSELY
              noMoreData={
                historyStore.positionsHistoryReport.totalItems <=
                historyStore.positionsHistoryReport.page *
                  historyStore.positionsHistoryReport.pageSize
              }
            >
              {historyStore.positionsHistoryReport.positionsHistory.map(
                (item) => (
                  <FlexContainer
                    key={item.id}
                    marginBottom="2px"
                    backgroundColor="rgba(42, 45, 56, 0.5)"
                  >
                    <ClosedPositionItem
                      key={item.id}
                      tradingHistoryItem={item}
                      currencySymbol={mainAppStore.activeAccount?.symbol || ''}
                    />
                  </FlexContainer>
                )
              )}
            </InfinityScrollList>
          ) : (
            <EmptyListText text={t("You haven't opened any positions yet")} />
          )}
        </>
      )}
    </>
  );
});

export default ClosedPositions;

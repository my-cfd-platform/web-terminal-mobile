import React, { useState, useCallback, useEffect } from 'react';
import { useStores } from '../../hooks/useStores';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import API from '../../helpers/API';
import { Observer } from 'mobx-react-lite';
import InfinityScrollList from '../InfinityScrollList';
import ClosedPositionItem from './ClosedPositionItem';
import EmptyListText from '../EmptyListText';
import LoaderForComponents from '../LoaderForComponents';

const ClosedPositions = () => {
  const { mainAppStore, historyStore, dateRangeStore } = useStores();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);

  const fetchPositionsHistory = useCallback(
    async (isScrolling = false) => {
      try {
        const response = await API.getPositionsHistory({
          accountId: mainAppStore.activeAccount!.id,
          startDate: dateRangeStore.startDate.valueOf(),
          endDate: moment().valueOf(),
          page: isScrolling ? historyStore.positionsHistoryReport.page + 1 : 1,
          pageSize: 20,
        });

        historyStore.positionsHistoryReport = {
          ...response,
          positionsHistory: isScrolling
            ? [
                ...historyStore.positionsHistoryReport.positionsHistory,
                ...response.positionsHistory,
              ]
            : response.positionsHistory,
        };
      } catch (error) {}
    },
    [
      mainAppStore.activeAccount?.id,
      dateRangeStore.startDate,
      dateRangeStore.endDate,
      historyStore.positionsHistoryReport,
    ]
  );

  useEffect(() => {
    fetchPositionsHistory().finally(() => {
      setIsLoading(false);
    });
    return () => {
      historyStore.positionsHistoryReport = {
        ...historyStore.positionsHistoryReport,
        page: 1,
        positionsHistory: [],
      };
    };
  }, []);

  return (
    <Observer>
      {() => (
        <>
          <LoaderForComponents isLoading={isLoading} />

          {!isLoading && (
            <>
              {historyStore.positionsHistoryReport.positionsHistory.length ? (
                <InfinityScrollList
                  getData={fetchPositionsHistory}
                  listData={
                    historyStore.positionsHistoryReport.positionsHistory
                  }
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
                      <ClosedPositionItem
                        key={item.id}
                        tradingHistoryItem={item}
                        currencySymbol={
                          mainAppStore.activeAccount?.symbol || ''
                        }
                      />
                    )
                  )}
                </InfinityScrollList>
              ) : (
                <EmptyListText
                  text={t("You haven't opened any positions yet")}
                />
              )}
            </>
          )}
        </>
      )}
    </Observer>
  );
};

export default ClosedPositions;

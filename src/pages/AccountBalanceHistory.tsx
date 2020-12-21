import React, { useCallback, useEffect, useState } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import BackFlowLayout from '../components/BackFlowLayout';
import { useTranslation } from 'react-i18next';
import { BalanceHistoryReport } from '../types/HistoryReportTypes';
import API from '../helpers/API';
import { useStores } from '../hooks/useStores';
import InfinityScrollList from '../components/InfinityScrollList';
import Page from '../constants/Pages';
import { useHistory } from 'react-router-dom';
import BalanceHistoryItem from '../components/BalanceHistoryItem';
import moment from 'moment';
import { FULL_VH } from '../constants/global';
import LoaderForComponents from '../components/LoaderForComponents';

const AccountBalanceHistory = () => {
  const { push } = useHistory();
  const { t } = useTranslation();
  const { mainAppStore, dateRangeAccountBalanceStore } = useStores();

  const [isLoading, setIsLoading] = useState(true);
  const [balanceHistoryReport, setBalanceHistoryReport] = useState<
    BalanceHistoryReport
  >({
    balanceHistory: [],
    page: 0,
    pageSize: 20,
    totalItems: 0,
  });
  const [activeItemId, setActiveItemId] = useState<number | null>(null);

  const handleClick = (id: number) => {
    setActiveItemId(activeItemId === id ? null : id);
  };

  const fetchBalanceHistory = useCallback(
    async (isScrolling = false) => {
      setIsLoading(true);
      try {
        const response = await API.getBalanceHistory({
          accountId: mainAppStore.accounts.find((acc) => acc.isLive)!.id,
          endDate: dateRangeAccountBalanceStore.endDate.valueOf(),
          startDate: moment().subtract(1, 'y').valueOf(),
          page: isScrolling ? balanceHistoryReport.page + 1 : 1,
          pageSize: 20,
        });

        const newBalanceHistory: BalanceHistoryReport = {
          ...response,
          balanceHistory: isScrolling
            ? [
                ...balanceHistoryReport.balanceHistory,
                ...response.balanceHistory,
              ]
            : response.balanceHistory,
        };
        setBalanceHistoryReport(newBalanceHistory);
        console.log(newBalanceHistory);
        setIsLoading(false);
      } catch (error) {}
    },
    [
      dateRangeAccountBalanceStore.endDate,
      dateRangeAccountBalanceStore.startDate,
      balanceHistoryReport.page,
      mainAppStore.activeAccount,
    ]
  );
  useEffect(() => {
    if (mainAppStore.activeAccount) {
      fetchBalanceHistory().finally(() => {
        setIsLoading(false);
      });
    } else {
      push(Page.ACCOUNT_PROFILE);
    }
  }, [mainAppStore.activeAccount]);

  return (
    <BackFlowLayout pageTitle={t('Balance History')}>
      {isLoading && <LoaderForComponents isLoading={isLoading} />}
      <FlexContainer
        maxHeight={`calc(${FULL_VH} - 72px)`}
        width="100%"
        flexDirection="column"
        overflow="auto"
        opacity={isLoading ? '0.4' : '1'}
      >
        <InfinityScrollList
          getData={fetchBalanceHistory}
          listData={balanceHistoryReport?.balanceHistory || []}
          isFetching={isLoading}
          // WATCH CLOSELY
          noMoreData={
            balanceHistoryReport.totalItems <
            balanceHistoryReport.page * balanceHistoryReport.pageSize
          }
        >
          {balanceHistoryReport.balanceHistory.map((item) => (
            <BalanceHistoryItem
              key={item.createdAt}
              item={item}
              isActive={activeItemId === item.createdAt}
              handleClick={handleClick}
            />
          ))}
        </InfinityScrollList>
      </FlexContainer>
    </BackFlowLayout>
  );
};

export default AccountBalanceHistory;

import mixpanel from 'mixpanel-browser';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import WithdrawHistoryItem from '../components/Withdraw/WithdrawTabs/WithdrawHistoryItem';
import mixpanelEvents from '../constants/mixpanelEvents';
import mixapanelProps from '../constants/mixpanelProps';
import Page from '../constants/Pages';
import WithdrawContainer from '../containers/WithdrawContainer';
import { WithdrawalHistoryResponseStatus } from '../enums/WithdrawalHistoryResponseStatus';
import API from '../helpers/API';
import { useStores } from '../hooks/useStores';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';

const WithdrawalHistory = observer(() => {
  const { withdrawalStore, mainAppStore } = useStores();
  const { t } = useTranslation();
  const initHistoryList = useCallback(
    async () => {
    withdrawalStore.setLoad();
    try {
      const result = await API.getWithdrawalHistory();
      if (result.status === WithdrawalHistoryResponseStatus.Successful) {
        const sortedList = result.history
          ? result.history.sort(
              (a, b) =>
                moment(b.creationDate).valueOf() -
                moment(a.creationDate).valueOf()
            )
          : result.history;

        withdrawalStore.setHistory(sortedList);
      }
      console.log(result)
      withdrawalStore.endLoad();
    } catch (error) {}
  }, []);

  useEffect(() => {
    initHistoryList();
  }, []);

  useEffect(() => {
    mixpanel.track(mixpanelEvents.WITHDRAW_HISTORY_VIEW, {
      [mixapanelProps.AVAILABLE_BALANCE]:
        mainAppStore.accounts.find((item) => item.isLive)?.balance || 0,
    });
  }, []);

  return (
    <WithdrawContainer backBtn={Page.ACCOUNT_PROFILE}>
      {!withdrawalStore.history && (
        <FlexContainer
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="center"
        >
          <PrimaryTextSpan textAlign="center" fontSize="13px" color="#ffffff">
            {t('No history yet')}
          </PrimaryTextSpan>
        </FlexContainer>
      )}
      <FlexContainer
        flexDirection="column"
        overflow="auto"
        height="100%"
        width="100%"
      >
        {withdrawalStore.history &&
          withdrawalStore.history.map((item) => (
            <WithdrawHistoryItem key={item.id} data={item} />
          ))}
      </FlexContainer>
    </WithdrawContainer>
  );
});

export default WithdrawalHistory;

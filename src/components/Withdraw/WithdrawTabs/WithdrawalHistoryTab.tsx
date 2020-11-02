import mixpanel from 'mixpanel-browser';
import { Observer } from 'mobx-react-lite';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FULL_VH } from '../../../constants/global';
import mixpanelEvents from '../../../constants/mixpanelEvents';
import mixapanelProps from '../../../constants/mixpanelProps';
import { WithdrawalHistoryResponseStatus } from '../../../enums/WithdrawalHistoryResponseStatus';
import API from '../../../helpers/API';
import { useStores } from '../../../hooks/useStores';
import { FlexContainer } from '../../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../../styles/TextsElements';
import LoaderForComponents from '../../LoaderForComponents';
import WithdrawHistoryItem from './WithdrawHistoryItem';

const WithdrawalHistoryTab = () => {
  const { withdrawalStore, mainAppStore } = useStores();
  const { t } = useTranslation();
  const initHistoryList = async () => {
    withdrawalStore.setLoad();
    try {
      const result = await API.getWithdrawalHistory();
      if (result.status === WithdrawalHistoryResponseStatus.Successful) {
        const sortedList = result.history
          ? result.history.sort(
              (a: any, b: any) =>
                moment(b.creationDate).valueOf() -
                moment(a.creationDate).valueOf()
            )
          : result.history;

        withdrawalStore.setHistory(sortedList);
      }
      withdrawalStore.endLoad();
    } catch (error) {}
  };

  const updateHistoryList = () => {
    initHistoryList();
  };

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
    <FlexContainer
      height={`calc(${FULL_VH} - 136px)`}
      overflow="auto"
      width="100%"
      flexDirection="column"
      position="relative"
    >
      <Observer>
        {() => (
          <>
            {withdrawalStore.loading && (
              <LoaderForComponents isLoading={withdrawalStore.loading} />
            )}
            {!withdrawalStore.loading && (
              <>
                {!withdrawalStore.history && (
                  <FlexContainer
                    width="100%"
                    height="100%"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <PrimaryTextSpan
                      textAlign="center"
                      fontSize="13px"
                      color="#ffffff"
                    >
                      {t('No history yet')}
                    </PrimaryTextSpan>
                  </FlexContainer>
                )}
                {withdrawalStore.history &&
                  withdrawalStore.history.map((item) => (
                    <WithdrawHistoryItem
                      key={item.id}
                      data={item}
                      updateHistory={updateHistoryList}
                    />
                  ))}
              </>
            )}
          </>
        )}
      </Observer>
    </FlexContainer>
  );
};

export default WithdrawalHistoryTab;

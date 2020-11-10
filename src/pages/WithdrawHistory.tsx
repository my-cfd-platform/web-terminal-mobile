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
import { PersonalDataKYCEnum } from '../enums/PersonalDataKYCEnum';
import { WithdrawalHistoryResponseStatus } from '../enums/WithdrawalHistoryResponseStatus';
import API from '../helpers/API';
import { useStores } from '../hooks/useStores';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';

const WithdrawalHistory = observer(() => {
  const {
    withdrawalStore,
    mainAppStore,
    notificationStore,
    userProfileStore,
  } = useStores();
  const { t } = useTranslation();
  const initHistoryList = useCallback(async () => {
    withdrawalStore.setLoad();
    try {
      const result = await API.getWithdrawalHistory(
        mainAppStore.initModel.tradingUrl
      );
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

      if (result.status === WithdrawalHistoryResponseStatus.SystemError) {
        notificationStore.isSuccessfull = false;
        notificationStore.notificationMessage = t('Technical Error');
        notificationStore.openNotification();
      }

      withdrawalStore.endLoad();
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (
      userProfileStore.userProfile &&
      mainAppStore.accounts.find((acc) => acc.isLive) &&
      mainAppStore.accounts.find((acc) => acc.isLive)?.balance !== 0 &&
      [
        PersonalDataKYCEnum.Verified,
        PersonalDataKYCEnum.OnVerification,
      ].includes(userProfileStore.userProfile.kyc)
    ) {
      initHistoryList();
    }
  }, [userProfileStore.userProfile, mainAppStore.accounts]);

  useEffect(() => {
    mixpanel.track(mixpanelEvents.WITHDRAW_HISTORY_VIEW, {
      [mixapanelProps.AVAILABLE_BALANCE]:
        mainAppStore.accounts.find((item) => item.isLive)?.balance || 0,
    });


    return () => {
      withdrawalStore.setHistory(null);
    }
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

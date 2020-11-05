import React, { useEffect } from 'react';
import { useStores } from '../hooks/useStores';

import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import mixapanelProps from '../constants/mixpanelProps';
import { observer } from 'mobx-react-lite';
import WithdrawContainer from '../containers/WithdrawContainer';
import WithdrawalFaqLink from '../components/Withdraw/WithdrawalFaqLink';
import WithdrawPaymentList from '../components/Withdraw/WithdrawTabs/WithdrawPaymentList';
import { WithdrawalHistoryResponseStatus } from '../enums/WithdrawalHistoryResponseStatus';
import { WithdrawalStatusesEnum } from '../enums/WithdrawalStatusesEnum';
import API from '../helpers/API';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { useTranslation } from 'react-i18next';
import Page from '../constants/Pages';

const WithdrawList = observer(() => {
  const { mainAppStore, withdrawalStore, userProfileStore } = useStores();
  const { t } = useTranslation();

  useEffect(() => {
    const initHistoryList = async () => {
      withdrawalStore.setLoad();
      try {
        const result = await API.getWithdrawalHistory();
        if (result.status === WithdrawalHistoryResponseStatus.Successful) {
          const isPending = result.history?.some(
            (item) =>
              item.status === WithdrawalStatusesEnum.Pending ||
              item.status === WithdrawalStatusesEnum.Approved
          );

          if (isPending) {
            withdrawalStore.setPendingPopup();
          }
        }
        withdrawalStore.endLoad();
      } catch (error) {}
    };
    initHistoryList();
  }, []);
  useEffect(() => {
    mixpanel.track(mixpanelEvents.WITHDRAW_VIEW, {
      [mixapanelProps.AVAILABLE_BALANCE]:
        mainAppStore.accounts.find((item) => item.isLive)?.balance || 0,
    });
  }, []);

  return (
    <WithdrawContainer backBtn={Page.ACCOUNT_PROFILE}>
      <FlexContainer
        flexDirection="column"
        justifyContent="space-between"
        width="100%"
        height="100%"
      >
        {withdrawalStore.pendingPopup ? (
          <FlexContainer
            height="calc(100% - 75px)"
            alignItems="center"
            justifyContent="center"
            padding="16px"
          >
            <PrimaryTextSpan color="#ffffff" textAlign="center">
              {t('Our Customer support will contact you via')} &nbsp;
              <PrimaryTextSpan color="#FFFCCC">
                {userProfileStore.userProfile?.email || 'your@email.com'}
              </PrimaryTextSpan>
              <br />
              {t('to confirm and proceed with your withdrawal request.')}
              <br />
              {t(
                'Please be note, that you can submit only one withdrawal request at a time'
              )}
            </PrimaryTextSpan>
          </FlexContainer>
        ) : (
          <>
            {mainAppStore.accounts.find((acc) => acc.isLive)?.balance === 0 ? (
              <FlexContainer
                height="calc(100% - 75px)"
                alignItems="center"
                justifyContent="center"
                padding="16px"
              >
                <PrimaryTextSpan color="#ffffff" textAlign="center">
                  {t(
                    'Withdrawal will be available after you deposit money into the system'
                  )}
                </PrimaryTextSpan>
              </FlexContainer>
            ) : (
              <WithdrawPaymentList />
            )}
          </>
        )}
        <WithdrawalFaqLink />
      </FlexContainer>
    </WithdrawContainer>
  );
});

export default WithdrawList;

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { WithdrawalHistoryResponseStatus } from '../enums/WithdrawalHistoryResponseStatus';
import { WithdrawalStatusesEnum } from '../enums/WithdrawalStatusesEnum';
import API from '../helpers/API';
import { useStores } from '../hooks/useStores';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { WithdrawalHistoryModel } from '../types/WithdrawalTypes';
import ClosePositionButton from '../components/ClosePositionButton';
import moment from 'moment';
import { WithdrawHistoryStatusName } from '../enums/WithdrawHistoryStatusName';
import Page from '../constants/Pages';
import WithdrawContainer from '../containers/WithdrawContainer';

interface QueryProps {
  id: string;
}

const WithdrawalHistoryDetails = () => {
  const { t } = useTranslation();
  const { id: withdrawalId } = useParams<QueryProps>();
  const { withdrawalStore, notificationStore, mainAppStore } = useStores();
  const { push } = useHistory();
  const [item, setItem] = useState<WithdrawalHistoryModel>();

  const handleCancel = async () => {
    try {
      const result = await API.cancelWithdrawal(
        {
          withdrawalId,
        },
        mainAppStore.initModel.tradingUrl
      );
      if (result.status === WithdrawalHistoryResponseStatus.Successful) {
        withdrawalStore.closePendingPopup();
        push(Page.WITHDRAW_HISTORY);

        notificationStore.isSuccessfull = true;
        notificationStore.notificationMessage = t(
          'A withdrawal request has been cancelled'
        );
        notificationStore.openNotification();
      }
    } catch (error) {}
  };

  useEffect(() => {
    const withdrawalItem = withdrawalStore.history?.find(
      (item) => item.id === withdrawalId
    );
    if (withdrawalItem) {
      setItem(withdrawalItem);
    } else {
      push(Page.WITHDRAW_HISTORY);
    }
  }, []);

  return (
    <WithdrawContainer backBtn={Page.WITHDRAW_HISTORY}>
      <FlexContainer
        width="100%"
        height="100%"
        flexDirection="column"
        justifyContent="space-between"
      >
        <FlexContainer width="100%" flexDirection="column">
          <FlexContainer
            width="100%"
            padding="8px 16px"
            justifyContent="space-between"
          >
            <PrimaryTextSpan color="#fff" fontSize="16px">
              {t('Opening Time')}
            </PrimaryTextSpan>
            <PrimaryTextSpan fontSize="16px">
              {moment(item?.creationDate).local(true).format('HH:mm, DD MMM YYYY')}
            </PrimaryTextSpan>
          </FlexContainer>

          <FlexContainer
            width="100%"
            padding="8px 16px"
            justifyContent="space-between"
          >
            <PrimaryTextSpan color="#fff" fontSize="16px">
              {t('Amount')}
            </PrimaryTextSpan>
            <PrimaryTextSpan fontSize="16px">
              ${item?.amount.toFixed(2)}
            </PrimaryTextSpan>
          </FlexContainer>

          <FlexContainer
            width="100%"
            padding="8px 16px"
            justifyContent="space-between"
          >
            <PrimaryTextSpan color="#fff" fontSize="16px">
              {t('Status')}
            </PrimaryTextSpan>
            <PrimaryTextSpan fontSize="16px">
              {t(WithdrawHistoryStatusName[item?.status || 0])}
            </PrimaryTextSpan>
          </FlexContainer>
        </FlexContainer>

        {item?.status === WithdrawalStatusesEnum.Pending && (
          <FlexContainer width="100%" padding="16px">
            <ClosePositionButton applyHandler={handleCancel}>
              {t('Confirm closing of')}&nbsp;
              <PrimaryTextSpan color="#ffffff">
                {t('withdrawal request')}
              </PrimaryTextSpan>
            </ClosePositionButton>
          </FlexContainer>
        )}
      </FlexContainer>
    </WithdrawContainer>
  );
};

export default WithdrawalHistoryDetails;

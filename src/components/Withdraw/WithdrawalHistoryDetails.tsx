import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { WithdrawalHistoryResponseStatus } from '../../enums/WithdrawalHistoryResponseStatus';
import { WithdrawalStatusesEnum } from '../../enums/WithdrawalStatusesEnum';
import API from '../../helpers/API';
import { useStores } from '../../hooks/useStores';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { WithdrawalHistoryModel } from '../../types/WithdrawalTypes';
import ClosePositionButton from '../ClosePositionButton';
import moment from 'moment';
import { WithdrawHistoryStatusName } from '../../enums/WithdrawHistoryStatusName';
import Page from '../../constants/Pages';

interface QueryProps {
  type: string;
}
const WithdrawalHistoryDetails = () => {
  const { t } = useTranslation();
  const { type } = useParams<QueryProps>();
  const { withdrawalStore, notificationStore } = useStores();
  const { push } = useHistory();
  const [item, setItem] = useState<WithdrawalHistoryModel>();

  const withdrawalId = type;
  const handleCancel = async () => {
    try {
      const result = await API.cancelWithdrawal({
        withdrawalId,
      });
      if (result.status === WithdrawalHistoryResponseStatus.Successful) {
        withdrawalStore.closePendingPopup();
        push(Page.ACCOUNT_WITHDRAW_HISTORY);

        notificationStore.isSuccessfull = true;
        notificationStore.notificationMessage = t('A withdrawal request has been cancelled');
        notificationStore.openNotification();

      }
    } catch (error) {}
  };

  useEffect(() => {
    const withdrawalItem = withdrawalStore.history?.find(
      (item) => item.id === type
    );
    if (withdrawalItem) {
      setItem(withdrawalItem);
    } else {
      push(Page.ACCOUNT_WITHDRAW_HISTORY);
    }
  }, []);

  return (
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
            {moment(item?.creationDate).format('HH:MM, DD MMM YYYY')}
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
          <PrimaryTextSpan fontSize="16px">${item?.amount}</PrimaryTextSpan>
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
            {WithdrawHistoryStatusName[item?.status || 0]}
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
  );
};

export default WithdrawalHistoryDetails;

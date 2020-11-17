import styled from '@emotion/styled';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import Page from '../../../constants/Pages';
import { PaymentNameEnum } from '../../../enums/PaymentNameEnum';
import { WithdrawalStatusesEnum } from '../../../enums/WithdrawalStatusesEnum';
import { FlexContainer } from '../../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../../styles/TextsElements';
import { WithdrawalHistoryModel } from '../../../types/WithdrawalTypes';
import moment from 'moment';
import { WithdrawHistoryStatusName } from '../../../enums/WithdrawHistoryStatusName';
import Colors from '../../../constants/Colors';

interface Props {
  data: WithdrawalHistoryModel;
}

const WithdrawHistoryItem: FC<Props> = ({ data }) => {
  const selectStatusColor = (status: WithdrawalStatusesEnum | null) => {
    switch (status) {
      case WithdrawalStatusesEnum.Pending:
        return 'rgba(255, 255, 255, 0.4)';
      case WithdrawalStatusesEnum.Canceled:
        return '#FF557E';
      case WithdrawalStatusesEnum.Approved:
        return Colors.ACCENT_BLUE;
      case WithdrawalStatusesEnum.Declined:
        return '#FF557E';
      default:
        return 'rgba(255, 255, 255, 0.4)';
    }
  };

  return (
    <ItemLink to={`${Page.WITHDRAW_HISTORY}/${data.id}`}>
      <FlexContainer
        width="100%"
        marginBottom="2px"
        padding="12px 16px"
        justifyContent="space-between"
        height="80px"
        minHeight="80px"
        alignItems="center"
      >
        <FlexContainer flexDirection="column">
          <PrimaryTextSpan color="#ffffff" fontSize="16px">
            {PaymentNameEnum[data.type || 0]}
          </PrimaryTextSpan>
          <PrimaryTextSpan color="rgba(255, 255, 255, 0.4)" lineHeight="1.8">
            {moment(data.creationDate).local(true).format('HH:MM, DD MMM YYYY')}
          </PrimaryTextSpan>
        </FlexContainer>

        <FlexContainer flexDirection="column" alignItems="flex-end">
          <PrimaryTextSpan fontSize="18px">
            ${data.amount.toFixed(2)}
          </PrimaryTextSpan>
          <PrimaryTextSpan
            color={selectStatusColor(data.status || 0)}
            lineHeight="1.8"
          >
            {WithdrawHistoryStatusName[data.status || 0]}
          </PrimaryTextSpan>
        </FlexContainer>
      </FlexContainer>
    </ItemLink>
  );
};

export default WithdrawHistoryItem;

const ItemLink = styled(Link)`
  background-color: rgba(42, 45, 56, 0.5);
  transition: all 0.4s ease;

  &:active {
    background-color: rgba(42, 45, 56, 0.8);
  }

  text-decoration: none;
  &:hover,
  &:active,
  &:focus,
  &:visited {
    text-decoration: none;
  }
`;

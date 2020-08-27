import React, { FC } from 'react';
import { PositionModelWSDTO } from '../../types/Positions';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import ImageContainer from '../ImageContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { useStores } from '../../hooks/useStores';
import ActivePositionPnL from './ActivePositionPnL';
import { Link, useParams } from 'react-router-dom';
import Page from '../../constants/Pages';
import { PositionHistoryDTO } from '../../types/HistoryReportTypes';
import { calculateInPercent } from '../../helpers/calculateInPercent';
import { AskBidEnum } from '../../enums/AskBid';
import Colors from '../../constants/Colors';

interface Props {
  tradingHistoryItem: PositionHistoryDTO;
  currencySymbol: string;
}

const ActivePositionItem: FC<Props> = ({ tradingHistoryItem }) => {
  const { mainAppStore, instrumentsStore } = useStores();
  const { type } = useParams();
  const {
    id,
    instrument,
    profit,
    investmentAmount,
    operation,
  } = tradingHistoryItem;

  const isBuy = operation === AskBidEnum.Buy;

  const groupName = (instrument: string) => {
    const groupId =
      instrumentsStore.instruments.find(
        (item) => item.instrumentItem.id === instrument
      )?.instrumentItem.groupId || '';
    return groupId.toLowerCase();
  };

  return (
    <InstrumentItem to={`${Page.PORTFOLIO_MAIN}/${type}/${id}`}>
      <FlexContainer width="48px" height="48px" marginRight="16px">
        <ImageContainer instrumentId={instrument} />
      </FlexContainer>

      <FlexContainer flexDirection="column" justifyContent="center">
        <PrimaryTextSpan
          color="#ffffff"
          fontSize="16px"
          fontWeight={500}
          lineHeight="1"
          marginBottom="6px"
        >
          {instrument}
        </PrimaryTextSpan>
        <PrimaryTextSpan
          color="rgba(255, 255, 255, 0.4)"
          fontSize="16px"
          fontWeight={500}
          lineHeight="1"
          textTransform="capitalize"
        >
          {groupName(instrument)}
        </PrimaryTextSpan>
      </FlexContainer>

      <FlexContainer
        flexDirection="column"
        flex="1"
        alignItems="flex-end"
        justifyContent="center"
      >
        <PrimaryTextSpan fontSize="16px" color="#fffccc" marginBottom="4px">
          {mainAppStore.activeAccount?.symbol}
          {tradingHistoryItem.investmentAmount.toFixed(2)}
        </PrimaryTextSpan>

        <QuoteTextLabel isGrowth={isBuy}>
          {profit >= 0 ? '+' : ''}
          {calculateInPercent(investmentAmount, profit)}%
        </QuoteTextLabel>
      </FlexContainer>
    </InstrumentItem>
  );
};

export default ActivePositionItem;

const InstrumentItem = styled(Link)`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 16px;
  transition: all 0.4s ease;

  &:hover,
  &:focus {
    background-color: rgba(42, 45, 56, 0.9);
  }
`;

const QuoteTextLabel = styled(FlexContainer)<{ isGrowth?: boolean }>`
  background-color: ${(props) =>
    props.isGrowth ? Colors.ACCENT_BLUE : Colors.RED};
  color: ${(props) => (props.isGrowth ? '#000000' : '#ffffff')};
  border-radius: 4px;
  padding: 2px 4px;
  font-size: 13px;
`;

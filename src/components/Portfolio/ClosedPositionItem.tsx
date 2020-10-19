import React, { FC, useCallback } from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import ImageContainer from '../ImageContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { useStores } from '../../hooks/useStores';
import { useParams, useHistory } from 'react-router-dom';
import Page from '../../constants/Pages';
import { PositionHistoryDTO } from '../../types/HistoryReportTypes';
import Colors from '../../constants/Colors';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import ItemOperationLabel from './ItemOperationLabel';

interface Props {
  tradingHistoryItem: PositionHistoryDTO;
  currencySymbol: string;
}

const ClosedPositionItem: FC<Props> = ({
  tradingHistoryItem,
  currencySymbol,
}) => {
  const { mainAppStore, instrumentsStore, historyStore } = useStores();
  const { push } = useHistory();
  const { type } = useParams<{ type: string }>();
  const { id, instrument, profit, operation } = tradingHistoryItem;

  const groupName = (instrument: string) => {
    const groupId =
      instrumentsStore.instruments.find(
        (item) => item.instrumentItem.id === instrument
      )?.instrumentItem.groupId || '';
    return groupId.toLowerCase();
  };

  const activeInstrument = useCallback(() => {
    return instrumentsStore.instruments.find(
      (item) => item.instrumentItem.id === instrument
    )?.instrumentItem;
  }, [tradingHistoryItem]);

  const handleClickOpen = () => {
    push(`${Page.PORTFOLIO_MAIN}/${type}/${id}`);
  };

  return (
    <InstrumentItem onClick={handleClickOpen}>
      <FlexContainer width="48px" height="48px" marginRight="16px">
        <ImageContainer instrumentId={instrument} />
      </FlexContainer>

      <FlexContainer
        flexDirection="column"
        justifyContent="center"
        alignItems="flex-start"
      >
        <PrimaryTextSpan
          color="#ffffff"
          fontSize="16px"
          fontWeight={500}
          lineHeight="1"
          marginBottom="6px"
        >
          <FlexContainer alignItems="center">
            {activeInstrument()?.name}{' '}
            <ItemOperationLabel operation={operation} />
          </FlexContainer>
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

        <QuoteTextLabel isGrowth={profit >= 0}>
          {profit >= 0 ? '+' : '-'}
          {currencySymbol}
          {Math.abs(profit).toFixed(2)}
        </QuoteTextLabel>
      </FlexContainer>
    </InstrumentItem>
  );
};

export default ClosedPositionItem;

const InstrumentItem = styled(ButtonWithoutStyles)`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 16px;
  transition: all 0.4s ease;
  text-decoration: none;
  &:hover,
  &:focus {
    background-color: rgba(42, 45, 56, 0.9);
    text-decoration: none;
  }
`;

const QuoteTextLabel = styled(FlexContainer)<{ isGrowth?: boolean }>`
  color: ${(props) => (props.isGrowth ? Colors.ACCENT_BLUE : Colors.RED)};
  border-radius: 4px;
  padding: 2px 4px;
  font-size: 13px;
`;

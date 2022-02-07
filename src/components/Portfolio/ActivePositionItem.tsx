import React, { FC, useCallback } from 'react';
import { PositionModelWSDTO } from '../../types/Positions';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import ImageContainer from '../ImageContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { useStores } from '../../hooks/useStores';
import ActivePositionPnL from './ActivePositionPnL';
import { Link, useParams } from 'react-router-dom';
import Page from '../../constants/Pages';
import ItemOperationLabel from './ItemOperationLabel';

interface Props {
  position: PositionModelWSDTO;
  isInner?: boolean;
}

const ActivePositionItem: FC<Props> = ({ position, isInner }) => {
  const { mainAppStore, instrumentsStore } = useStores();
  const { type } = useParams<{ type: string }>();
  const { id, instrument, operation } = position;
  console.log(position)
  const groupName = (instrument: string) => {
    const groupId =
      instrumentsStore.instruments.find(
        (item) => item.instrumentItem.id === instrument
      )?.instrumentItem.groupId || '';
    return groupId.toLowerCase();
  };

  const positionInstrument = useCallback(
    () =>
      instrumentsStore.instruments.find(
        (item) => item.instrumentItem.id === instrument
      )?.instrumentItem,
    [position]
  );

  return (
    <InstrumentItem to={`${Page.PORTFOLIO_MAIN}/${type}/${id}`}>
      <FlexContainer width="48px" height="48px" marginRight="16px">
        <ImageContainer instrumentId={instrument} />
      </FlexContainer>

      <FlexContainer
        flexDirection="column"
        justifyContent="center"
        flexWrap="nowrap"
      >
        <FlexContainer alignItems="center" marginBottom="6px">
          <PrimaryTextSpan
            color="#ffffff"
            fontSize="16px"
            fontWeight={500}
            lineHeight="1"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            maxWidth="calc(100vw - 36px - 48px - 8px - 8px - 120px)"
          >
            {positionInstrument()?.name}
          </PrimaryTextSpan>
          {!isInner && <ItemOperationLabel operation={operation} />}
        </FlexContainer>

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
          {position.investmentAmount.toFixed(2)}
        </PrimaryTextSpan>
        <ActivePositionPnL position={position} hasBackground={isInner} />
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
  text-decoration: none;
  &:hover,
  &:focus {
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), rgba(42, 45, 56, 0.5);
    text-decoration: none;
  }
`;

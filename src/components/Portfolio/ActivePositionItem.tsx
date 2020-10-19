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
}

const ActivePositionItem: FC<Props> = ({ position }) => {
  const { mainAppStore, instrumentsStore } = useStores();
  const { type } = useParams<{ type: string }>();
  const { id, instrument, operation } = position;

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
  }, [position]);

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
          {position.investmentAmount.toFixed(2)}
        </PrimaryTextSpan>
        <ActivePositionPnL position={position} />
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
    background-color: rgba(42, 45, 56, 0.9);
    text-decoration: none;
  }
`;

import React, { FC, useCallback } from 'react';
import { PositionModelWSDTO } from '../../types/Positions';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import Colors from '../../constants/Colors';
import ImageContainer from '../ImageContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { useStores } from '../../hooks/useStores';
import { getNumberSign } from '../../helpers/getNumberSign';
import ActivePositionPnL from './ActivePositionPnL';
import { observer, Observer } from 'mobx-react-lite';

interface Props {
  position: PositionModelWSDTO;
}

const handleOpenPosition = () => {}

const ActivePositionItem: FC<Props> = ({ position }) => {

  const { mainAppStore, instrumentsStore } = useStores();
  const { id, instrument } = position;

  const groupName = (instrument: string) => {
    const groupId = instrumentsStore.instruments.find(item => item.instrumentItem.id === instrument)?.instrumentItem.groupId;
    return groupId ? groupId.charAt(0).toUpperCase() + groupId.slice(1).toLowerCase() : '';
  };

  return (
    <InstrumentItem onClick={handleOpenPosition}>
      <FlexContainer width="48px" height="48px" marginRight="16px">
        <ImageContainer instrumentId={id.toString()} />
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
        >
          
          {groupName(instrument)}
        </PrimaryTextSpan>
      </FlexContainer>

      <Observer>
        {() => (
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
        )}
      </Observer>
    </InstrumentItem>
  );
};

export default ActivePositionItem;


const InstrumentItem = styled(FlexContainer)`
  width: 100%;
  padding: 16px;
  margin-bottom: 2px;
  background-color: rgba(42, 45, 56, 0.5);
  flex-wrap: wrap;
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
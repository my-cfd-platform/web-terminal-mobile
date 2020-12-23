import React, { FC } from 'react';
import { InstrumentModelWSDTO } from '../../types/InstrumentsTypes';
import { observer, Observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import ImageContainer from '../ImageContainer';
import { useStores } from '../../hooks/useStores';
import { getNumberSign } from '../../helpers/getNumberSign';
import Colors from '../../constants/Colors';
import { useHistory } from 'react-router-dom';
import Page from '../../constants/Pages';

interface Props {
  instrument: InstrumentModelWSDTO;
}

const InstrumentMarkets: FC<Props> = observer((props) => {
  const {
    instrument: { id, name, digits, groupId },
  } = props;

  const { quotesStore, instrumentsStore } = useStores();
  const { push } = useHistory();

  const setInstrumentActive = () => {
    instrumentsStore.switchInstrument(id);
    push(Page.DASHBOARD);
  };

  return (
    <InstrumentItem onClick={setInstrumentActive}>
      <FlexContainer minWidth="48px" height="48px" marginRight="16px">
        <ImageContainer instrumentId={id} />
      </FlexContainer>
      <FlexContainer flexDirection="column" justifyContent="center">
        <PrimaryTextSpan
          color="#ffffff"
          fontSize="16px"
          fontWeight={500}
          lineHeight="1"
          marginBottom="6px"
        >
          {name}
        </PrimaryTextSpan>
        <PrimaryTextSpan
          color="rgba(255, 255, 255, 0.4)"
          fontSize="16px"
          fontWeight={500}
          lineHeight="1"
        >
          {groupId.charAt(0).toUpperCase() + groupId.slice(1).toLowerCase()}
        </PrimaryTextSpan>
      </FlexContainer>

      <FlexContainer
        flexDirection="column"
        flex="1"
        alignItems="flex-end"
        justifyContent="center"
      >
        <PrimaryTextSpan fontSize="16px" color="#fffccc" marginBottom="4px">
          <Observer>
            {() => <>{quotesStore.quotes[id].bid.c.toFixed(digits)}</>}
          </Observer>
        </PrimaryTextSpan>
        {!!instrumentsStore.pricesChange[id] && (
          <QuoteTextLabel isGrowth={instrumentsStore.pricesChange[id] >= 0}>
            {getNumberSign(instrumentsStore.pricesChange[id])}
            {Math.abs(instrumentsStore.pricesChange[id])}%
          </QuoteTextLabel>
        )}
      </FlexContainer>
    </InstrumentItem>
  );
});

export default InstrumentMarkets;

const InstrumentItem = styled(FlexContainer)`
  width: 100%;
  padding: 16px;
  flex-wrap: nowrap;
  transition: all 0.4s ease;
  min-height: 80px;

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

import React, { FC } from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import ImageContainer from '../ImageContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { useStores } from '../../hooks/useStores';
import { Link, useParams } from 'react-router-dom';
import Page from '../../constants/Pages';
import { InstrumentModelWSDTO } from '../../types/InstrumentsTypes';
import { observer, Observer } from 'mobx-react-lite';
import Colors from '../../constants/Colors';
import { useTranslation } from 'react-i18next';

interface Props {
  type: string;
}

const ActiveInstrumentItem: FC<Props> = observer(({ type }) => {
  const { instrumentsStore, quotesStore } = useStores();
  const { t } = useTranslation();

  const id = instrumentsStore.activeInstrument?.instrumentItem.id || '';
  const name = instrumentsStore.activeInstrument?.instrumentItem.name || '';
  const groupName = instrumentsStore.activeInstrument?.instrumentItem.groupId.toLowerCase();
  const digits = instrumentsStore.activeInstrument?.instrumentItem.digits;

  return (
    <InstrumentItem to={`${Page.ORDER_MAIN}/${type}/${id}`}>
      <FlexContainer width="48px" height="48px" marginRight="16px">
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
          textTransform="capitalize"
        >
          {groupName}
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
            {() => <>
              {type === 'sell' ? quotesStore.quotes[id].bid.c.toFixed(digits) : quotesStore.quotes[id].ask.c.toFixed(digits)}
            </>}
          </Observer>
        </PrimaryTextSpan>
        <QuoteTextLabel type={type}>
          <PrimaryTextSpan
            color={type === 'buy' ? '#000000' : '#ffffff'}
            fontSize="13px"
            textTransform="uppercase"
          >
            {t(type)}
          </PrimaryTextSpan>
        </QuoteTextLabel>
      </FlexContainer>
    </InstrumentItem>
  );
});

export default ActiveInstrumentItem;

const InstrumentItem = styled(Link)`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 16px;
  transition: all 0.4s ease;
  margin-bottom: 16px;
  &:hover,
  &:focus {
    background-color: rgba(42, 45, 56, 0.9);
  }
`;
const QuoteTextLabel = styled(FlexContainer)<{ type?: string }>`
  background-color: ${(props) =>
    props.type === 'buy' ? Colors.ACCENT_BLUE : Colors.RED};
  border-radius: 4px;
  padding: 4px 16px;
  font-size: 13px;
`;

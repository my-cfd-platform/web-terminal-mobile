import React, { FC, useCallback } from 'react';
import { PositionModelWSDTO } from '../../types/Positions';
import { PendingOrderWSDTO } from '../../types/PendingOrdersTypes';
import styled from '@emotion/styled';
import { Link, useParams } from 'react-router-dom';
import Page from '../../constants/Pages';
import { FlexContainer } from '../../styles/FlexContainer';
import ImageContainer from '../ImageContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { useStores } from '../../hooks/useStores';
import { useTranslation } from 'react-i18next';
import useInstrument from '../../hooks/useInstrument';
import ItemOperationLabel from './ItemOperationLabel';

interface Props {
  pendingOrder: PendingOrderWSDTO;
  currencySymbol: string;
  isInner?: boolean;
}

const PendingOrderItem: FC<Props> = ({ pendingOrder, isInner }) => {
  const { type } = useParams<{ type: string }>();
  const { t } = useTranslation();
  const { getPressision } = useInstrument();

  const {
    id,
    instrument,
    investmentAmount,
    openPrice,
    operation,
  } = pendingOrder;

  const { mainAppStore, instrumentsStore } = useStores();

  const groupName = (instrument: string) => {
    const groupId =
      instrumentsStore.instruments.find(
        (item) => item.instrumentItem.id === instrument
      )?.instrumentItem.groupId || '';
    return groupId.toLowerCase();
  };

  const positionInstrument = useCallback(() => {
    return instrumentsStore.instruments.find(
      (item) => item.instrumentItem.id === instrument
    )?.instrumentItem;
  }, [pendingOrder]);

  return (
    <InstrumentItem to={`${Page.PORTFOLIO_MAIN}/${type}/${id}`}>
      <FlexContainer width="48px" height="48px" marginRight="16px">
        <ImageContainer instrumentId={instrument} />
      </FlexContainer>

      <FlexContainer flexDirection="column" justifyContent="center">
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
          {investmentAmount.toFixed(2)}
        </PrimaryTextSpan>
        <PrimaryTextSpan color="#ffffff" fontSize="11px">
          {t('at')} {openPrice.toFixed(getPressision(instrument))}
        </PrimaryTextSpan>
      </FlexContainer>
    </InstrumentItem>
  );
};

export default PendingOrderItem;

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

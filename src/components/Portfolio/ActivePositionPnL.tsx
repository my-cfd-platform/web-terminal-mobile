import React, { FC, useEffect, useState, useCallback } from 'react';
import { PositionModelWSDTO } from '../../types/Positions';
import { useStores } from '../../hooks/useStores';
import { AskBidEnum } from '../../enums/AskBid';
import calculateFloatingProfitAndLoss from '../../helpers/calculateFloatingProfitAndLoss';
import { autorun } from 'mobx';
import { FlexContainer } from '../../styles/FlexContainer';
import Colors from '../../constants/Colors';
import styled from '@emotion/styled';
import { getNumberSign } from '../../helpers/getNumberSign';
import { css } from '@emotion/core';

interface Props {
  position: PositionModelWSDTO;
  hasBackground?: boolean;
}

const ActivePositionPnL: FC<Props> = ({ position, hasBackground }) => {
  const { quotesStore, mainAppStore } = useStores();
  const isBuy = position.operation === AskBidEnum.Buy;

  const [statePnL, setStatePnL] = useState<number | null>(null);

  const workCallback = useCallback(
    (quote) => {
      setStatePnL(
        calculateFloatingProfitAndLoss({
          investment: position.investmentAmount,
          multiplier: position.multiplier,
          costs: position.swap + position.commission,
          side: isBuy ? 1 : -1,
          currentPrice: isBuy ? quote.bid.c : quote.ask.c,
          openPrice: position.openPrice,
        })
      );
    },
    [position]
  );

  useEffect(() => {
    const disposer = autorun(
      () => {
        if (quotesStore.quotes[position.instrument]) {
          workCallback(quotesStore.quotes[position.instrument]);
        }
      },
      { delay: 2000 }
    );
    return () => {
      disposer();
    };
  }, []);

  return statePnL !== null ? (
    <QuoteTextLabel isGrowth={statePnL >= 0} hasBackground={hasBackground}>
      {getNumberSign(statePnL)}
      {mainAppStore.activeAccount?.symbol}
      {Math.abs(statePnL).toFixed(2)}
    </QuoteTextLabel>
  ) : null;
};
export default ActivePositionPnL;

const QuoteTextLabel = styled(FlexContainer)<{
  isGrowth?: boolean;
  hasBackground?: boolean;
}>`
  color: ${(props) => (props.isGrowth ? Colors.ACCENT_BLUE : Colors.RED)};

  ${(props) =>
    props.hasBackground &&
    css`
      background-color: ${props.isGrowth ? Colors.ACCENT_BLUE : Colors.RED};
      color: ${props.isGrowth ? '#000000' : '#ffffff'};
    `};

  border-radius: 4px;
  padding: 2px 4px;
  font-size: 13px;
`;

import React, { useEffect, FC, useState, useCallback } from 'react';
import calculateFloatingProfitAndLoss from '../../helpers/calculateFloatingProfitAndLoss';
import { useStores } from '../../hooks/useStores';
import { AskBidEnum } from '../../enums/AskBid';
import { PositionModelWSDTO } from '../../types/Positions';
import { autorun } from 'mobx';

const noop = (value: null | number) => {}

interface Props {
  position: PositionModelWSDTO;
  handlePnL?: (value: null | number) => void;
}

const EquityPnL: FC<Props> = ({ position, handlePnL = noop}) => {
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

  useEffect(() => {
    handlePnL(statePnL);
    console.log(statePnL)
  }, [statePnL])

  return statePnL !== null ? (
    <>
      {mainAppStore.activeAccount?.symbol}
      {Math.abs(statePnL + position.investmentAmount).toFixed(2)}
    </>
  ) : null;
};

export default EquityPnL;

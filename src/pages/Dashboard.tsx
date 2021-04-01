import React, { FC, useEffect, useState } from 'react';
import { useStores } from '../hooks/useStores';
import FavouriteInstruments from '../components/Dashboard/FavouriteInstruments';
import { FlexContainer } from '../styles/FlexContainer';
import ActiveInstrument from '../components/Dashboard/ActiveInstrument';
import BuyButton from '../components/Dashboard/BuyButton';
import SellButton from '../components/Dashboard/SellButton';
import TimeScaleWrapper from '../components/Dashboard/TimeScaleWrapper';
import { useHistory } from 'react-router-dom';
import Page from '../constants/Pages';
import { PositionModelWSDTO } from '../types/Positions';
import ActiveChartOrders from '../components/Dashboard/ActiveChartOrders';
import { observer } from 'mobx-react-lite';

const Dashboard: FC = observer(() => {
  const { instrumentsStore, quotesStore } = useStores();
  const { push } = useHistory();

  const [activePositions, setActivePositions] = useState<PositionModelWSDTO[]>(
    quotesStore.sortedActivePositions.filter(
      (position) => instrumentsStore.activeInstrument?.instrumentItem.id ===
        position.instrument)
  );

  useEffect(() => {
    const newPositions = quotesStore.sortedActivePositions.filter(
      (position) => instrumentsStore.activeInstrument?.instrumentItem.id ===
        position.instrument);
    setActivePositions(newPositions);
  }, [
    instrumentsStore.activeInstrument,
    quotesStore.sortedActivePositions
  ]);

  const handleClickBuy = () => {
    push(
      `${Page.ORDER_MAIN}/buy/${instrumentsStore.activeInstrument?.instrumentItem.id}`
    );
  };

  const handleClickSell = () => {
    push(
      `${Page.ORDER_MAIN}/sell/${instrumentsStore.activeInstrument?.instrumentItem.id}`
    );
  };

  return (
    <>
      <FlexContainer flexDirection="column" width="100%" order="1">
        <FavouriteInstruments />
        {activePositions.length > 0
          ? <ActiveChartOrders activePositions={activePositions} />
          : <ActiveInstrument />}
      </FlexContainer>
      <FlexContainer flexDirection="column" width="100%" order="3">
        <TimeScaleWrapper></TimeScaleWrapper>
        <FlexContainer padding="0 16px">
          <SellButton handleClick={handleClickSell} />
          <BuyButton handleClick={handleClickBuy} />
        </FlexContainer>
      </FlexContainer>
    </>
  );
});

export default Dashboard;

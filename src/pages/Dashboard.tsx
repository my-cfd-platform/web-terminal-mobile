import React, { useEffect } from 'react';
import { useStores } from '../hooks/useStores';
import Topics from '../constants/websocketTopics';
import { ResponseFromWebsocket } from '../types/ResponseFromWebsocket';
import { PositionModelWSDTO } from '../types/Positions';
import { PendingOrderWSDTO } from '../types/PendingOrdersTypes';
import {
  InstrumentModelWSDTO,
  PriceChangeWSDTO,
} from '../types/InstrumentsTypes';
import FavouriteInstruments from '../components/Dashboard/FavouriteInstruments';
import { FlexContainer } from '../styles/FlexContainer';
import ActiveInstrument from '../components/Dashboard/ActiveInstrument';
import BuyButton from '../components/Dashboard/BuyButton';
import SellButton from '../components/Dashboard/SellButton';
import TimeScaleWrapper from '../components/Dashboard/TimeScaleWrapper';
import { useHistory } from 'react-router-dom';
import Page from '../constants/Pages';

const Dashboard = () => {
  const { mainAppStore, quotesStore, instrumentsStore } = useStores();
  const { push } = useHistory();

  const handleClickBuy = () =>
    push(
      `${Page.ORDER_MAIN}/buy/${instrumentsStore.activeInstrument?.instrumentItem.id}`
    );
  const handleClickSell = () =>
    push(
      `${Page.ORDER_MAIN}/sell/${instrumentsStore.activeInstrument?.instrumentItem.id}`
    );

  return (
    <>
      <FlexContainer flexDirection="column" width="100%" order="1">
        <FavouriteInstruments />
        <ActiveInstrument />
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
};

export default Dashboard;

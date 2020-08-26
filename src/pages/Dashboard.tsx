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

const Dashboard = () => {
  const { mainAppStore, quotesStore, instrumentsStore } = useStores();

  useEffect(() => {
    if (mainAppStore.activeAccount) {
      mainAppStore.activeSession?.on(
        Topics.ACTIVE_POSITIONS,
        (response: ResponseFromWebsocket<PositionModelWSDTO[]>) => {
          if (response.accountId === mainAppStore.activeAccount?.id) {
            quotesStore.activePositions = response.data;
          }
        }
      );

      mainAppStore.activeSession?.on(
        Topics.PENDING_ORDERS,
        (response: ResponseFromWebsocket<PendingOrderWSDTO[]>) => {
          if (mainAppStore.activeAccount?.id === response.accountId) {
            quotesStore.pendingOrders = response.data;
          }
        }
      );

      mainAppStore.activeSession?.on(
        Topics.INSTRUMENT_GROUPS,
        (response: ResponseFromWebsocket<InstrumentModelWSDTO[]>) => {
          if (mainAppStore.activeAccount?.id === response.accountId) {
            instrumentsStore.instrumentGroups = response.data;
            if (response.data.length) {
              instrumentsStore.activeInstrumentGroupId = response.data[0].id;
            }
          }
        }
      );

      mainAppStore.activeSession?.on(
        Topics.PRICE_CHANGE,
        (response: ResponseFromWebsocket<PriceChangeWSDTO[]>) => {
          instrumentsStore.setPricesChanges(response.data);
        }
      );

      mainAppStore.activeSession?.on(
        Topics.UPDATE_ACTIVE_POSITION,
        (response: ResponseFromWebsocket<PositionModelWSDTO>) => {
          if (response.accountId === mainAppStore.activeAccount?.id) {
            quotesStore.activePositions = quotesStore.activePositions.map(
              (item) => (item.id === response.data.id ? response.data : item)
            );
          }
        }
      );

      mainAppStore.activeSession?.on(
        Topics.UPDATE_PENDING_ORDER,
        (response: ResponseFromWebsocket<PendingOrderWSDTO>) => {
          if (response.accountId === mainAppStore.activeAccount?.id) {
            quotesStore.pendingOrders = quotesStore.pendingOrders.map((item) =>
              item.id === response.data.id ? response.data : item
            );
          }
        }
      );
    }
  }, [mainAppStore.activeAccount]);

  return (
    <>
      <FlexContainer flexDirection="column" width="100%" order="1">
        <FavouriteInstruments />
        <ActiveInstrument />
      </FlexContainer>
      <FlexContainer flexDirection="column" width="100%" order="3">
        <TimeScaleWrapper></TimeScaleWrapper>
        <FlexContainer padding="0 16px">
          <SellButton handleClick={() => {}} />
          <BuyButton handleClick={() => {}} />
        </FlexContainer>
      </FlexContainer>
    </>
  );
};

export default Dashboard;

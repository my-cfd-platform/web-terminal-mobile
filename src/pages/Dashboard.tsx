import React, { useEffect, useCallback } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useStores } from '../hooks/useStores';
import Topics from '../constants/websocketTopics';
import { ResponseFromWebsocket } from '../types/ResponseFromWebsocket';
import { PositionModelWSDTO } from '../types/Positions';
import { PendingOrderWSDTO } from '../types/PendingOrdersTypes';
import {
  InstrumentModelWSDTO,
  PriceChangeWSDTO,
} from '../types/InstrumentsTypes';
import { Observer } from 'mobx-react-lite';
import ChartContainer from '../containers/ChartContainer';
import FavouriteInstruments from '../components/Dashboard/FavouriteInstruments';

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
    <DashboardLayout>
      <FavouriteInstruments />
      <Observer>
        {() => (
          <>
            {instrumentsStore.activeInstrument && (
              <ChartContainer
                instrumentId={
                  instrumentsStore.activeInstrument.instrumentItem.id
                }
                instruments={instrumentsStore.instruments}
              ></ChartContainer>
            )}
          </>
        )}
      </Observer>
    </DashboardLayout>
  );
};

export default Dashboard;

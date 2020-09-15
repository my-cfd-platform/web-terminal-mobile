import React, { useEffect } from 'react';
import { useStores } from '../hooks/useStores';
import FavouriteInstruments from '../components/Dashboard/FavouriteInstruments';
import { FlexContainer } from '../styles/FlexContainer';
import ActiveInstrument from '../components/Dashboard/ActiveInstrument';
import BuyButton from '../components/Dashboard/BuyButton';
import SellButton from '../components/Dashboard/SellButton';
import TimeScaleWrapper from '../components/Dashboard/TimeScaleWrapper';
import { useHistory } from 'react-router-dom';
import Page from '../constants/Pages';
import LoaderFullscreen from '../components/LoaderFullscreen';
import { Observer } from 'mobx-react-lite';

const Dashboard = () => {
  const { mainAppStore, instrumentsStore } = useStores();
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
      <Observer>
        {() => (
          <>
            {mainAppStore.isLoading && (
              <LoaderFullscreen
                isLoading={mainAppStore.isLoading}
              ></LoaderFullscreen>
            )}
          </>
        )}
      </Observer>
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

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
import API from '../helpers/API';
import { getProcessId } from '../helpers/getProcessId';
import mixpanel from 'mixpanel-browser';
import mixapanelProps from '../constants/mixpanelProps';
import KYCStatus from '../constants/KYCStatus';

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

  useEffect(() => {
    async function fetchPersonalData() {
      try {
        const response = await API.getPersonalData(getProcessId());
        mixpanel.alias(response.data.id);
        mixpanel.people.set({
          [mixapanelProps.PHONE]: response.data.phone || '',
          [mixapanelProps.EMAIL]: response.data.email || '',
          [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandName.toLowerCase(),
          [mixapanelProps.TRADER_ID]: response.data.id || '',
          [mixapanelProps.FIRST_NAME]: response.data.firstName || '',
          [mixapanelProps.KYC_STATUS]: KYCStatus[response.data.kyc],
          [mixapanelProps.LAST_NAME]: response.data.lastName || '',
        });
        mixpanel.people.union({
          [mixapanelProps.PLATFORMS_USED]: 'mobile',
          [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandName.toLowerCase(),
        })
        mainAppStore.setSignUpFlag(false);
      } catch (error) {}
    }
    if (mainAppStore.signUpFlag) {
      fetchPersonalData();
    }
  }, []);

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

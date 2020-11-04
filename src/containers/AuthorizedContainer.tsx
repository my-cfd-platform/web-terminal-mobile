import React, { FC, useEffect } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { Observer } from 'mobx-react-lite';
import NotificationPopup from '../components/NotificationPopup';
import NotificationActivePositionPopup from '../components/NotificationActivePositionPopup';
import NotificationPendingPositionPopup from '../components/NotificationPendingPositionPopup';
import NavBar from '../components/NavBar/NavBar';
import ChartContainer from './ChartContainer';
import NavigationPanel from '../components/NavigationPanel';
import { useRouteMatch, useHistory } from 'react-router-dom';
import Page from '../constants/Pages';
import styled from '@emotion/styled';
import { FULL_VH, LAST_PAGE_VISITED } from '../constants/global';
import API from '../helpers/API';
import { getProcessId } from '../helpers/getProcessId';
import mixpanel from 'mixpanel-browser';
import mixapanelProps from '../constants/mixpanelProps';
import KYCStatus from '../constants/KYCStatus';
import { useStores } from '../hooks/useStores';
import DepositPaymentResultPopup from '../components/DepositPaymentResultPopup/DepositPaymentResultPopup';
import LoaderFullscreen from '../components/LoaderFullscreen';
import DemoRealPopup from '../components/DemoRealPopup';
import NetworkErrorPopup from '../components/NetworkErrorPopup';
import ServerErrorPopup from '../components/ServerErrorPopup';

const AuthorizedContainer: FC = ({ children }) => {
  const match = useRouteMatch([
    Page.POSITION_DETAILS,
    Page.CHART_SETTING,
    Page.ORDER,
    Page.ACCOUNT_ABOUT_US,
    Page.ACCOUNTS_SWITCH,
    Page.ACCOUNT_CHANGE_LANGUAGE,
    Page.ACCOUNT_VERIFICATION,
  ]);

  const { push } = useHistory();
  const { mainAppStore, userProfileStore, serverErrorPopupStore } = useStores();
  const showNavbarAndNav = !match?.isExact;

  useEffect(() => {
    async function fetchPersonalData() {
      try {
        const response = await API.getPersonalData(
          getProcessId(),
          mainAppStore.initModel.authUrl
        );
        mainAppStore.signUpFlag
          ? mixpanel.alias(response.data.id)
          : mixpanel.identify(response.data.id);
        userProfileStore.setUser(response.data);
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
        });
        mainAppStore.setSignUpFlag(false);
        if (!response.data.phone) {
          const additionalResponse = await API.getAdditionalRegistrationFields(
            mainAppStore.initModel.authUrl
          );
          if (additionalResponse.includes('phone')) {
            push(Page.PHONE_VERIFICATION);
          }
        }
      } catch (error) {}
    }
    fetchPersonalData();
  }, []);

  useEffect(() => {
    localStorage.setItem(LAST_PAGE_VISITED, location.pathname);
  }, [location.pathname]);

  return (
    <FlexContainer
      position="relative"
      height="100%"
      width="100vw"
      flexDirection="column"
      overflow="hidden"
    >
      <Observer>
        {() => (
          <>
            <NotificationPopup></NotificationPopup>
            <NotificationActivePositionPopup></NotificationActivePositionPopup>
            <NotificationPendingPositionPopup></NotificationPendingPositionPopup>
            {mainAppStore.activeAccount && (
              <>
                <DepositPaymentResultPopup />
              </>
            )}
          </>
        )}
      </Observer>
      <Observer>
        {() => (
          <LoaderFullscreen
            isLoading={mainAppStore.isLoading}
          ></LoaderFullscreen>
        )}
      </Observer>
      <Observer>
        {() => <>{serverErrorPopupStore.isActive && <ServerErrorPopup />}</>}
      </Observer>
      <Observer>{() => <NetworkErrorPopup></NetworkErrorPopup>}</Observer>
      <Observer>
        {() => (
          <>{mainAppStore.isDemoRealPopup && <DemoRealPopup></DemoRealPopup>}</>
        )}
      </Observer>
      {showNavbarAndNav && <NavBar />}
      <FlexContainer
        height={
          showNavbarAndNav ? `calc(${FULL_VH} - 128px)` : `calc(${FULL_VH})`
        }
        flexDirection="column"
      >
        {children}
        <Observer>{() => <ChartContainer />}</Observer>
      </FlexContainer>
      {showNavbarAndNav && <NavigationPanel />}
    </FlexContainer>
  );
};

export default AuthorizedContainer;

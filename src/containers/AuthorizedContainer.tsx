import React, { FC, useEffect, useState } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { observer, Observer } from 'mobx-react-lite';
import NotificationPopup from '../components/NotificationPopup';
import NotificationActivePositionPopup from '../components/NotificationActivePositionPopup';
import NotificationPendingPositionPopup from '../components/NotificationPendingPositionPopup';
import NavBar from '../components/NavBar/NavBar';
import ChartContainer from './ChartContainer';
import NavigationPanel from '../components/NavigationPanel';
import { useRouteMatch, useHistory } from 'react-router-dom';
import Page from '../constants/Pages';
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
import mixpanelEvents from '../constants/mixpanelEvents';

const AuthorizedContainer: FC = observer(({ children }) => {
  const match = useRouteMatch([
    Page.POSITION_DETAILS,
    Page.CHART_SETTING,
    Page.ORDER,
    Page.ACCOUNT_ABOUT_US,
    Page.ACCOUNTS_SWITCH,
    Page.ACCOUNT_CHANGE_LANGUAGE,
    Page.ACCOUNT_VERIFICATION,
    Page.ACCOUNT_CHANGE_PASSWORD,
    Page.WITHDRAW_LIST,
    Page.WITHDRAW_HISTORY_ID,
    Page.WITHDRAW_HISTORY,
    Page.WITHDRAW_VISAMASTER,
    Page.WITHDRAW_BITCOIN,
    Page.WITHDRAW_HISTORY_ID,
    Page.WITHDRAW_SUCCESS,
    Page.SL_EDIT,
    Page.TP_EDIT,
    Page.ACCOUNT_BALANCE_HISTORY,
    Page.PHONE_VERIFICATION,
    Page.ONBOARDING
  ]);

  const { push } = useHistory();
  const { mainAppStore, userProfileStore, serverErrorPopupStore } = useStores();
  const [waitingData, setWaitingData] = useState<boolean>(true);
  const showNavbarAndNav = !match?.isExact;


  const hidenPromoPageList = useRouteMatch([
    Page.ONBOARDING,
    Page.ACCOUNT_BALANCE_HISTORY,
    Page.WITHDRAW_LIST,
    Page.WITHDRAW_HISTORY_ID,
    Page.WITHDRAW_HISTORY,
    Page.WITHDRAW_VISAMASTER,
    Page.WITHDRAW_BITCOIN,
    Page.WITHDRAW_HISTORY_ID,
    Page.WITHDRAW_SUCCESS,
    Page.ACCOUNT_VERIFICATION,
    Page.ACCOUNT_ABOUT_US,
    Page.ACCOUNTS_SWITCH,
  ]);

  const isHiddenPromoPage = hidenPromoPageList?.isExact;
  

  useEffect(() =>{
    if (mainAppStore.isPromoAccount && isHiddenPromoPage) {
      push(Page.DASHBOARD);
    }
  }, [mainAppStore.isPromoAccount])

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

        if (mainAppStore.lpLoginFlag) {
          mixpanel.track(mixpanelEvents.SIGN_UP, {
            [mixapanelProps.BRAND_NAME]:
              mainAppStore.initModel.brandName.toLowerCase(),
          });
        }

        mainAppStore.setSignUpFlag(false);
        mainAppStore.setLpLoginFlag(false);
        if (!response.data.phone) {
          const additionalResponse = await API.getAdditionalRegistrationFields(
            mainAppStore.initModel.authUrl
          );
          if (additionalResponse.includes('phone')) {
            mainAppStore.isVerification = true;
            push(Page.PHONE_VERIFICATION);
          }
        }
        setWaitingData(false);
      } catch (error) {
        setWaitingData(false);
      }
    }
    fetchPersonalData();
  }, []);

  useEffect(() => {
    // TODO Think about realization
    if (mainAppStore.paramsPortfolioTab) {
      push(`${Page.PORTFOLIO_MAIN}/${mainAppStore.paramsPortfolioTab}`);
      mainAppStore.setParamsPortfolioTab(null);
    }
    if (mainAppStore.paramsKYC) {
      push(Page.ACCOUNT_VERIFICATION);
      mainAppStore.setParamsKYC(false);
    }
    if (mainAppStore.paramsWithdraw) {
      push(Page.WITHDRAW_LIST);
      mainAppStore.setParamsWithdraw(false);
    }
    if (mainAppStore.paramsBalanceHistory) {
      push(Page.ACCOUNT_BALANCE_HISTORY);
      mainAppStore.setParamsBalanceHistory(false);
    }
    if (mainAppStore.paramsSecurity) {
      push(Page.ACCOUNT_CHANGE_PASSWORD);
      mainAppStore.setParamsSecurity(false);
    }
    if (mainAppStore.paramsMarkets) {
      push(`${Page.MARKETS}?markets=${mainAppStore.paramsMarkets}`);
    }
  }, [
    mainAppStore.activeAccount,
    mainAppStore.paramsMarkets,
    mainAppStore.paramsPortfolioTab,
    mainAppStore.paramsDeposit
  ]);

  useEffect(() => {
    if (mainAppStore.isDemoRealPopup && !mainAppStore.isVerification) {
      push(Page.ONBOARDING);
    }
  }, [
    mainAppStore.isDemoRealPopup,
    mainAppStore.isVerification
  ]);

  useEffect(() => {
    localStorage.setItem(LAST_PAGE_VISITED, location.pathname);
  }, [location.pathname]);

  return (
    <FlexContainer
      position="relative"
      height={`calc(${FULL_VH})`}
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
            isLoading={mainAppStore.isLoading || waitingData}
          ></LoaderFullscreen>
        )}
      </Observer>
      <Observer>
        {() => <>{serverErrorPopupStore.isActive && <ServerErrorPopup />}</>}
      </Observer>
      <Observer>{() => <NetworkErrorPopup></NetworkErrorPopup>}</Observer>
      {/*<Observer>*/}
      {/*  {() => (*/}
      {/*    <>{(mainAppStore.isDemoRealPopup && !mainAppStore.isVerification) && <DemoRealPopup></DemoRealPopup>}</>*/}
      {/*  )}*/}
      {/*</Observer>*/}
      {showNavbarAndNav && <NavBar />}
      <FlexContainer
        height={
          showNavbarAndNav ? `calc(${FULL_VH} - 128px)` : `calc(${FULL_VH})`
        }
        flexDirection="column"
        overflow="auto"
      >
        {children}
        <Observer>{() => <ChartContainer />}</Observer>
      </FlexContainer>
      {showNavbarAndNav && <NavigationPanel />}
    </FlexContainer>
  );
});

export default AuthorizedContainer;

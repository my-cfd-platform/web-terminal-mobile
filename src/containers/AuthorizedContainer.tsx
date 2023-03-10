import React, { FC, useCallback, useEffect, useState } from 'react';
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
import { FULL_VH, LAST_PAGE_VISITED, LOCAL_STORAGE_MT } from '../constants/global';
import API from '../helpers/API';
import { getProcessId } from '../helpers/getProcessId';
import mixpanel from 'mixpanel-browser';
import mixapanelProps from '../constants/mixpanelProps';
import KYCStatus from '../constants/KYCStatus';
import { useStores } from '../hooks/useStores';
import DepositPaymentResultPopup from '../components/DepositPaymentResultPopup/DepositPaymentResultPopup';
import LoaderFullscreen from '../components/LoaderFullscreen';
import NetworkErrorPopup from '../components/NetworkErrorPopup';
import ServerErrorPopup from '../components/ServerErrorPopup';
import mixpanelEvents from '../constants/mixpanelEvents';
import { AccountTypeEnum } from '../enums/AccountTypeEnum';
import { useTranslation } from 'react-i18next';
import TimeoutNotificationPopup from '../components/TimeoutNotificationPopup';
import ReloadPopup from '../components/ReloadPopup';

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
    Page.ONBOARDING,
    Page.BONUS_FAQ,
    Page.DEMO_REAL_PAGE,
    Page.EDUCATION_LIST,
    Page.PAGE_NOT_FOUND,
    Page.ABOUT_STATUS,
    Page.VERIFICATION_SUCCESS_SEND,
    Page.MT5_CHANGE_ACCOUNT,
    Page.MT5_INFO_ACCOUNT,
    Page.DEPOSIT,
    Page.SL_CREATE_MAIN,
    Page.TP_CREATE_MAIN,
  ]);

  const { push } = useHistory();
  const { t } = useTranslation();
  const {
    mainAppStore,
    userProfileStore,
    serverErrorPopupStore,
    instrumentsStore,
    badRequestPopupStore,
  } = useStores();
  const [waitingData, setWaitingData] = useState<boolean>(true);
  const [isBonusGotten, setIsBonusGotten] = useState<boolean>(false);
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
    Page.BONUS_FAQ,
    Page.DEMO_REAL_PAGE,
    Page.EDUCATION,
    Page.EDUCATION_LIST,
    Page.ABOUT_STATUS,
    Page.VERIFICATION_SUCCESS_SEND,
    Page.MT5_CHANGE_ACCOUNT,
    Page.MT5_INFO_ACCOUNT,
    Page.DEPOSIT,
  ]);

  const isHiddenPromoPage = hidenPromoPageList?.isExact;

  const fetchFavoriteInstruments = useCallback(async () => {
    if (
      mainAppStore.activeAccount &&
      instrumentsStore.instruments.length &&
      !mainAppStore.isVerification
    ) {
      let alreadyAdded = false;
      setTimeout(() => {
        if (!alreadyAdded) {
          mainAppStore.setDataLoading(false);
          instrumentsStore.setActiveInstrumentsIds(
            instrumentsStore.instruments
              .slice(0, 5)
              .map((instr) => instr.instrumentItem.id)
          );
          instrumentsStore.switchInstrument(
            instrumentsStore.instruments[0].instrumentItem.id,
            false
          );
        }
      }, 10000);
      mainAppStore.setDataLoading(true);

      const accountType = mainAppStore.activeAccount?.isLive
        ? AccountTypeEnum.Live
        : AccountTypeEnum.Demo;

      try {
        const response = await API.getFavoriteInstrumets({
          type: accountType,
          accountId: mainAppStore.activeAccountId,
        });
        alreadyAdded = true;
        let responseToCheck: string[] = [];
        if (response.length !== 0) {
          response.reverse().map((instrumentId) => {
            if (
              instrumentsStore.instruments.find(
                (item) => item.instrumentItem.id === instrumentId
              )
            ) {
              responseToCheck.push(instrumentId);
            }
            return instrumentId;
          });
        }

        if (responseToCheck.length === 0) {
          const maxInstrCount =
            instrumentsStore.instruments.length > 5
              ? 5
              : instrumentsStore.instruments.length;
          const newInstruments = [];
          if (maxInstrCount > 0) {
            for (let i = 0; i < maxInstrCount; i++) {
              if (instrumentsStore.instruments[i]) {
                newInstruments.push(
                  instrumentsStore.instruments[i].instrumentItem.id
                );
              }
            }
          }

          responseToCheck = newInstruments;
        }
        instrumentsStore.setActiveInstrumentsIds(responseToCheck);

        // https://monfex.atlassian.net/browse/WEBT-475
        // if app is reinitializing, we should wait widget first

        if (!response.length) {
          throw new Error(t('Something went wrong.'));
        }
        await instrumentsStore.switchInstrument(response[response.length - 1]);
        mainAppStore.setDataLoading(false);
      } catch (error) {
        mainAppStore.setDataLoading(false);
        instrumentsStore.setActiveInstrumentsIds(
          instrumentsStore.instruments
            .slice(0, 5)
            .map((instr) => instr.instrumentItem.id)
        );
        instrumentsStore.switchInstrument(
          instrumentsStore.instruments[0].instrumentItem.id,
          false
        );
      }
    }
  }, [
    instrumentsStore.activeInstrument,
    instrumentsStore.activeInstrumentsIds,
    instrumentsStore.instruments,
    mainAppStore.activeAccount,
    mainAppStore.activeAccountId,
    mainAppStore.isLoading,
    mainAppStore.isVerification,
  ]);

  useEffect(() => {
    fetchFavoriteInstruments();
  }, [instrumentsStore.instruments, mainAppStore.activeAccountId]);

  useEffect(() => {
    if (mainAppStore.isPromoAccount && isHiddenPromoPage) {
      push(Page.DASHBOARD);
    }
  }, [mainAppStore.isPromoAccount]);

  let timer: any;

  useEffect(() => {
    let cleanupFunction = false;
    async function fetchPersonalData() {
      try {
        const response = await API.getPersonalData(
          getProcessId(),
          mainAppStore.initModel.authUrl
        );

        if (!cleanupFunction) {
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
              [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandName.toLowerCase(),
            });
          }
          mainAppStore.setSignUpFlag(false);
          mainAppStore.setLpLoginFlag(false);
          if (!response.data.phone) {
            mainAppStore.setAdditionalRequest(true);
            const additionalResponse = await API.getAdditionalRegistrationFields(
              mainAppStore.initModel.authUrl
            );
            mainAppStore.setAdditionalRequest(false);
            if (additionalResponse.includes('phone')) {
              mainAppStore.isVerification = true;
              push(Page.PHONE_VERIFICATION);
            }
          }
          timer = setTimeout(() => {
            setWaitingData(false);
          }, 4000);
        }
      } catch (error) {
        if (!cleanupFunction) {
          timer = setTimeout(() => {
            setWaitingData(false);
          }, 4000);
        }
      }
    }

    if (mainAppStore.token && !mainAppStore.isAdditionalRequestSent) {
      fetchPersonalData();
    }

    return () => {
      cleanupFunction = true;
      clearTimeout(timer);
    };
  }, [mainAppStore.token]);

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
    mainAppStore.paramsDeposit,
  ]);

  useEffect(() => {
    if (
      mainAppStore.isOnboarding &&
      !mainAppStore.isDemoRealPopup &&
      !mainAppStore.isVerification &&
      !mainAppStore.isPromoAccount &&
      !waitingData
    ) {
      push(Page.ONBOARDING);
    }
  }, [
    mainAppStore.isDemoRealPopup,
    mainAppStore.isOnboarding,
    mainAppStore.isVerification,
    mainAppStore.isPromoAccount,
    waitingData,
  ]);

  useEffect(() => {
    localStorage.setItem(LAST_PAGE_VISITED, location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (
      mainAppStore.token &&
      !mainAppStore.isPromoAccount &&
      !mainAppStore.promo &&
      !mainAppStore.activeACCLoading &&
      !isBonusGotten
    ) {
      setIsBonusGotten(true);
      userProfileStore.getUserBonus(mainAppStore.initModel.miscUrl);
    }
  }, [
    mainAppStore.token,
    mainAppStore.isPromoAccount,
    mainAppStore.promo,
    mainAppStore.activeACCLoading,
  ]);

  useEffect(() =>{
    const isMTAvailable = localStorage.getItem(LOCAL_STORAGE_MT);
    if (isMTAvailable) {
      userProfileStore.setMTAvailable(!!isMTAvailable);
    }
  }, []);

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
            {badRequestPopupStore.isActiveTimeout && (
              <TimeoutNotificationPopup
                show={badRequestPopupStore.isActiveTimeout}
                isSuccessfull={false}
                text={badRequestPopupStore.requestMessage}
                toggleNotify={badRequestPopupStore.closeModal}
              />
            )}
            <ReloadPopup
              show={badRequestPopupStore.isActiveReload}
              isSuccessfull={false}
              text={badRequestPopupStore.requestMessage}
              toggleNotify={badRequestPopupStore.closeModal}
            />
            {mainAppStore.activeAccount && !mainAppStore.isPromoAccount && (
              <>
                <DepositPaymentResultPopup />
              </>
            )}
          </>
        )}
      </Observer>
      <LoaderFullscreen
        isLoading={
          mainAppStore.isLoading ||
          waitingData ||
          mainAppStore.dataLoading ||
          mainAppStore.activeACCLoading
        }
      ></LoaderFullscreen>
      <Observer>
        {() => <>{serverErrorPopupStore.isActive && <ServerErrorPopup />}</>}
      </Observer>
      <Observer>{() => <NetworkErrorPopup></NetworkErrorPopup>}</Observer>

      <NavBar showBar={showNavbarAndNav} />
      <FlexContainer
        height={
          showNavbarAndNav ? `calc(${FULL_VH} - 128px)` : `calc(${FULL_VH})`
        }
        flexDirection="column"
        overflow="auto"
      >
        {children}
        <ChartContainer />
      </FlexContainer>
      {showNavbarAndNav && <NavigationPanel />}
    </FlexContainer>
  );
});

export default AuthorizedContainer;

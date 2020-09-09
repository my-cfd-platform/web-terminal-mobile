import React, { useEffect, FC, useCallback } from 'react';
import { Global, css } from '@emotion/core';
import { reboot } from './styles/reboot';
import Helmet from 'react-helmet';
import RoutingLayout from './routing/RoutingLayout';
import { BrowserRouter as Router } from 'react-router-dom';
import 'react-dates/lib/css/_datepicker.css';
import { useStores } from './hooks/useStores';
import { Observer } from 'mobx-react-lite';
import injectInerceptors from './http/interceptors';
import { useTranslation } from 'react-i18next';
import { autorun } from 'mobx';
import Colors from './constants/Colors';
import { SFfonts } from './styles/SFfonts';
import { AccountTypeEnum } from './enums/AccountTypeEnum';
import API from './helpers/API';

const MainApp: FC = () => {
  const { mainAppStore, instrumentsStore, badRequestPopupStore } = useStores();
  const { t, i18n } = useTranslation();
  
  const fetchFavoriteInstruments = useCallback(async () => {
    const accountType = mainAppStore.activeAccount?.isLive
      ? AccountTypeEnum.Live
      : AccountTypeEnum.Demo;
    mainAppStore.isLoading = true;
    try {
      const response = await API.getFavoriteInstrumets({
        type: accountType,
        accountId: mainAppStore.activeAccountId,
      });
      instrumentsStore.setActiveInstrumentsIds(response);
      // https://monfex.atlassian.net/browse/WEBT-475
      // if app is reinitializing, we should wait widget first
      if (instrumentsStore.activeInstrument) {
        mainAppStore.isLoading = false;
      }
      instrumentsStore.switchInstrument(response[response.length - 1]);
    } catch (error) {
      mainAppStore.isLoading = false;
      badRequestPopupStore.openModal();
      badRequestPopupStore.setMessage(error);
    }
  }, [
    instrumentsStore.activeInstrument,
    instrumentsStore.activeInstrumentsIds,
    mainAppStore.activeAccount,
    mainAppStore.activeAccountId,
    mainAppStore.isLoading,
  ]);

  useEffect(() => {
    if (IS_LIVE) {
      mainAppStore.fetchTradingUrl();
    } else {
      mainAppStore.setTradingUrl('/');
      injectInerceptors('/', mainAppStore);
      mainAppStore.handleInitConnection();
    }
  }, [mainAppStore.isAuthorized]);

  useEffect(() => {
    autorun(() => {
      if (mainAppStore.lang) {
        i18n.changeLanguage(mainAppStore.lang);
      }
    });
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
    // resumeEvent();
    // window.addEventListener('resume', () => {
    //   alert('Resumed');
    // });
  }, []);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden) {
        mainAppStore.startSignalRTimer();
      } else {
        mainAppStore.stopSignalRTimer();
      }
    }

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
      false
    );
  }, []);

  useEffect(() => {
    autorun(() => {
      if (mainAppStore.activeAccountId) {
        fetchFavoriteInstruments();
      }
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>{`${mainAppStore.initModel.brandName} ${t(
          'trading platform'
        )}`}</title>
        <link rel="shortcut icon" href={mainAppStore.initModel.favicon} />
      </Helmet>
      <Observer>
        {() => (
          <>
            {!!mainAppStore.tradingUrl && (
              <Router>
                <RoutingLayout></RoutingLayout>
              </Router>
            )}
          </>
        )}
      </Observer>

      <Global
        styles={css`
          ${reboot};
          ${SFfonts};

          html {
            font-size: 14px;
            line-height: 1.4;
            font-family: 'sf_ui_text';
            font-weight: normal;
          }

          body {
            background-color: ${Colors.BACKGROUD_PAGE};
            color: #fff;
          }

          .grecaptcha-badge {
            visibility: hidden;
          }

          .input-border {
            border: 1px solid #494b50;
            &.error {
              border-color: #ed145b !important;
            }
          }
        `}
      />
    </>
  );
};

export default MainApp;

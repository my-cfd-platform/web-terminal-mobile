import React, { useEffect, FC, useCallback } from 'react';
import { Global, css } from '@emotion/core';
import { reboot } from './styles/reboot';
import Helmet from 'react-helmet';
import RoutingLayout from './routing/RoutingLayout';
import { BrowserRouter as Router } from 'react-router-dom';
import 'react-dates/lib/css/_datepicker.css';
import { useStores } from './hooks/useStores';
import { useTranslation } from 'react-i18next';
import { autorun } from 'mobx';
import Colors from './constants/Colors';
import pagesWithoutReload from './constants/pagesWithoutReload';
import { SFfonts } from './styles/SFfonts';
import { AccountTypeEnum } from './enums/AccountTypeEnum';
import API from './helpers/API';
import apiResponseCodeMessages from './constants/apiResponseCodeMessages';
import { OperationApiResponseCodes } from './enums/OperationApiResponseCodes';
import { FULL_VH } from './constants/global';
import 'react-smartbanner/dist/main.css';

const MainApp: FC = () => {
  const { mainAppStore, instrumentsStore, badRequestPopupStore } = useStores();
  const { t, i18n } = useTranslation();

  const fetchFavoriteInstruments = useCallback(async () => {
    const accountType = mainAppStore.activeAccount?.isLive
      ? AccountTypeEnum.Live
      : AccountTypeEnum.Demo;
    try {
      const response = await API.getFavoriteInstrumets({
        type: accountType,
        accountId: mainAppStore.activeAccountId,
      });
      instrumentsStore.setActiveInstrumentsIds(response.reverse());

      // https://monfex.atlassian.net/browse/WEBT-475
      // if app is reinitializing, we should wait widget first
      if (instrumentsStore.activeInstrument) {
        mainAppStore.isLoading = false;
      }

      if (!response.length) {
        throw new Error(
          t(apiResponseCodeMessages[OperationApiResponseCodes.TechnicalError])
        );
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
    mainAppStore.handleInitConnection();
  }, [mainAppStore.isAuthorized]);

  useEffect(() => {
    autorun(() => {
      if (mainAppStore.lang) {
        i18n.changeLanguage(mainAppStore.lang);
      }
    });
    document.documentElement.style.setProperty(
      '--vh',
      `${window.innerHeight * 0.01}px`
    );
  }, []);

  useEffect(() => {
    window.addEventListener('resize', () => {
      document.documentElement.style.setProperty(
        '--vh',
        `${window.innerHeight * 0.01}px`
      );
    });
  }, []);

  useEffect(() => {
    function handleVisibilityChange() {
      const currentLocation = window.location.pathname;
      if (pagesWithoutReload.includes(currentLocation)) {
        return false;
      }
      window.location.reload();
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
        <script
          src={`https://www.google.com/recaptcha/api.js?render=${mainAppStore.initModel.recaptchaToken}`}
        ></script>
        <meta
          name="apple-itunes-app"
          content={`app-id=${mainAppStore.initModel.iosAppId}`}
        />
        <meta
          name="google-play-app"
          content={`app-id=${mainAppStore.initModel.androidAppId}`}
        />
      </Helmet>
      <Router>
        <RoutingLayout></RoutingLayout>
      </Router>
      <Global
        styles={css`
          ${reboot};
          ${SFfonts};

          html {
            font-size: 14px;
            line-height: 1.4;
            font-family: 'sf_ui_text';
            font-weight: normal;
            height: 100%;
            height: calc(${FULL_VH});
            height: -moz-available;
            height: -webkit-fill-available;
            height: fill-available;
            overflow: hidden;
          }

          body {
            color: #fff;
            background-color: ${Colors.BACKGROUD_PAGE};
            height: 100%;
            overscroll-behavior: contain;
          }

          #root {
            height: 100%;
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

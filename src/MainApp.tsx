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
import SmartBanner from 'react-smartbanner';
import { Observer } from 'mobx-react-lite';

declare const window: any;

const DAYS_HIDDEN = IS_LIVE ? 30 : 1;
const DAYS_VIEW_HIDDEN = IS_LIVE ? 90 : 1;

const MainApp: FC = () => {
  const { mainAppStore, instrumentsStore } = useStores();
  const { t, i18n } = useTranslation();

  const isPromoAccountView = useCallback(() => {
    return (
      (mainAppStore.promo !== 'facebook' || !mainAppStore.isDemoRealPopup) &&
      !mainAppStore.isInitLoading
    );
  }, [
    mainAppStore.promo,
    mainAppStore.isPromoAccount,
    mainAppStore.isInitLoading,
  ]);

  const setFullHeightProperty = () => {
    document.documentElement.style.setProperty(
      '--vh',
      `${window.innerHeight * 0.01}px`
    );
  };

  useEffect(() => {
    mainAppStore.handleInitConnection();
  }, [mainAppStore.isAuthorized]);

  useEffect(() => {
    autorun(() => {
      if (mainAppStore.lang) {
        i18n.changeLanguage(mainAppStore.lang);
      }
    });
    setFullHeightProperty();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', () => {
      console.log('resize');
      setFullHeightProperty();
    });

    window.addEventListener('orientationchange', () => {
      console.log('change landscape');
      setFullHeightProperty();
    });
  }, []);

  useEffect(() => {
    function handleVisibilityChange() {
      const currentLocation = window.location.pathname;
      if (pagesWithoutReload.includes(currentLocation)) {
        return false;
      }
      !IS_LOCAL && window.location.reload();
    }

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
      false
    );
  }, []);

  useEffect(() => {
    window.stopPongDebugMode = function () {
      console.log('DEBUG: Stop listen pong');
      mainAppStore.debugSocketMode = true;
    };

    window.stopPingDebugMode = function () {
      console.log('DEBUG: Stop send ping');
      mainAppStore.debugDontPing = true;
    };

    window.startSocketInitError = function () {
      console.log('DEBUG: Open connection has error');
      mainAppStore.debugSocketReconnect = true;
    };

    window.stopSocketInitError = function () {
      console.log('DEBUG: Stop Socket Init Error');
      mainAppStore.debugSocketReconnect = false;
    };

    window.debugSocketServerError = () => {
      console.log('DEBUG: Test servererror message');
      const response = {
        data: { reason: 'Test Server error' },
        now: 'test',
      };
      mainAppStore.handleSocketServerError(response);
    };

    window.debugSocketCloseError = () => {
      console.log('DEBUG: Stop Socket with Error');
      const error = new Error('Socket close error');
      mainAppStore.handleSocketCloseError(error);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {`${mainAppStore.initModel.brandName} ${t(
            !isPromoAccountView && !mainAppStore.isPromoAccount
              ? 'trading platform'
              : ''
          )}`}
        </title>

        <link rel="shortcut icon" href={mainAppStore.initModel.favicon} />
        <script
          src={`https://www.google.com/recaptcha/api.js?render=${mainAppStore.initModel.recaptchaToken}`}
        ></script>

        {!isPromoAccountView() && (
          <meta
            name="apple-itunes-app"
            content={`app-id=${
              IS_LOCAL ? '223123123' : mainAppStore.initModel.iosAppId
            }`}
          />
        )}
        {!isPromoAccountView() && (
          <meta
            name="google-play-app"
            content={`app-id=${
              IS_LOCAL
                ? 'com.monfex.trade'
                : mainAppStore.initModel.androidAppId
            }`}
          />
        )}

        <link
          rel="apple-touch-icon"
          href={
            IS_LOCAL
              ? 'https://trading-test.monfex.biz/br/mobile_app_logo.png'
              : mainAppStore.initModel.mobileAppLogo
          }
        ></link>

        <link
          rel="android-touch-icon"
          href={mainAppStore.initModel.mobileAppLogo}
        ></link>
      </Helmet>

      <Router>
        <RoutingLayout></RoutingLayout>
      </Router>
      <Observer>
        {() => (
          <>
            {!mainAppStore.isInitLoading && (
              <SmartBanner
                title={mainAppStore.initModel.brandName}
                daysHidden={DAYS_HIDDEN}
                daysReminder={DAYS_VIEW_HIDDEN}
                ignoreIosVersion={true}
                url={{
                  ios: IS_LOCAL ? 'asd' : mainAppStore.initModel.iosAppLink,
                  android: IS_LOCAL
                    ? 'asd'
                    : mainAppStore.initModel.androidAppLink,
                }}
              />
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
            font-family: 'sf_ui_text', Arial, Helvetica, sans-serif;
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
            height: calc(${FULL_VH});
            overscroll-behavior: contain;
          }

          #root {
            height: calc(${FULL_VH});
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
          .smartbanner-show .smartbanner {
            display: flex;
            align-items: center;
          }
          .smartbanner {
            &-container {
              width: 100%;
            }
          }
        `}
      />
    </>
  );
};

export default MainApp;

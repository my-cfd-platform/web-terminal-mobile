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

const DAYS_HIDDEN = IS_LIVE ? 30 : 1;
const DAYS_VIEW_HIDDEN = IS_LIVE ? 90 : 1;

const MainApp: FC = () => {
  const { mainAppStore, instrumentsStore, badRequestPopupStore } = useStores();
  const { t, i18n } = useTranslation();

  const fetchFavoriteInstruments = useCallback(async () => {
    const accountType = mainAppStore.activeAccount?.isLive
      ? AccountTypeEnum.Live
      : AccountTypeEnum.Demo;
    mainAppStore.setLoading(true);
    try {
      const response = await API.getFavoriteInstrumets({
        type: accountType,
        accountId: mainAppStore.activeAccountId,
      });
      instrumentsStore.setActiveInstrumentsIds(response.reverse());

      // https://monfex.atlassian.net/browse/WEBT-475
      // if app is reinitializing, we should wait widget first

      if (!response.length) {
        throw new Error(
          t(apiResponseCodeMessages[OperationApiResponseCodes.TechnicalError])
        );
      }
      await instrumentsStore.switchInstrument(response[response.length - 1]);
      mainAppStore.setLoading(false);
    } catch (error) {
      mainAppStore.setLoading(false);
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
      !IS_LOCAL && window.location.reload();
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
        {(!mainAppStore.isPromoAccount || mainAppStore.promo !== "facebook") && !mainAppStore.isInitLoading ? (
          <title>{`${mainAppStore.initModel.brandName} ${t(
            'trading platform'
          )}`}</title>
        ) : (
          <title>{`${mainAppStore.initModel.brandName}`}</title>
        )}

        <link rel="shortcut icon" href={mainAppStore.initModel.favicon} />
        <script
          src={`https://www.google.com/recaptcha/api.js?render=${mainAppStore.initModel.recaptchaToken}`}
        ></script>
        {(mainAppStore.promo !== 'facebook' || !mainAppStore.isDemoRealPopup) &&
          !mainAppStore.isInitLoading && (
            <>
              <meta
                name="apple-itunes-app"
                content={`app-id=${
                  IS_LOCAL ? '223123123' : mainAppStore.initModel.iosAppId
                }`}
              />
              <meta
                name="google-play-app"
                content={`app-id=${mainAppStore.initModel.androidAppId}`}
              />
              <link
                rel="apple-touch-icon"
                href={
                  IS_LOCAL
                    ? 'https://trading-test.monfex.biz/br/mobile_app_logo.png'
                    : mainAppStore.initModel.mobileAppLogo
                }
              ></link>
            </>
          )}

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
                  android: mainAppStore.initModel.androidAppLink,
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

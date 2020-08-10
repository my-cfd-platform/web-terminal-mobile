import React, { useEffect, FC } from 'react';
import { Global, css } from '@emotion/core';
import { reboot } from './styles/reboot';
import Helmet from 'react-helmet';
import RoutingLayout from './routing/RoutingLayout';
import { BrowserRouter as Router } from 'react-router-dom';
import 'react-dates/lib/css/_datepicker.css';
import LoaderFullscreen from './components/LoaderFullscreen';
import { useStores } from './hooks/useStores';
import { Observer } from 'mobx-react-lite';
import injectInerceptors from './http/interceptors';
import { useTranslation } from 'react-i18next';
import { autorun } from 'mobx';
import Colors from './constants/Colors';

const MainApp: FC = () => {
  const { mainAppStore } = useStores();
  const { t, i18n } = useTranslation();

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
    })
  }, []);

  return (
    <>
      {/* <Observer>
        {() => <LoaderFullscreen isLoading={!mainAppStore.tradingUrl} />}
      </Observer> */}
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
          @import url(//db.onlinewebfonts.com/c/1c45e28f8e86cc89876f003b953cc3e9?family=SF+Pro+Text);
          ${reboot};

          html {
            font-size: 14px;
            line-height: 1.4;
            font-family: 'SF Pro Text', sans-serif;
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
              border-color: #ED145B !important;
            }
          }

        `}
      />
    </>
  );
};

export default MainApp;

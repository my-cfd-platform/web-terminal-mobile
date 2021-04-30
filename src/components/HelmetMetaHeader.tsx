import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useStores } from '../hooks/useStores';

const HelmetMetaHeader: FC = observer(() => {
  const { mainAppStore } = useStores();
  const { t } = useTranslation();
  return (
    <Helmet>
      <title>
        {`${mainAppStore.initModel.brandName} ${t(
          !mainAppStore.isPromoAccount && !mainAppStore.isInitLoading
            ? 'trading platform'
            : ''
        )}`}
      </title>

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
  );
});

export default HelmetMetaHeader;

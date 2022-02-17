import { push } from 'mixpanel-browser';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import LoaderFullscreen from '../components/LoaderFullscreen';
import Page from '../constants/Pages';
import useQuery from '../hooks/useQuery';
import useRedirectMiddleware from '../hooks/useRedirectMiddleware';
import { useStores } from '../hooks/useStores';

const DepositPage = observer(() => {
  const urlParams = new URLSearchParams();
  let query = useQuery();

  const { userProfileStore, mainAppStore } = useStores();
  const { redirectWithUpdateRefreshToken } = useRedirectMiddleware();
  const [parsedParams, setParsedParams] = useState('');
  const { push } = useHistory();

  const handleOpenDeposit = useCallback(() => {
    if (userProfileStore.isBonus) {
      userProfileStore.showBonusPopup();
      push(Page.DASHBOARD);
      return;
    }
    return redirectWithUpdateRefreshToken(API_DEPOSIT_STRING, parsedParams);
  }, [parsedParams, userProfileStore]);

  useEffect(() => {
    urlParams.set('token', mainAppStore.token);
    urlParams.set(
      'active_account_id',
      query.get('accountId') ||
        mainAppStore.accounts.find((item) => item.isLive)?.id ||
        ''
    );
    urlParams.set('env', 'web_mob');
    urlParams.set('trader_id', userProfileStore.userProfileId || '');
    urlParams.set('lang', mainAppStore.lang);
    urlParams.set('api', mainAppStore.initModel.tradingUrl);
    urlParams.set('rt', mainAppStore.refreshToken);
    setParsedParams(urlParams.toString());

    if (mainAppStore.token && mainAppStore.isAuthorized && parsedParams) {
      handleOpenDeposit();
    }
  }, [
    mainAppStore.token,
    mainAppStore.lang,
    mainAppStore.accounts,
    parsedParams,
  ]);

  return <LoaderFullscreen isLoading={true} />;
});

export default DepositPage;

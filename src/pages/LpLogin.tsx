import React, { useEffect, useState } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useStores } from '../hooks/useStores';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import Page from '../constants/Pages';
import { useTranslation } from 'react-i18next';
import API from '../helpers/API';
import { getProcessId } from '../helpers/getProcessId';
import { observer } from 'mobx-react-lite';
import { CountriesEnum } from '../enums/CountriesEnum';
import LoaderFullscreen from '../components/LoaderFullscreen';

interface QueryParams {
  lang: string;
  token: string;
  page?: 'withdrawal' | 'deposit';
}

const LpLogin = observer(() => {
  const { token, lang, page } = useParams<QueryParams>();
  const { push } = useHistory();
  const { mainAppStore, userProfileStore } = useStores();
  const { i18n } = useTranslation();
  const location = useLocation();

  const pageParams = new URLSearchParams(location.search);

  useEffect(() => {
    async function fetchLpLogin() {
      mainAppStore.signOut();
      try {
        const response = await mainAppStore.signInLpLogin({
          token: token || '',
        });
        if (response === OperationApiResponseCodes.Ok) {
          mainAppStore.setSignUpFlag(true);
          mainAppStore.setLpLoginFlag(true);
          switch (page) {
            case 'deposit':
              break;

            case 'withdrawal':
              push(Page.WITHDRAW_LIST);
              break;

            default:
              const showOnBoarding = await mainAppStore.checkOnboardingShowLPLogin();
              if (showOnBoarding) {
                await mainAppStore.addTriggerShowOnboarding();
                setTimeout(() => {
                  push(Page.ONBOARDING);
                }, 500);
              } else {
                push(Page.DASHBOARD);
              }
              break;
          }
        } else {
          push(Page.SIGN_IN);
        }
      } catch (error) {
        push(Page.SIGN_IN);
      }
    }

    fetchLpLogin();
    const pageLang: CountriesEnum =
      (pageParams.get('lang')?.toLowerCase() as CountriesEnum) ||
      CountriesEnum.EN;

    i18n.changeLanguage(pageLang);
    mainAppStore.setLanguage(pageLang);

  }, []);

  useEffect(() => {
    if (
      page === 'deposit' &&
      mainAppStore.isAuthorized &&
      mainAppStore.accounts.length &&
      userProfileStore.userProfileId
    ) {
      const urlParams = new URLSearchParams();
      urlParams.set('token', mainAppStore.token);
      urlParams.set(
        'active_account_id',
        mainAppStore.accounts.find((item) => item.isLive)?.id || ''
      );
      urlParams.set('lang', mainAppStore.lang);
      urlParams.set('env', 'web_mob');
      urlParams.set('trader_id', userProfileStore.userProfileId);
      urlParams.set('api', mainAppStore.initModel.tradingUrl);
      urlParams.set('rt', mainAppStore.refreshToken);
      window.location.href = `${API_DEPOSIT_STRING}/?${urlParams.toString()}`;
    }
  }, [
    page,
    mainAppStore.accounts,
    userProfileStore.userProfileId,
    mainAppStore.isAuthorized,
  ]);

  return <LoaderFullscreen isLoading={true} />;
});

export default LpLogin;

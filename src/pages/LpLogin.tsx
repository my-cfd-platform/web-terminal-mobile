import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useStores } from '../hooks/useStores';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import Page from '../constants/Pages';
import { useTranslation } from 'react-i18next';
import API from '../helpers/API';
import { getProcessId } from '../helpers/getProcessId';
import { observer } from 'mobx-react-lite';

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

  useEffect(() => {
    async function fetchLpLogin() {
      try {
        const response = await mainAppStore.signInLpLogin({
          token: token || '',
        });
        if (response === OperationApiResponseCodes.Ok) {
          switch (page) {
            case 'deposit':
              break;

            case 'withdrawal':
              push(Page.WITHDRAW_LIST);
              break;

            default:
              push(Page.DASHBOARD);
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
    if (lang) {
      i18n.changeLanguage(lang);
    }
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
      window.location.href = `${
        IS_LIVE ? mainAppStore.initModel.tradingUrl : ''
      }${API_DEPOSIT_STRING}/?${urlParams.toString()}`;
    }
  }, [
    page,
    mainAppStore.accounts,
    userProfileStore.userProfileId,
    mainAppStore.isAuthorized,
  ]);

  return <div></div>;
});

export default LpLogin;

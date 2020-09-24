import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useStores } from '../hooks/useStores';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import Page from '../constants/Pages';
import { useTranslation } from 'react-i18next';

interface QueryParams {
  lang: string;
  token: string;
  page?: 'withdrawal' | 'deposit';
}

const LpLogin = () => {
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
              const urlParams = new URLSearchParams();
              urlParams.set('token', mainAppStore.token);
              urlParams.set(
                'active_account_id',
                mainAppStore.accounts.find((item) => item.isLive)?.id || ''
              );
              urlParams.set('lang', mainAppStore.lang);
              urlParams.set('env', 'web_mob');
              urlParams.set('trader_id', userProfileStore.userProfileId || '');
              window.location.href = `${API_DEPOSIT_STRING}/?${urlParams.toString()}`;
              break;

            case 'withdrawal':
              push(Page.ACCOUNT_WITHDRAW);
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

  return <div></div>;
};

export default LpLogin;

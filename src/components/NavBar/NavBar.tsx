import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import AccountsSwitchLink from './AccountsSwitchLink';
import Colors from '../../constants/Colors';
import AccountLabel from './AccountLabel';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import useRedirectMiddleware from '../../hooks/useRedirectMiddleware';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import AccountSwitcher from '../AccountSwitcher/AccountSwitcher';

const NavBar = observer(() => {
  const { mainAppStore, userProfileStore } = useStores();
  const urlParams = new URLSearchParams();
  const { t } = useTranslation();
  const [parsedParams, setParsedParams] = useState('');

  const { redirectWithUpdateRefreshToken } = useRedirectMiddleware();

  useEffect(() => {
    urlParams.set('token', mainAppStore.token);
    urlParams.set(
      'active_account_id',
      mainAppStore.accounts.find((item) => item.isLive)?.id || ''
    );
    urlParams.set('lang', mainAppStore.lang);
    urlParams.set('env', 'web_mob');
    urlParams.set('trader_id', userProfileStore.userProfileId || '');
    urlParams.set('api', mainAppStore.initModel.tradingUrl);
    urlParams.set('rt', mainAppStore.refreshToken);
    setParsedParams(urlParams.toString());
  }, [
    mainAppStore.token,
    mainAppStore.lang,
    mainAppStore.accounts,
    userProfileStore.userProfileId,
  ]);
  return (
    <FlexContainer
      width="100vw"
      position="relative"
      alignItems="center"
      justifyContent="center"
      height="48px"
    >
      <AccountLabel />
      <AccountsSwitchLink />
      <DepositLink onClick={() => redirectWithUpdateRefreshToken(API_DEPOSIT_STRING, parsedParams)}>
        {t('Deposit')}
      </DepositLink>
      <AccountSwitcher show={mainAppStore.showAccountSwitcher} />
    </FlexContainer>
  );
});

export default NavBar;

const DepositLink = styled(ButtonWithoutStyles)`
  font-size: 16px;
  line-height: 1.3;
  padding: 4px 0;
  font-weight: 500;
  color: ${Colors.ACCENT_BLUE};
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
`;

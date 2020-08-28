import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import AccountsSwitchLink from './AccountsSwitchLink';
import Colors from '../../constants/Colors';
import AccountLabel from './AccountLabel';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

const NavBar = observer(() => {
  const { mainAppStore } = useStores();
  const urlParams = new URLSearchParams();
  const { t } = useTranslation();
  const [parsedParams, setParsedParams] = useState('');

  useEffect(() => {
    urlParams.set('token', mainAppStore.token);
    urlParams.set('active_account_id', mainAppStore.activeAccountId);
    urlParams.set('lang', mainAppStore.lang);
    setParsedParams(urlParams.toString());
  }, [mainAppStore.token, mainAppStore.lang, mainAppStore.activeAccountId]);
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
      <DepositLink href={`${API_DEPOSIT_STRING}/?${parsedParams}`}>
        {t('Deposit')}
      </DepositLink>
    </FlexContainer>
  );
});

export default NavBar;

const DepositLink = styled.a`
  font-size: 16px;
  line-height: 1;
  font-weight: 500;
  color: ${Colors.ACCENT_BLUE};
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
`;

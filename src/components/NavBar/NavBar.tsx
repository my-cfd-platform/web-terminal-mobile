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
import SvgIcon from '../SvgIcon';
import IconGift from '../../assets/svg_no_compress/icon-deposit-gift.svg';
import PopupContainer from '../../containers/PopupContainer';
import BonusPopup from '../BonusPopup';
import { useCallback } from 'react';
import { FC } from 'react';

interface Props {
  showBar: boolean;
}
const NavBar: FC<Props> = observer(({ showBar }) => {
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

  useEffect(() => {
    if (
      mainAppStore.paramsDeposit &&
      mainAppStore.refreshToken &&
      userProfileStore.userProfileId &&
      mainAppStore.accounts.length &&
      mainAppStore.lang &&
      mainAppStore.token &&
      mainAppStore.initModel.tradingUrl &&
      !mainAppStore.isPromoAccount &&
      !mainAppStore.promo
    ) {
      const newUrlParams = new URLSearchParams();
      newUrlParams.set('token', mainAppStore.token);
      newUrlParams.set(
        'active_account_id',
        mainAppStore.accounts.find((item) => item.isLive)?.id || ''
      );
      newUrlParams.set('lang', mainAppStore.lang);
      newUrlParams.set('env', 'web_mob');
      newUrlParams.set('trader_id', userProfileStore.userProfileId || '');
      newUrlParams.set('api', mainAppStore.initModel.tradingUrl);
      newUrlParams.set('rt', mainAppStore.refreshToken);
      const newParsedParams = newUrlParams.toString();
      mainAppStore.setParamsDeposit(false);
      redirectWithUpdateRefreshToken(API_DEPOSIT_STRING, newParsedParams);
    }
  }, [
    mainAppStore.refreshToken,
    mainAppStore.paramsDeposit,
    userProfileStore.userProfileId,
    mainAppStore.accounts,
    mainAppStore.lang,
    mainAppStore.token,
    mainAppStore.initModel.tradingUrl,
    mainAppStore.isPromoAccount,
    mainAppStore.promo,
  ]);

  const handleOpenDeposit = useCallback(
    (useBonus: boolean) => {
      const newUrlParams = new URLSearchParams(parsedParams);

      newUrlParams.set('useBonus', `${useBonus}`);
      newUrlParams.set('expBonus', `${userProfileStore.bonusExpirationDate}`);
      newUrlParams.set('amountBonus', `${userProfileStore.bonusPercent}`);

      const newParsedParams = newUrlParams.toString();
      mainAppStore.setParamsDeposit(false);
      return redirectWithUpdateRefreshToken(
        API_DEPOSIT_STRING,
        newParsedParams
      );
    },
    [parsedParams, userProfileStore]
  );

  const handleClickDeposit = useCallback(() => {
    if (userProfileStore.isBonus) {
      userProfileStore.showBonusPopup();
    } else {
      return redirectWithUpdateRefreshToken(API_DEPOSIT_STRING, parsedParams);
    }
  }, [userProfileStore.isBonus, parsedParams]);

  return (
    <>
      {showBar && (
        <FlexContainer
          width="100vw"
          position="relative"
          alignItems="center"
          justifyContent="space-between"
          height="48px"
          padding="0 16px"
          backgroundColor="#1C1F26"
        >
          <FlexContainer flexDirection="row">
            <AccountLabel />
            <AccountsSwitchLink />
          </FlexContainer>
          <FlexContainer>
            {!mainAppStore.isPromoAccount && (
              <DepositLink onClick={handleClickDeposit}>
                {userProfileStore.isBonus && (
                  <FlexContainer marginRight="4px">
                    <SvgIcon {...IconGift} />
                  </FlexContainer>
                )}
                {t('Deposit')}
              </DepositLink>
            )}
          </FlexContainer>
          <AccountSwitcher show={mainAppStore.showAccountSwitcher} />
        </FlexContainer>
      )}

      {userProfileStore.isBonusPopup && userProfileStore.isBonus && (
        <BonusPopup handleDeposit={handleOpenDeposit} />
      )}
    </>
  );
});

export default NavBar;

const DepositLink = styled(ButtonWithoutStyles)`
  font-size: 16px;
  font-weight: 500;
  color: ${Colors.ACCENT_BLUE};
  display: flex;
  flex-direction: row;
  align-items: center;
`;

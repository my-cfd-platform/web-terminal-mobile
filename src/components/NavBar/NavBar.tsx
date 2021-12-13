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
import EducationSuccessPopup from '../Education/EducationSuccessPopup';
import AccountStatusBar from './AccountStatusBar';
import { AccountStatusEnum } from '../../enums/AccountStatusEnum';
import AccountStatusNextStepInfoModal from '../AccountStatus/AccountStatusNextStepInfoModal';
import NewStatusPopup from '../AccountStatus/NewStatusPopup';

interface Props {
  showBar: boolean;
}
const NavBar: FC<Props> = observer(({ showBar }) => {
  const { mainAppStore, userProfileStore, educationStore } = useStores();
  const urlParams = new URLSearchParams();
  const { t } = useTranslation();
  const [parsedParams, setParsedParams] = useState('');

  const [showStatusDescription, setShowSD] = useState(false);

  const { redirectWithUpdateRefreshToken } = useRedirectMiddleware();

  const handleOpenSD = () => {
    setShowSD(true);
  };

  const handleCloseSD = () => {
    setShowSD(false);
  };

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

  useEffect(() => {
    if (
      mainAppStore.token &&
      mainAppStore.isAuthorized &&
      !mainAppStore.promo &&
      !mainAppStore.isPromoAccount &&
      !mainAppStore.activeACCLoading
    ) {
      educationStore.getCourserList();
    }
  }, [
    mainAppStore.lang,
    mainAppStore.isAuthorized,
    mainAppStore.token,
    mainAppStore.isPromoAccount,
    mainAppStore.promo,
    mainAppStore.activeACCLoading,
  ]);

  return (
    <>
      {showBar && (
        <FlexContainer
          width="100vw"
          maxWidth="414px"
          position="relative"
          alignItems="center"
          justifyContent="space-between"
          height="48px"
          padding="0 16px"
          backgroundColor="#1C1F26"
          margin="0 auto"
        >
          <FlexContainer flexDirection="column" alignItems="flex-start">
            <AccountLabel />
            <AccountsSwitchLink />
          </FlexContainer>

          {!mainAppStore.isPromoAccount &&
            userProfileStore.currentAccountTypeId !== null &&
            userProfileStore.statusTypes !== null && (
              <>
                <AccountStatusBar
                  donePercent={20}
                  onClick={handleOpenSD}
                  activeStatus={userProfileStore.userStatus}
                />

                {showStatusDescription && (
                  <>
                    {userProfileStore.userStatus ===
                    userProfileStore.userNextStatus ? (
                      <NewStatusPopup
                        activeStatus={userProfileStore.userStatus}
                      />
                    ) : (
                      <AccountStatusNextStepInfoModal
                        closeModal={handleCloseSD}
                        prevStatusType={userProfileStore.userStatus}
                        activeStatus={userProfileStore.userNextStatus}
                      />
                    )}
                  </>
                )}

                {userProfileStore.isCongratModal && !showStatusDescription && (
                  <NewStatusPopup activeStatus={userProfileStore.userStatus} />
                )}
              </>
            )}

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

      {userProfileStore.isBonusPopup &&
        userProfileStore.isBonus &&
        !mainAppStore.isPromoAccount && (
          <BonusPopup handleDeposit={handleOpenDeposit} />
        )}

      {!mainAppStore.isPromoAccount && educationStore.showPopup && (
        <EducationSuccessPopup />
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

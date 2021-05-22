import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan, QuoteText } from '../../styles/TextsElements';
import { AccountModelWebSocketDTO } from '../../types/AccountsTypes';
import SvgIcon from '../SvgIcon';
import CopyIcon from '../../assets/svg/accounts/icon-copy.svg';
import { useStores } from '../../hooks/useStores';
import { moneyFormatPart } from '../../helpers/moneyFormat';
import { getNumberSign } from '../../helpers/getNumberSign';
import { autorun } from 'mobx';
import { PrimaryButton, SecondaryButton } from '../../styles/Buttons';
import { useSwipeable } from 'react-swipeable';
import useRedirectMiddleware from '../../hooks/useRedirectMiddleware';
import { useHistory } from 'react-router';
import Page from '../../constants/Pages';

interface IAccountSwitchItemProps {
  onSwitch: (accId: string) => void;
  account: AccountModelWebSocketDTO;
  isActive: boolean;
}
const AccountSwitchItem = ({
  onSwitch,
  account,
  isActive,
}: IAccountSwitchItemProps) => {
  const {
    quotesStore,
    notificationStore,
    mainAppStore,
    userProfileStore,
  } = useStores();
  const { t } = useTranslation();
  const { push } = useHistory();

  const [profit, setProfit] = useState(quotesStore.profit);
  const [total, setTotal] = useState(quotesStore.total);

  const handlerSwipe = useSwipeable({
    onSwipedDown: () => mainAppStore.closeAccountSwitcher(),
  });

  const handleClickCopy = (e: any, accountId: string) => {
    e.stopPropagation();
    let el = document.createElement('textarea');
    el.value = accountId;
    el.setAttribute('readonly', '');
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    //  --- --- --- --- ---
    notificationStore.setNotification(t('Copied to clipboard'));
    notificationStore.isSuccessfull = true;
    notificationStore.openNotification();
  };

  const [parsedParams, setParsedParams] = useState('');

  const { redirectWithUpdateRefreshToken } = useRedirectMiddleware();
  const urlParams = new URLSearchParams();
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
    if (isActive) {
      const disposer = autorun(
        () => {
          setProfit(quotesStore.profit);
          setTotal(quotesStore.total);
        },
        { delay: 1000 }
      );
      return () => {
        disposer();
      };
    }
  }, [isActive]);

  const handleSwitch = () => () => {
    onSwitch(account.id);
  };

  return (
    <FlexContainer
      padding="16px"
      height="368px"
      border="1px solid rgba(255, 255, 255, 0.2)"
      backgroundColor={isActive ? '#292C33' : '#1C1F26'}
      borderRadius="8px"
      margin="0 0 0 16px"
      width="80vw"
      flexDirection="column"
      justifyContent="space-between"
      {...handlerSwipe}
    >
      {/* TOP */}
      <FlexContainer flexDirection="column" flex="1">
        {/* HEADER */}
        <FlexContainer flexDirection="column">
          <FlexContainer
            width="100%"
            alignItems="flex-end"
            justifyContent="space-between"
          >
            <PrimaryTextSpan
              fontSize="18px"
              color={isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.4)'}
            >
              {t(account?.isLive ? 'Real' : 'Demo')}
            </PrimaryTextSpan>

            <FlexContainer>
              <PrimaryTextSpan
                fontSize="12px"
                color="rgba(255, 255, 255, 0.4)"
                textTransform="uppercase"
                marginRight="8px"
              >
                {account?.id}
              </PrimaryTextSpan>

              <ButtonWithoutStyles
                onClick={(e) => handleClickCopy(e, account?.id || '')}
              >
                <SvgIcon {...CopyIcon} fillColor="rgba(255, 255, 255, 0.4)" />
              </ButtonWithoutStyles>
            </FlexContainer>
          </FlexContainer>

          <FlexContainer
            height="1px"
            width="100%"
            margin="16px 0"
            backgroundColor="rgba(255, 255, 255, 0.2)"
          />

          <FlexContainer justifyContent="flex-end" marginBottom="16px">
            <PrimaryTextSpan
              color={isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.4)'}
              fontSize="28px"
            >
              {account?.symbol}
              {isActive
                ? moneyFormatPart(total).int
                : moneyFormatPart(account?.balance || 0).int}
              <PrimaryTextSpan
                fontSize="18px"
                color={isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.4)'}
              >
                .
                {isActive
                  ? moneyFormatPart(total).decimal
                  : moneyFormatPart(account?.balance || 0).decimal}
              </PrimaryTextSpan>
            </PrimaryTextSpan>
          </FlexContainer>
        </FlexContainer>
        {/*END HEADER */}

        {/* ACCOUNT DESCRIPTION */}
        {isActive && (
          <>
            <FlexContainer flexDirection="column">
              <FlexContainer
                justifyContent="space-between"
                alignItems="center"
                marginBottom="16px"
              >
                <PrimaryTextSpan
                  fontSize="16px"
                  color="rgba(255, 255, 255, 0.4)"
                >
                  {t('Invested')}
                </PrimaryTextSpan>
                <PrimaryTextSpan fontSize="16px" color="#FFFCCC">
                  {account?.symbol}
                  {moneyFormatPart(quotesStore.invest).int}

                  <PrimaryTextSpan fontSize="10px" color="#fffccc">
                    .{moneyFormatPart(quotesStore.invest).decimal}
                  </PrimaryTextSpan>
                </PrimaryTextSpan>
              </FlexContainer>

              <FlexContainer
                justifyContent="space-between"
                alignItems="center"
                marginBottom="16px"
              >
                <PrimaryTextSpan
                  fontSize="16px"
                  color="rgba(255, 255, 255, 0.4)"
                >
                  {t('Profit')}
                </PrimaryTextSpan>
                <PrimaryTextSpan>
                  <QuoteText fontSize="16px" isGrowth={profit >= 0}>
                    {getNumberSign(profit)}
                    {account?.symbol}
                    {moneyFormatPart(Math.abs(profit)).int}
                    <QuoteText fontSize="10px" isGrowth={profit >= 0}>
                      .{moneyFormatPart(Math.abs(profit)).decimal}
                    </QuoteText>
                  </QuoteText>
                </PrimaryTextSpan>
              </FlexContainer>

              <FlexContainer justifyContent="space-between" alignItems="center">
                <PrimaryTextSpan
                  fontSize="16px"
                  color="rgba(255, 255, 255, 0.4)"
                >
                  {t('Available')}
                </PrimaryTextSpan>

                <PrimaryTextSpan fontSize="16px" color="#FFFCCC">
                  {account?.symbol}
                  {moneyFormatPart(account?.balance || 0).int}
                  <PrimaryTextSpan fontSize="10px" color="#fffccc">
                    .{moneyFormatPart(account?.balance || 0).decimal}
                  </PrimaryTextSpan>
                </PrimaryTextSpan>
              </FlexContainer>

              {account.bonus > 0 && (
                <>
                  <FlexContainer
                    height="1px"
                    width="100%"
                    margin="16px 0"
                    backgroundColor="rgba(255, 255, 255, 0.2)"
                  />
                  <FlexContainer
                    justifyContent="space-between"
                    alignItems="center"
                    marginBottom="16px"
                  >
                    <PrimaryTextSpan
                      fontSize="16px"
                      color="rgba(255, 255, 255, 0.4)"
                    >
                      {t('Bonus')}
                    </PrimaryTextSpan>
                    <PrimaryTextSpan fontSize="16px" color="#FFFCCC">
                      {account?.symbol}
                      {moneyFormatPart(account.bonus).int}

                      <PrimaryTextSpan fontSize="10px" color="#fffccc">
                        .{moneyFormatPart(account.bonus).decimal}
                      </PrimaryTextSpan>
                    </PrimaryTextSpan>
                  </FlexContainer>
                </>
              )}
            </FlexContainer>
          </>
        )}
        {/* END ACCOUNT DESCRIPTION */}
      </FlexContainer>
      {/* END TOP */}

      {/* CENTER */}
      {!isActive && (
        <FlexContainer flex="2" alignItems="center" justifyContent="center">
          <PrimaryButton
            isBorder={!account.isLive}
            height="46px"
            width="176px"
            onClick={handleSwitch()}
          >
            <PrimaryTextSpan
              fontWeight="bold"
              fontSize="16px"
              color={account.isLive ? '#252636' : '#ffffff'}
            >
              {t('Select account')}
            </PrimaryTextSpan>
          </PrimaryButton>
        </FlexContainer>
      )}
      {/* END CENTER */}

      {/* BOTOOM */}
      <FlexContainer flexDirection="column">
        {isActive && account.isLive && (
          <FlexContainer justifyContent="space-between" width="100%">
            <PrimaryButton
              width="calc(50% - 4px)"
              onClick={() => {
                redirectWithUpdateRefreshToken(
                  API_DEPOSIT_STRING,
                  parsedParams
                );
                mainAppStore.closeAccountSwitcher();
              }}
            >
              <PrimaryTextSpan
                color="#252636"
                fontSize="16px"
                fontWeight="bold"
              >
                {t('Deposit')}
              </PrimaryTextSpan>
            </PrimaryButton>
            <SecondaryButton
              width="calc(50% - 4px)"
              onClick={() => {
                mainAppStore.closeAccountSwitcher();
                push(Page.WITHDRAW_LIST);
              }}
            >
              <PrimaryTextSpan
                fontSize="16px"
                color="#fffccc"
                fontWeight="bold"
              >
                {t('Withdraw')}
              </PrimaryTextSpan>
            </SecondaryButton>
          </FlexContainer>
        )}

        {/* Фича будет в будущем */}
        {isActive && !account.isLive && 1 < 0 && (
          <FlexContainer justifyContent="space-between" width="100%">
            <SecondaryButton width="100%">
              <PrimaryTextSpan
                fontSize="16px"
                color="#fffccc"
                fontWeight="bold"
              >
                {t('Reload')}
              </PrimaryTextSpan>
            </SecondaryButton>
          </FlexContainer>
        )}
      </FlexContainer>
      {/* END BOTTOM */}
    </FlexContainer>
  );
};

export default AccountSwitchItem;

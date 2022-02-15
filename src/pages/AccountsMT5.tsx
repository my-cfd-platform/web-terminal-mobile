import React, { useEffect, useState } from 'react';
import BackFlowLayout from '../components/BackFlowLayout';
import SvgIcon from '../components/SvgIcon';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import IconMt5Plus from '../assets/svg/profile/icon-mt5-plus.svg';

import { useTranslation } from 'react-i18next';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import AccountMTItem from '../components/AccountMT/AccountMTItem';
import { useStores } from '../hooks/useStores';
import LogoMT from '../assets/images/logo-mt.png';
import Page from '../constants/Pages';
import {
  AccountModelWebSocketDTO,
  MTAccountDTO,
} from '../types/AccountsTypes';
import API from '../helpers/API';
import LoaderForComponents from '../components/LoaderForComponents';
import { useHistory } from 'react-router-dom';

const AccountsMT5 = () => {
  const { t } = useTranslation();
  const {
    mainAppStore,
    quotesStore,
    badRequestPopupStore,
    userProfileStore,
  } = useStores();
  const { push } = useHistory();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [
    accountInfo,
    setAccountInfo,
  ] = useState<AccountModelWebSocketDTO | null>(null);
  const [MTAccountInfo, setMTAccountInfo] = useState<MTAccountDTO[] | null>(
    null
  );

  const handleCreateMT = async () => {
    if (isLoading) {
      return false;
    }
    try {
      setIsLoading(true);
      const response = await API.createMTAccounts(
        mainAppStore.initModel.tradingUrl
      );
      if (
        !!response.investorPassword &&
        !!response.login &&
        !!response.password &&
        !!response.serverName
      ) {
        userProfileStore.setNewMTAccount(response);
        setIsLoading(false);
        push(Page.MT5_INFO_ACCOUNT);
      } else {
        setIsLoading(false);
        badRequestPopupStore.openModal();
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setAccountInfo(mainAppStore.accounts.find((item) => item.isLive) || null);
    async function fetchMTAccount() {
      try {
        const response = await API.getMTAccounts(
          mainAppStore.initModel.tradingUrl
        );
        if (response.length > 0) {
          setMTAccountInfo(response);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    }
    fetchMTAccount();
  }, []);

  return (
    <BackFlowLayout pageTitle="MT5">
      <FlexContainer
        flex="1"
        padding="16px"
        overflow="auto"
        flexDirection="column"
      >
        <AccountMTItem
          balance={accountInfo?.balance || 0}
          margin={quotesStore.invest || 0}
          bonus={accountInfo?.bonus || 0}
          depositLink={Page.DEPOSIT} // create redirect page component
          tradeLink={Page.DASHBOARD}
          label={mainAppStore.initModel.brandName || 'account'}
          image={mainAppStore.initModel.favicon}
        />

        {isLoading ? (
          <FlexContainer
            backgroundColor="rgba(255, 255, 255, 0.04)"
            border="1px dashed rgba(255, 255, 255, 0.64)"
            borderRadius="4px"
            marginBottom="16px"
            height="128px"
            justifyContent="center"
            alignItems="center"
            position="relative"
          >
            <LoaderForComponents isLoading={isLoading} />
          </FlexContainer>
        ) : (
          <>
            {MTAccountInfo?.map((accMt) => (
              <AccountMTItem
                isMT={true}
                balance={accMt.balance}
                margin={accMt.margin}
                depositLink={Page.DEPOSIT}
                tradeLink={accMt.tradeUrl}
                label="MT5"
                image={LogoMT}
              />
            ))}

            {MTAccountInfo?.length === 0 ? (
              <ButtonWithoutStyles onClick={handleCreateMT}>
                <FlexContainer
                  backgroundColor="rgba(255, 255, 255, 0.04)"
                  border="1px dashed rgba(255, 255, 255, 0.64)"
                  borderRadius="4px"
                  marginBottom="16px"
                  height="128px"
                  justifyContent="center"
                  alignItems="center"
                >
                  <FlexContainer marginRight="24px">
                    <SvgIcon {...IconMt5Plus} />
                  </FlexContainer>
                  <PrimaryTextSpan
                    color="#FFFCCC"
                    fontSize="20px"
                    fontWeight={500}
                  >
                    {t('Create MT5 Account')}
                  </PrimaryTextSpan>
                </FlexContainer>
              </ButtonWithoutStyles>
            ) : null}
          </>
        )}
      </FlexContainer>
    </BackFlowLayout>
  );
};

export default AccountsMT5;

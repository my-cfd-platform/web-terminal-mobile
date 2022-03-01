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
import { AccountModelWebSocketDTO, MTAccountDTO } from '../types/AccountsTypes';
import API from '../helpers/API';
import LoaderForComponents from '../components/LoaderForComponents';
import { useHistory } from 'react-router-dom';
import { checkObjectKeys } from '../helpers/checkObjectKeys';

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
        !!response.traderId &&
        !!response.accountId &&
        !!response.password &&
        !!response.serverName
      ) {
        userProfileStore.setNewMTAccount(response);
        setIsLoading(false);
        push(Page.MT5_INFO_ACCOUNT);
        try {
          const responseGet = await API.getMTAccounts(
            mainAppStore.initModel.tradingUrl
          );
          const checkData = responseGet.some((item) => {
            return (
              !item.serverName ||
              !(item.margin || item.margin === 0) ||
              !(item.login || item.login === 0) ||
              !(item.balance || item.balance === 0) ||
              !item.accountId ||
              !item.tradeUrl
            );
          });
          if (checkData) {
            setIsLoading(false);
            badRequestPopupStore.openModalReload();
          } else {
            if (responseGet.length > 0) {
              setMTAccountInfo(responseGet);
            }
          }
        } catch (error) {
          badRequestPopupStore.openModalReload();
        }
      } else {
        setIsLoading(false);
        badRequestPopupStore.openModalReload();
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
        const checkData = response.some((item) => {
          return (
            !item.serverName ||
            !(item.margin || item.margin === 0) ||
            !(item.login || item.login === 0) ||
            !(item.balance || item.balance === 0) ||
            !item.accountId ||
            !item.tradeUrl
          );
        });
        if (checkData) {
          setIsLoading(false);
          badRequestPopupStore.openModalReload();
        } else {
          if (response.length > 0) {
            setMTAccountInfo(response);
          }
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    }
    fetchMTAccount();
  }, []);

  useEffect(() => {
    if (!userProfileStore.isMTAvailable) {
      push(Page.DASHBOARD);
    }
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
            {MTAccountInfo !== null && MTAccountInfo?.length > 0
              ? MTAccountInfo?.map((accMt, index) => (
                  <AccountMTItem
                    key={`${accMt.login}_${index}`}
                    isMT={true}
                    balance={accMt.balance}
                    margin={accMt.margin}
                    depositLink={`${Page.DEPOSIT}?accountId=${accMt.accountId}`}
                    tradeLink={accMt.tradeUrl}
                    label="MT5"
                    image={LogoMT}
                    server={accMt.serverName}
                    login={accMt.login}
                  />
                ))
              : null}

            {MTAccountInfo === null && (
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
            )}
          </>
        )}
      </FlexContainer>
    </BackFlowLayout>
  );
};

export default AccountsMT5;

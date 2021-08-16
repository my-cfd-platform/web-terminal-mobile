import React, { useEffect, useState } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';

import UserIcon from '../assets/svg/profile/icon-user.svg';
import SvgIcon from '../components/SvgIcon';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { useStores } from '../hooks/useStores';
import { Link } from 'react-router-dom';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import Colors from '../constants/Colors';
import { useTranslation } from 'react-i18next';
import Page from '../constants/Pages';

import IconArrowLink from '../assets/svg/profile/icon-arrow-link.svg';
import IconDeposit from '../assets/svg/profile/icon-deposit.svg';
import IconWithdraw from '../assets/svg/profile/icon-withdrawal.svg';
import IconBalanceHistory from '../assets/svg/profile/icon-balance-history.svg';
import IconLogout from '../assets/svg/profile/icon-logout.svg';
import IconAboutUs from '../assets/svg/profile/icon-about.svg';
import IconVerify from '../assets/svg/profile/icon-verify.svg';
import IconPassword from '../assets/svg/profile/icon-account-password.svg';
import { PersonalDataKYCEnum } from '../enums/PersonalDataKYCEnum';
import AchievementStatusLabel from '../components/AchievementStatusLabel';
import { observer, Observer } from 'mobx-react-lite';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import mixapanelProps from '../constants/mixpanelProps';
import useRedirectMiddleware from '../hooks/useRedirectMiddleware';
import { CountriesEnum } from '../enums/CountriesEnum';
import AccProfileCarousel from '../components/AccProfileCarousel/AccProfileCarousel';

const AccountProfile = observer(() => {
  const { mainAppStore, userProfileStore } = useStores();
  const { t } = useTranslation();
  const { redirectWithUpdateRefreshToken } = useRedirectMiddleware();
  const handleLogout = () => {
    mixpanel.track(mixpanelEvents.LOGOUT, {
      [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandProperty,
    });
    mainAppStore.signOut();
  };

  const urlParams = new URLSearchParams();

  const [parsedParams, setParsedParams] = useState('');

  useEffect(() => {
    urlParams.set('token', mainAppStore.token);
    urlParams.set(
      'active_account_id',
      mainAppStore.accounts.find((item) => item.isLive)?.id || ''
    );
    urlParams.set('env', 'web_mob');
    urlParams.set('trader_id', userProfileStore.userProfileId || '');
    urlParams.set('lang', mainAppStore.lang);
    urlParams.set('api', mainAppStore.initModel.tradingUrl);
    urlParams.set('rt', mainAppStore.refreshToken);
    setParsedParams(urlParams.toString());
  }, [mainAppStore.token, mainAppStore.lang, mainAppStore.accounts]);

  return (
    // TODO: Refactor Safari
    <FlexContainer flexDirection="column" minHeight="600px" overflow="auto">
      <AchievementStatusLabel />
      <FlexContainer padding="16px" marginBottom="16px">
        <FlexContainer width="64px">
          <UserPhoto
            alignItems="center"
            justifyContent="center"
            width="48px"
            height="48px"
            borderRadius="50%"
            backgroundColor="#77797D"
            marginRight="16px"
          >
            <SvgIcon
              {...UserIcon}
              fillColor="rgba(196, 196, 196, 0.5)"
              width="26px"
              height="26px"
            />
          </UserPhoto>
        </FlexContainer>

        <FlexContainer
          flexDirection="column"
          justifyContent="center"
          width="calc(100% - 64px)"
        >
          <Observer>
            {() => (
              <>
                <PrimaryTextSpan
                  color="#ffffff"
                  fontSize="16px"
                  fontWeight={500}
                  marginBottom="6px"
                  wordBreak="break-word"
                >
                  {`${
                    userProfileStore.userProfile?.firstName
                      ? userProfileStore.userProfile?.firstName
                      : ''
                  } ${
                    userProfileStore.userProfile?.lastName
                      ? userProfileStore.userProfile?.lastName
                      : ''
                  }`}
                </PrimaryTextSpan>
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="13px"
                  fontWeight={500}
                  textOverflow="ellipsis"
                  overflow="hidden"
                  title={userProfileStore.userProfile?.email}
                >
                  {userProfileStore.userProfile?.email}
                </PrimaryTextSpan>
              </>
            )}
          </Observer>
        </FlexContainer>
      </FlexContainer>

      {userProfileStore.isBonus && <AccProfileCarousel />}

      {!mainAppStore.isPromoAccount &&
        userProfileStore.userProfile?.kyc ===
          PersonalDataKYCEnum.NotVerified && (
          <FlexContainer flexDirection="column" marginBottom="24px">
            <ProfileMenuLink to={Page.ACCOUNT_VERIFICATION}>
              <FlexContainer alignItems="center">
                <FlexContainer
                  width="28px"
                  height="28px"
                  backgroundColor="#00000000"
                  borderRadius="50%"
                  justifyContent="center"
                  alignItems="center"
                  marginRight="14px"
                >
                  <SvgIcon {...IconVerify} fillColor="#ED145B" />
                </FlexContainer>
                <PrimaryTextSpan
                  color="#ffffff"
                  fontSize="16px"
                  fontWeight="normal"
                >
                  {t('Fill in personal details')}
                </PrimaryTextSpan>
              </FlexContainer>
              <SvgIcon
                {...IconArrowLink}
                fillColor="rgba(196, 196, 196, 0.5)"
              />
            </ProfileMenuLink>
          </FlexContainer>
        )}

      {!mainAppStore.isPromoAccount && (
        <FlexContainer flexDirection="column" marginBottom="24px">
          <FlexContainer padding="0 16px" marginBottom="8px">
            <PrimaryTextSpan
              textTransform="uppercase"
              color="rgba(255, 255, 255, 0.4)"
              fontWeight={500}
              fontSize="13px"
            >
              {t('Balance')}
            </PrimaryTextSpan>
          </FlexContainer>

          <ProfileMenuButton
            onClick={() =>
              redirectWithUpdateRefreshToken(API_DEPOSIT_STRING, parsedParams)
            }
          >
            <FlexContainer alignItems="center">
              <FlexContainer
                width="28px"
                height="28px"
                backgroundColor="#77787E"
                borderRadius="50%"
                justifyContent="center"
                alignItems="center"
                marginRight="14px"
              >
                <SvgIcon {...IconDeposit} fillColor="#ffffff" />
              </FlexContainer>
              <PrimaryTextSpan
                color="#ffffff"
                fontSize="16px"
                fontWeight="normal"
              >
                {t('Deposit')}
              </PrimaryTextSpan>
            </FlexContainer>
            <SvgIcon {...IconArrowLink} fillColor="rgba(196, 196, 196, 0.5)" />
          </ProfileMenuButton>

          <ProfileMenuLink to={Page.WITHDRAW_LIST}>
            <FlexContainer alignItems="center">
              <FlexContainer
                width="28px"
                height="28px"
                backgroundColor="#77787E"
                borderRadius="50%"
                justifyContent="center"
                alignItems="center"
                marginRight="14px"
              >
                <SvgIcon {...IconWithdraw} fillColor="#ffffff" />
              </FlexContainer>
              <PrimaryTextSpan
                color="#ffffff"
                fontSize="16px"
                fontWeight="normal"
              >
                {t('Withdraw')}
              </PrimaryTextSpan>
            </FlexContainer>
            <SvgIcon {...IconArrowLink} fillColor="rgba(196, 196, 196, 0.5)" />
          </ProfileMenuLink>

          <ProfileMenuLink to={Page.ACCOUNT_BALANCE_HISTORY}>
            <FlexContainer alignItems="center">
              <FlexContainer
                width="28px"
                height="28px"
                backgroundColor="#77787E"
                borderRadius="50%"
                justifyContent="center"
                alignItems="center"
                marginRight="14px"
              >
                <SvgIcon {...IconBalanceHistory} fillColor="#ffffff" />
              </FlexContainer>
              <PrimaryTextSpan
                color="#ffffff"
                fontSize="16px"
                fontWeight="normal"
              >
                {t('Balance history')}
              </PrimaryTextSpan>
            </FlexContainer>
            <SvgIcon {...IconArrowLink} fillColor="rgba(196, 196, 196, 0.5)" />
          </ProfileMenuLink>
        </FlexContainer>
      )}

      <FlexContainer
        flexDirection="column"
        marginBottom="36px"
        backgroundColor="rgb(28, 31, 38)"
      >
        <FlexContainer padding="0 16px" marginBottom="8px">
          <PrimaryTextSpan
            textTransform="uppercase"
            color="rgba(255, 255, 255, 0.4)"
            fontWeight={500}
            fontSize="13px"
          >
            {t('Settings')}
          </PrimaryTextSpan>
        </FlexContainer>

        <ProfileMenuLink to={Page.ACCOUNT_CHANGE_PASSWORD}>
          <FlexContainer alignItems="center">
            <FlexContainer
              width="28px"
              height="28px"
              backgroundColor="#77787E"
              borderRadius="50%"
              justifyContent="center"
              alignItems="center"
              marginRight="14px"
            >
              <SvgIcon {...IconPassword} fillColor="#ffffff" />
            </FlexContainer>
            <PrimaryTextSpan
              color="#ffffff"
              fontSize="16px"
              fontWeight="normal"
            >
              {t('Change password')}
            </PrimaryTextSpan>
          </FlexContainer>
          <SvgIcon {...IconArrowLink} fillColor="rgba(196, 196, 196, 0.5)" />
        </ProfileMenuLink>

        <ProfileMenuLink to={Page.ACCOUNT_CHANGE_LANGUAGE}>
          <FlexContainer alignItems="center">
            <FlexContainer
              width="28px"
              height="28px"
              backgroundColor="#77787E"
              borderRadius="50%"
              justifyContent="center"
              alignItems="center"
              marginRight="14px"
            >
              <PrimaryTextSpan
                color="#ffffff"
                fontSize="9px"
                fontWeight="normal"
              >
                {mainAppStore.lang?.substr(0, 2).toUpperCase() ||
                  CountriesEnum.EN.substr(0, 2).toUpperCase()}
              </PrimaryTextSpan>
            </FlexContainer>
            <PrimaryTextSpan
              color="#ffffff"
              fontSize="16px"
              fontWeight="normal"
            >
              {t('Language')}
            </PrimaryTextSpan>
          </FlexContainer>
          <SvgIcon {...IconArrowLink} fillColor="rgba(196, 196, 196, 0.5)" />
        </ProfileMenuLink>

        {!mainAppStore.isPromoAccount && (
          <>
            <ProfileMenuLink to={Page.ACCOUNT_ABOUT_US}>
              <FlexContainer alignItems="center">
                <FlexContainer
                  width="28px"
                  height="28px"
                  backgroundColor="#77787E"
                  borderRadius="50%"
                  justifyContent="center"
                  alignItems="center"
                  marginRight="14px"
                >
                  <SvgIcon {...IconAboutUs} fillColor="#ffffff" />
                </FlexContainer>
                <PrimaryTextSpan
                  color="#ffffff"
                  fontSize="16px"
                  fontWeight="normal"
                >
                  {t('About us')}
                </PrimaryTextSpan>
              </FlexContainer>
              <SvgIcon
                {...IconArrowLink}
                fillColor="rgba(196, 196, 196, 0.5)"
              />
            </ProfileMenuLink>

            <ProfileMenuLink to={Page.BONUS_FAQ}>
              <FlexContainer alignItems="center">
                <FlexContainer
                  width="28px"
                  height="28px"
                  backgroundColor="#77787E"
                  borderRadius="50%"
                  justifyContent="center"
                  alignItems="center"
                  marginRight="14px"
                >
                  <SvgIcon {...IconAboutUs} fillColor="#ffffff" />
                </FlexContainer>
                <PrimaryTextSpan
                  color="#ffffff"
                  fontSize="16px"
                  fontWeight="normal"
                >
                  {t('Bonus FAQ')}
                </PrimaryTextSpan>
              </FlexContainer>
              <SvgIcon
                {...IconArrowLink}
                fillColor="rgba(196, 196, 196, 0.5)"
              />
            </ProfileMenuLink>
          </>
        )}

        <ProfileMenuButton onClick={handleLogout}>
          <FlexContainer alignItems="center">
            <FlexContainer
              width="28px"
              height="28px"
              backgroundColor={Colors.RED}
              borderRadius="50%"
              justifyContent="center"
              alignItems="center"
              marginRight="14px"
            >
              <SvgIcon {...IconLogout} fillColor="#ffffff" />
            </FlexContainer>
            <PrimaryTextSpan
              color={Colors.RED}
              fontSize="16px"
              fontWeight="normal"
            >
              {t('Log Out')}
            </PrimaryTextSpan>
          </FlexContainer>
          <SvgIcon {...IconArrowLink} fillColor="rgba(196, 196, 196, 0.5)" />
        </ProfileMenuButton>
      </FlexContainer>
    </FlexContainer>
  );
});

export default AccountProfile;

const UserPhoto = styled(FlexContainer)``;

const ProfileMenuLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 8px 16px;
  text-decoration: none;
  background-color: rgba(42, 45, 56, 0.5);
  margin-bottom: 1px;
  &:hover {
    text-decoration: none;
  }
`;

const ProfileMenuA = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 8px 16px;
  text-decoration: none;
  background-color: rgba(42, 45, 56, 0.5);
  margin-bottom: 1px;
  &:hover {
    text-decoration: none;
  }
`;

const ProfileMenuButton = styled(ButtonWithoutStyles)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 8px 16px;
  text-decoration: none;
  background-color: rgba(42, 45, 56, 0.5);
  margin-bottom: 1px;
  &:hover {
    text-decoration: none;
  }
`;

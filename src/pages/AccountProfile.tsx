import React, { useEffect, useState } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';

import UserIcon from '../assets/svg/profile/icon-user.svg';
import SvgIcon from '../components/SvgIcon';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { useStores } from '../hooks/useStores';
import API from '../helpers/API';
import { getProcessId } from '../helpers/getProcessId';
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
import { PersonalDataKYCEnum } from '../enums/PersonalDataKYCEnum';
import AchievementStatusLabel from '../components/AchievementStatusLabel';

const AccountProfile = () => {
  const { mainAppStore, userProfileStore } = useStores();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleLogout = () => mainAppStore.signOut();

  useEffect(() => {
    async function fetchPersonalData() {
      try {
        const response = await API.getPersonalData(
          getProcessId(),
          mainAppStore.initModel.authUrl
        );
        setEmail(response.data.email || '');
        setName(
          `${response.data.firstName || ''} ${response.data.lastName || ''}`
        );
      } catch (error) {}
    }
    fetchPersonalData();
  }, []);

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
    setParsedParams(urlParams.toString());
  }, [mainAppStore.token, mainAppStore.lang, mainAppStore.accounts]);

  return (
    <FlexContainer flexDirection="column">
      <AchievementStatusLabel />
      <FlexContainer padding="16px" marginBottom="24px">
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

        <FlexContainer flexDirection="column" justifyContent="center">
          <PrimaryTextSpan
            color="#ffffff"
            fontSize="16px"
            fontWeight={500}
            marginBottom="6px"
          >
            {name}
          </PrimaryTextSpan>
          <PrimaryTextSpan
            color="rgba(255, 255, 255, 0.4)"
            fontSize="13px"
            fontWeight={500}
          >
            {email}
          </PrimaryTextSpan>
        </FlexContainer>
      </FlexContainer>

      {userProfileStore.userProfile?.kyc ===
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
              <SvgIcon
                {...IconArrowLink}
                fillColor="rgba(196, 196, 196, 0.5)"
              />
            </FlexContainer>
          </ProfileMenuLink>
        </FlexContainer>
      )}

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

        <ProfileMenuA href={`${API_DEPOSIT_STRING}/?${parsedParams}`}>
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
        </ProfileMenuA>

        <ProfileMenuLink to={Page.ACCOUNT_WITHDRAW_NEW}>
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
              {t('Balance History')}
            </PrimaryTextSpan>
          </FlexContainer>
          <SvgIcon {...IconArrowLink} fillColor="rgba(196, 196, 196, 0.5)" />
        </ProfileMenuLink>
      </FlexContainer>

      <FlexContainer flexDirection="column" marginBottom="24px">
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
                {mainAppStore.lang.substr(0, 2).toUpperCase()}
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
          <SvgIcon {...IconArrowLink} fillColor="rgba(196, 196, 196, 0.5)" />
        </ProfileMenuLink>

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
};

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

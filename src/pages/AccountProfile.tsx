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

import IconArrowLink from '../assets/svg/profile/icon-arrow-link.svg';
import IconDeposit from '../assets/svg/profile/icon-deposit.svg';
import IconWithdraw from '../assets/svg/profile/icon-withdrawal.svg';
import IconBalanceHistory from '../assets/svg/profile/icon-balance-history.svg';
import IconLogout from '../assets/svg/profile/icon-logout.svg';
import { useTranslation } from 'react-i18next';
import Page from '../constants/Pages';


const AccountProfile = () => {
  const { mainAppStore } = useStores();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleLogout = () => mainAppStore.signOut();

  useEffect(() => {
    async function fetchPersonalData() {
      try {
        const response = await API.getPersonalData(getProcessId());
        setEmail(response.data.email || '');
        setName(
          `${response.data.firstName || ''} ${response.data.lastName || ''}`
        );
      } catch (error) {}
    }
    fetchPersonalData();
  }, []);

  return (
    <FlexContainer flexDirection="column">
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

        <ProfileMenuLink to={Page.DEPOSIT}>
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
        </ProfileMenuLink>

        <ProfileMenuLink to={Page.ACCOUNT_WITHDRAW}>
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

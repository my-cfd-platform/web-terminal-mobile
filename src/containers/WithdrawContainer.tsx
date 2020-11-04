import React, { FC, useEffect } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import BackFlowLayout from '../components/BackFlowLayout';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { NavLink, useRouteMatch } from 'react-router-dom';
import Colors from '../constants/Colors';
import Page from '../constants/Pages';
import { useStores } from '../hooks/useStores';
import { PersonalDataKYCEnum } from '../enums/PersonalDataKYCEnum';

import FailImage from '../assets/images/fail.png';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import mixapanelProps from '../constants/mixpanelProps';
import { observer } from 'mobx-react-lite';
import LoaderForComponents from '../components/LoaderForComponents';

const WithdrawContainer: FC = observer(({ children }) => {
  const { t } = useTranslation();

  const { mainAppStore, userProfileStore, withdrawalStore } = useStores();

  useEffect(() => {
    mixpanel.track(mixpanelEvents.WITHDRAW_VIEW, {
      [mixapanelProps.AVAILABLE_BALANCE]:
        mainAppStore.accounts.find((item) => item.isLive)?.balance || 0,
    });
  }, []);

  const match = useRouteMatch([Page.WITHDRAW_LIST, Page.WITHDRAW_HISTORY]);

  return (
    <BackFlowLayout pageTitle={t('Withdrawal')}>
      {![
        PersonalDataKYCEnum.OnVerification,
        PersonalDataKYCEnum.Restricted,
        PersonalDataKYCEnum.Verified,
      ].includes(
        userProfileStore.userProfile?.kyc || PersonalDataKYCEnum.NotVerified
      ) ? (
        <FlexContainer
          width="100%"
          height="100%"
          flexDirection="column"
          justifyContent="space-between"
        >
          <FlexContainer
            flexDirection="column"
            alignItems="center"
            padding="50px 0 0"
            height="calc(100% - 96px)"
          >
            <FlexContainer
              justifyContent={'center'}
              alignItems={'center'}
              marginBottom="40px"
            >
              <img src={FailImage} width={138} />
            </FlexContainer>
            <FailText>{t('Verification Required')}</FailText>
            <FailDescription>
              {t('Something went wrong.')}
              <br />
              {t(
                'Withdrawal request can only be submitted when all of KYC documents have been approved and  the account is Fully Verified'
              )}
            </FailDescription>
          </FlexContainer>
          <FlexContainer padding="16px" width="100%">
            <OtherMethodsButton href={Page.ACCOUNT_VERIFICATION}>
              {t('Proceed to Verification')}
            </OtherMethodsButton>
          </FlexContainer>
        </FlexContainer>
      ) : (
        <FlexContainer
          width="100%"
          height="100%"
          flexDirection="column"
          alignItems="center"
        >
          {match?.isExact && (
            <NavWrap>
              <CustomNavLink to={Page.WITHDRAW_LIST} activeClassName="selected">
                {t('New Request')}
              </CustomNavLink>
              <CustomNavLink
                to={Page.WITHDRAW_HISTORY}
                activeClassName="selected"
              >
                {t('History')}
              </CustomNavLink>
            </NavWrap>
          )}
          <LoaderForComponents isLoading={withdrawalStore.loading} />
          {children}
        </FlexContainer>
      )}
    </BackFlowLayout>
  );
});

export default WithdrawContainer;

const NavWrap = styled(FlexContainer)`
  margin-bottom: 30px;
  width: calc(100% - 32px);
  background-color: ${Colors.INPUT_BG};
  height: 32px;
  justify-content: center;
  border-radius: 8px;
  padding: 2px;
  overflow: hidden;
`;

const CustomNavLink = styled(NavLink)`
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: ${Colors.INPUT_LABEL_TEXT};
  font-size: 12px;
  font-weight: 500;
  transition: all 0.4s ease;
  &:hover {
    text-decoration: none;
    color: ${Colors.ACCENT};
  }

  &.selected {
    color: ${Colors.ACCENT};
    background-color: #494c53;
    border-radius: 8px;
  }
`;

const OtherMethodsButton = styled.a`
  background-color: #00ffdd;
  border-radius: 10px;
  width: 100%;
  padding: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #252636;
  text-align: center;
`;

const FailText = styled.span`
  font-weight: 500;
  font-size: 18px;
  line-height: 18px;
  text-align: center;
  color: #ffffff;
  margin-bottom: 18px;
`;

const FailDescription = styled.span`
  font-size: 13px;
  line-height: 16px;
  text-align: center;
  width: 300px;
  color: rgba(255, 255, 255, 0.4);
`;

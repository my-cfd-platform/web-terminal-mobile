import styled from '@emotion/styled';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Colors from '../../constants/Colors';
import Page from '../../constants/Pages';
import { useStores } from '../../hooks/useStores';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import SuccessImage from '../../assets/images/success.png';
import WithdrawContainer from '../../containers/WithdrawContainer';

const WithdrawSuccessRequest = () => {
  const { t } = useTranslation();

  const { userProfileStore } = useStores();

  return (
    <WithdrawContainer backBtn={Page.WITHDRAW_LIST}>
      <FlexContainer
        flexDirection="column"
        height="100%"
        width="100%"
        justifyContent="space-between"
      >
        <FlexContainer flexDirection="column">
          <FlexContainer
            flexDirection="column"
            width="100%"
            marginBottom="12px"
            padding="40px 0 0 0"
          >
            <FlexContainer
              justifyContent={'center'}
              alignItems={'center'}
              marginBottom="40px"
            >
              <img src={SuccessImage} width={138} />
            </FlexContainer>

            <FlexContainer
              alignItems="center"
              justifyContent="center"
              padding="16px"
            >
              <PrimaryTextSpan color="#ffffff" textAlign="center">
                {t('Our Customer support will contact you via')} &nbsp;
                <PrimaryTextSpan color="#FFFCCC">
                  {userProfileStore.userProfile?.email || 'your@email.com'}
                </PrimaryTextSpan>
                <br />
                {t('to confirm and proceed with your withdrawal request.')}
                <br />
                {t(
                  'Please be note, that you can submit only one withdrawal request at a time'
                )}
              </PrimaryTextSpan>
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer padding="16px" width="100%">
          <CustomLink to={Page.WITHDRAW_HISTORY}>{t('Next')}</CustomLink>
        </FlexContainer>
      </FlexContainer>
    </WithdrawContainer>
  );
};

export default WithdrawSuccessRequest;

const CustomLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  background-color: transparent;
  padding: 0;
  line-height: 100%;
  font-weight: 600;

  color: #000000;
  text-decoration: none;

  &:hover,
  &:focus {
    outline: none;
    cursor: pointer;
    color: #000000;
    text-decoration: none;
  }

  &:disabled {
    pointer-events: none;
  }

  padding: '4px 8px';
  width: 100%;
  height: 56px;
  background-color: ${Colors.ACCENT_BLUE};
  border-radius: 12px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #9ffff2;
  }

  &:focus {
    background-color: #21b3a4;
  }

  &:disabled {
    background-color: ${Colors.DISSABLED};
  }
`;

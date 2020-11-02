import { css } from '@emotion/core';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Colors from '../../constants/Colors';
import Page from '../../constants/Pages';
import API from '../../helpers/API';
import { getProcessId } from '../../helpers/getProcessId';
import { useStores } from '../../hooks/useStores';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import SuccessImage from '../../assets/images/success.png';

const WithdrawSuccessRequest = () => {
  const { t } = useTranslation();

  const { mainAppStore, withdrawalStore } = useStores();
  const [userEmail, setEmail] = useState('');

  useEffect(() => {
    async function fetchPersonalData() {
      try {
        const response = await API.getPersonalData(
          getProcessId(),
          mainAppStore.initModel.authUrl
        );
        setEmail(response.data.email);
      } catch (error) {}
    }
    fetchPersonalData();
  }, []);

  return (
    <FlexContainer
      flexDirection="column"
      height="100%"
      width="100%"
      justifyContent="space-between"
    >
      <FlexContainer flexDirection="column">
        <FlexContainer flexDirection="column" width="100%" marginBottom="12px" padding="40px 0 0 0">
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
                {userEmail || 'your@email.com'}
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
        <CustomLink to={Page.ACCOUNT_WITHDRAW_HISTORY}>{t('Next')}</CustomLink>
      </FlexContainer>
    </FlexContainer>
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

  &:hover,
  &:focus {
    outline: none;
    cursor: pointer;
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

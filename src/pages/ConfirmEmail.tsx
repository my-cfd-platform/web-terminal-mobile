import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import { FlexContainer } from '../styles/FlexContainer';
import API from '../helpers/API';
import LoaderFullscreen from '../components/LoaderFullscreen';
import { PrimaryTextParagraph, PrimaryTextSpan } from '../styles/TextsElements';
import Page from '../constants/Pages';
import styled from '@emotion/styled';

const ConfirmEmail = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccessful, setIsSuccessfull] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    API.confirmEmail(id || '')
      .then((response) => {
        if (response.result === OperationApiResponseCodes.Ok) {
          setIsSuccessfull(true);
        }
        if (response.result === OperationApiResponseCodes.Expired) {
          setIsSuccessfull(false);
        }
      })
      .catch(error => {
        setIsSuccessfull(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  
  return (
    <FlexContainer flexDirection="column" width="100%" alignItems="center" justifyContent="center" padding="16px">
<LoaderFullscreen isLoading={isLoading} />
      <FlexContainer width="100%" flexDirection="column" alignItems="center">
        {isSuccessful ? (
          <>
            <PrimaryTextParagraph
              color="#fffccc"
              fontSize="24px"
              fontWeight="bold"
              marginBottom="24px"
            >
              {t('Thank you!')}
            </PrimaryTextParagraph>
            <PrimaryTextParagraph color="#fffccc" marginBottom="24px" textAlign="center">
              {t('You have successfully verified your email.')}
            </PrimaryTextParagraph>
          </>
        ) : (
          <>
            <PrimaryTextParagraph
              color="#fffccc"
              fontSize="24px"
              fontWeight="bold"
              marginBottom="24px"
            >
              {t('Email verification failed')}
            </PrimaryTextParagraph>
            <PrimaryTextParagraph color="#fffccc" marginBottom="24px" textAlign="center">
              {t(
                'This link has been expired. Please log in to request a new verification email.'
              )}
            </PrimaryTextParagraph>
          </>
        )}
        <LinkToDashboard to={Page.DASHBOARD}>
          <PrimaryTextSpan color="#003a38" fontWeight="bold">
            {t('Go to Platform')}
          </PrimaryTextSpan>
        </LinkToDashboard>
      </FlexContainer>
    </FlexContainer>
  );
};

export default ConfirmEmail;


const LinkToDashboard = styled(Link)`
  border-radius: 4px;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease;
  will-change: background-color;
  background-color: #00ffdd;
  box-shadow: 0px 4px 8px rgba(0, 255, 242, 0.17),
    inset 0px -3px 6px rgba(0, 255, 242, 0.26);

  &:hover {
    background-color: #9ffff2;
    text-decoration: none;
  }

  &:focus {
    background-color: #21b3a4;
  }

  &:disabled {
    background-color: rgba(255, 255, 255, 0.04);
  }
`;

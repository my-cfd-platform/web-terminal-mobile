import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';

import Icon from '../assets/images/404-image.png';
import styled from '@emotion/styled';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '../styles/Buttons';
import { useHistory } from 'react-router';
import Page from '../constants/Pages';

const PageNotFound = () => {
  const {t} = useTranslation();
  const { push } = useHistory();

  const handleClick = () => () => {
    push(Page.DASHBOARD);
  }
  return (
    <FlexContainer flexDirection="column" width="100%" flex="1" justifyContent="center" alignItems="center" padding="16px">
      <Image src={Icon} />

      <PrimaryTextSpan color="#ffffff" fontWeight={700} fontSize="24px" marginBottom="32px">
        {t("Oops.. page not found")}
      </PrimaryTextSpan>

      <PrimaryButton onClick={handleClick()} width="100%">
        <PrimaryTextSpan color="#1C1F26" fontSize="16px" fontWeight={700}>
          {t("Go Home")}
        </PrimaryTextSpan>
      </PrimaryButton>
    </FlexContainer>
  );
};

export default PageNotFound;

const Image = styled.img`
  width: 230px;
  height: auto;
  max-width: 100%;
  margin-bottom: 64px;
`;

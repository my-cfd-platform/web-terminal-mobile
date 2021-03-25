import styled from '@emotion/styled';
import React from 'react';
import { Link } from 'react-router-dom';
import { useStores } from '../../hooks/useStores';
import { FlexContainer } from '../../styles/FlexContainer';

import FaqIcon from '../../assets/images/icon-faq.png';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { useTranslation } from 'react-i18next';
import { brandingLinksTranslate } from '../../constants/brandingLinksTranslate';
import { observer } from 'mobx-react-lite';

const WithdrawalFaqLink = () => {
  const { t } = useTranslation();
  const { mainAppStore } = useStores();
  return (
    <FaqLink
      
      to={{
        pathname: t(
          `${
            brandingLinksTranslate[mainAppStore.initModel.brandProperty].faq
          }`
        )
      }}
      target="_blank"
    >
      <FlexContainer width="100%" alignItems="center">
        <FaqImg src={FaqIcon} />
        <FlexContainer flexDirection="column" padding="0 0 0 16px">
          <PrimaryTextSpan textTransform="uppercase">
            {t('FAQ')}
          </PrimaryTextSpan>
          <PrimaryTextSpan color="#ffffff" lineHeight="1.8">
            {t('Frequently Asked Questions')}
          </PrimaryTextSpan>
        </FlexContainer>
      </FlexContainer>
    </FaqLink>
  );
};

export default WithdrawalFaqLink;

const FaqLink = styled(Link)`
  margin: 16px;
  padding: 16px;
  background: rgba(41, 44, 51, 0.5);
  border: 1px solid rgba(112, 113, 117, 0.5);
  box-sizing: border-box;
  border-radius: 5px;
`;

const FaqImg = styled.img``;

import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import NoNews from '../assets/images/no-news.png';
import { FULL_VH } from '../constants/global';

const News = () => {
  const { t } = useTranslation();

  return (
    <FlexContainer flexDirection="column" minHeight={`calc(${FULL_VH} - 228px)`} padding="20px 0 0 0">
      <FlexContainer
        padding="0 16px"
        alignItems="center"
        justifyContent="space-between"
        position="relative"
        width="100%"
        marginBottom="128px"
      >
        <PrimaryTextSpan color="#ffffff" fontWeight={600} fontSize="24px">
          {t('News')}
        </PrimaryTextSpan>
      </FlexContainer>
      <FlexContainer width="100%" flexDirection="column" alignItems="center">
        <ImageElem src={NoNews} width={184} />
        <PrimaryTextSpan
          fontSize="18px"
          color="#fff"
          fontWeight="bold"
          marginBottom="8px"
        >
          {t('No News yet')}
        </PrimaryTextSpan>
        <PrimaryTextSpan fontSize="13px" color="rgba(196, 196, 196, 0.5)" textAlign="center">
          {t('No News yet')}, {t('soon there will be the latest news')}
        </PrimaryTextSpan>
      </FlexContainer>
    </FlexContainer>
  );
};

export default News;

const ImageElem = styled.img`
  display: block;
  object-fit: contain;
  margin-bottom: 22px;
`;

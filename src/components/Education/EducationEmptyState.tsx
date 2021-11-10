import styled from '@emotion/styled';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import NoNews from '../../assets/images/no-news.png';

const EducationEmptyState = () => {
  const { t } = useTranslation();

  return (
    <FlexContainer flex="1" justifyContent="center" alignItems="center">
      <FlexContainer width="100%" flexDirection="column" alignItems="center">
      <ImageElem src={NoNews} width={184} />
      <PrimaryTextSpan
        fontSize="18px"
        color="#fff"
        fontWeight="bold"
        marginBottom="8px"
      >
        {t('No Education yet')}
      </PrimaryTextSpan>
      <FlexContainer width="248px" maxWidth="100%">
        <PrimaryTextSpan
          fontSize="13px"
          color="rgba(196, 196, 196, 0.5)"
          textAlign="center"
        >
          {t('No Education yet')}.{' '}
          {t('Soon there will be the latest educations.')}
        </PrimaryTextSpan>
      </FlexContainer>
    </FlexContainer>
    </FlexContainer>
  );
};

export default EducationEmptyState;

const ImageElem = styled.img`
  display: block;
  object-fit: contain;
  margin-bottom: 22px;
`;

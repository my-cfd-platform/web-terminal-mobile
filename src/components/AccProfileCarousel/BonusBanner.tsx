import styled from '@emotion/styled';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks/useStores';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';

const BonusBanner = () => {
  const { t } = useTranslation();

  const { userProfileStore } = useStores();

  const handleShowBonusPopup = () => () => userProfileStore.showBonusPopup();

  return (
    <BannerBtn onClick={handleShowBonusPopup()}>
      <FlexContainer
        backgroundColor="#23262F"
        border="1px solid rgba(255, 255, 255, 0.12)"
        boxShadow="0px 12px 72px rgba(0, 0, 0, 0.24)"
        borderRadius="4px"
        height="86px"
        width="100%"
        alignItems="center"
      >
        <FlexContainer
          padding="16px"
          justifyContent="center"
          alignItems="center"
          backgroundColor="#00FFDD"
          borderRadius="4px"
          height="100%"
        >
          <PrimaryTextSpan fontSize="24px" color="#1C1F26" fontWeight="bold">
            +30%
          </PrimaryTextSpan>
        </FlexContainer>

        <FlexContainer
          flexDirection="column"
          padding="8px 16px"
          justifyContent="flex-start"
        >
          <PrimaryTextSpan
            color="#ffffff"
            fontSize="18px"
            fontWeight="bold"
            lineHeight="21px"
            marginBottom="4px"
            textAlign="left"
          >
            {t('Get bonus')}
          </PrimaryTextSpan>
          <PrimaryTextSpan
            color="rgba(255, 255, 255, 0.4)"
            fontSize="14px"
            lineHeight="17px"
            textAlign="left"
          >
            Only 2 days 19 hours left
          </PrimaryTextSpan>
        </FlexContainer>
      </FlexContainer>
    </BannerBtn>
  );
};

export default BonusBanner;

const BannerBtn = styled(ButtonWithoutStyles)`
  width: 100%;
  transition: all 0.4s easy;

  &:active {
    transform: scale(0.95);
  }
`;

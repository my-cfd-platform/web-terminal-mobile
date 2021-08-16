import styled from '@emotion/styled';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Page from '../../constants/Pages';
import { useStores } from '../../hooks/useStores';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import BannerBG from "../../assets/images/onboarding-banner-bg.png";

const OnBoardingBanner = () => {
  const { t } = useTranslation();
  const { push } = useHistory()
  const { userProfileStore } = useStores();

  const handleShowBonusPopup = () => () => push(Page.ONBOARDING);

  return (
    <BannerBtn onClick={handleShowBonusPopup()}>
      <BannerWrap
        border="1px solid rgba(255, 255, 255, 0.12)"
        boxShadow="0px 12px 72px rgba(0, 0, 0, 0.24)"
        borderRadius="4px"
        height="86px"
        width="100%"
        alignItems="center"
      >
        <FlexContainer
          flexDirection="column"
          padding="8px 16px 8px 89px"
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
            {t('Onboarding guide')}
          </PrimaryTextSpan>
          <PrimaryTextSpan
            color="rgba(255, 255, 255, 0.4)"
            fontSize="14px"
            lineHeight="17px"
            textAlign="left"
          >
            {t('Learn how to start trading')}
          </PrimaryTextSpan>
        </FlexContainer>
      </BannerWrap>
    </BannerBtn>
  );
};

export default OnBoardingBanner;

const BannerWrap = styled(FlexContainer)`
  background-color: #23262F;
  background-image: ${`url(${BannerBG})`};
  background-position: top left;
  background-repeat: no-repeat;
`;
const BannerBtn = styled(ButtonWithoutStyles)`
  width: 100%;
  transition: all 0.4s easy;

  &:active {
    transform: scale(0.95);
  }
`;

import styled from '@emotion/styled';
import React from 'react';
import { composeInitialProps, useTranslation } from 'react-i18next';
import Lottie from 'react-lottie';
import { Link } from 'react-router-dom';
import Page from '../constants/Pages';
import PopupContainer from '../containers/PopupContainer';
import { PrimaryButton } from '../styles/Buttons';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextParagraph, PrimaryTextSpan } from '../styles/TextsElements';

import BonusGift from '../assets/images/bonus-gift.png';
import * as animationData from '../assets/lotties/confettie-animation.json';
import { useStores } from '../hooks/useStores';
import EventBonusTimer from './EventBonusTimer';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { FULL_VH } from '../constants/global';

interface Props {
  handleDeposit: (useBonus: boolean) => void;
}
const BonusPopup: FC<Props> = observer(({ handleDeposit }) => {
  const { t } = useTranslation();
  const { userProfileStore } = useStores();

  const getLottieOptions = () => {
    return {
      loop: true,
      autoplay: true,
      pause: false,
      animationData: animationData.default,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
        clearCanvas: false,
      },
    };
  };

  const handleCloseBonusPopup = () => () => userProfileStore.hideBonusPopup();

  const handleClickOpenDeposit = (useBonus: boolean) => () => {
    handleDeposit(useBonus);
  };

  return (
    <PopupContainer title={t('Bonus')} onClose={handleCloseBonusPopup()}>
      <FlexContainer
        flexDirection="column"
        maxHeight={`calc(${FULL_VH} - 179px)`}
        flex="1"
        width="100%"
        justifyContent="space-between"
        padding="16px"
        overflow="auto"
      >
        <FlexContainer
          position="relative"
          flexDirection="column"
          alignItems="center"
        >
          <FlexContainer
            flexDirection="column"
            alignItems="center"
            zIndex="1"
            padding="30px 0 0 0"
          >
            <PrimaryTextSpan
              color="#00FFDD"
              fontSize="22px"
              fontWeight="bold"
              textAlign="center"
            >
              {`${t('Get')} ${userProfileStore.bonusPercent}% ${t('bonus')}`}
            </PrimaryTextSpan>

            <Image src={BonusGift} alt="bonus gift" />
          </FlexContainer>

          <FlexContainer position="absolute" top="0" zIndex="0">
            <Lottie
              options={getLottieOptions()}
              height={`calc(100vw - 32px)`}
              width={`calc(100vw - 32px)`}
              isClickToPauseDisabled={true}
            />
          </FlexContainer>
        </FlexContainer>

        <FlexContainer flexDirection="column">
          <PrimaryTextParagraph
            color="#FFFCCC"
            fontSize="16px"
            textAlign="center"
            marginBottom="20px"
          >
            <EventBonusTimer />
          </PrimaryTextParagraph>

          <PrimaryTextParagraph
            color="rgba(255, 255, 255, 0.64)"
            fontSize="16px"
            textAlign="center"
            lineHeight="1.4"
            marginBottom="20px"
          >
            {t('The deposit added to your account as a gift.')}
            <br />
            {t('All profits made are yours to keep.')}
            <br />
            {t('All details about')}&nbsp;
            <TextLink onClick={handleCloseBonusPopup()} to={Page.BONUS_FAQ}>
              {t('Bonus Rules')}
            </TextLink>
            .
          </PrimaryTextParagraph>
        </FlexContainer>
      </FlexContainer>

      <FlexContainer
        flexDirection="column"
        width="calc(100% - 32px)"
        position="absolute"
        bottom="0"
        left="16px"
        right="16px"
        zIndex="1"
        padding="16px 0"
        backgroundColor="#1C1F26"
      >
        {/*  */}
        <FlexContainer marginBottom="20px">
          <PrimaryButton width="100%" onClick={handleClickOpenDeposit(true)}>
            <PrimaryTextSpan
              fontSize="16px"
              color="#1C1F26"
              fontWeight="bold"
              textTransform="capitalize"
            >
              {t('Get bonus')}
            </PrimaryTextSpan>
          </PrimaryButton>
        </FlexContainer>
        {/*  */}
        <FlexContainer marginBottom="4px" width="100%" justifyContent="center">
          <ButtonWithoutStyles onClick={handleClickOpenDeposit(false)}>
            <PrimaryTextSpan fontSize="16px" color="#ffffff" fontWeight={500}>
              {t('Skip bonus')}
            </PrimaryTextSpan>
          </ButtonWithoutStyles>
        </FlexContainer>
        {/*  */}
      </FlexContainer>
    </PopupContainer>
  );
});

export default BonusPopup;

const TextLink = styled(Link)`
  color: #fffccc;
  font-size: 16px;
  text-decoration: underline;
`;

const Image = styled.img`
  width: 200px;
  height: 200px;
`;

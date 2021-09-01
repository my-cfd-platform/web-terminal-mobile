import React, { FC, useEffect } from 'react';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { FlexContainer } from '../../styles/FlexContainer';
import { useHistory } from 'react-router-dom';
import Pages from '../../constants/Pages';
import { useTranslation } from 'react-i18next';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../../constants/mixpanelEvents';
import Lottie from 'react-lottie';

import * as confettie from '../../assets/lotties/confettie-animation.json';
import * as SuccessImage from '../../assets/lotties/success-icon.json';
import { TradeButton } from '../../styles/Buttons';
interface Props {
  amount: number;
  currencySymbol?: string;
}

const DepositPaymentSuccess: FC<Props> = (props) => {
  const { amount, currencySymbol } = props;
  const { push } = useHistory();
  const { t } = useTranslation();

  const getLottieIconOptions = () => {
    return {
      loop: false,

      autoplay: true,
      pause: false,
      animationData: SuccessImage.default,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
        clearCanvas: false,
      },
    };
  };

  const getLottieConfettieOptions = () => {
    return {
      loop: true,
      autoplay: true,
      pause: false,
      animationData: confettie.default,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
        clearCanvas: false,
      },
    };
  };
  useEffect(() => {
    mixpanel.track(mixpanelEvents.DEPOSIT_PAGE_SUCCESS);
  }, []);

  return (
    <>
      <FlexContainer flexDirection="column" alignItems="center">
        <FlexContainer
          justifyContent={'center'}
          alignItems={'center'}
          marginBottom="40px"
          height="138px"
          width="100%"
        >
          <FlexContainer width="100%" position="relative" zIndex="2">
            <FlexContainer
              width="100%"
              position="absolute"
              zIndex="0"
              top="-53%"
              left="0"
              bottom="0"
            >
              <Lottie
                options={getLottieConfettieOptions()}
                height={`calc(100vw - 32px)`}
                width={`calc(100vw - 32px)`}
                isClickToPauseDisabled={true}
              />
            </FlexContainer>
            <Lottie
              options={getLottieIconOptions()}
              height="136px"
              width="136px"
              isClickToPauseDisabled={true}
            />
          </FlexContainer>
        </FlexContainer>
        <SuccessText>{t('Success')}</SuccessText>
        <SuccessDescription>
          {t('The operation was succesful.')}
        </SuccessDescription>
      </FlexContainer>
      <FlexContainer padding="0 16px" width="100%">
        <TradeButton
          onClick={() => {
            push(Pages.DASHBOARD);
          }}
        >
          {t('Trade now')}
        </TradeButton>
      </FlexContainer>
    </>
  );
};

export default DepositPaymentSuccess;


const SuccessText = styled.span`
  font-weight: 500;
  font-size: 18px;
  line-height: 18px;
  text-align: center;
  color: #ffffff;
  margin-bottom: 18px;
`;

const AmountText = styled.span`
  font-size: 13px;
  line-height: 16px;
  color: #00ffdd;
`;

const SuccessDescription = styled.span`
  font-size: 13px;
  line-height: 16px;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 112px;
`;

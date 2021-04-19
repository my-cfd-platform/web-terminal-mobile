import React, {useCallback, useState} from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import BackFlowLayout from '../components/BackFlowLayout';
import Colors from '../constants/Colors';
import { PrimaryButton } from '../styles/Buttons';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import * as firstStep from '../assets/lotties/stepOne.json';
import Lottie from 'react-lottie';

const Onboarding = () => {
  const { t } = useTranslation();
  const { push } = useHistory();

  const getLottieOptions = (step: any) => {
    return {
        loop: false,
        autoplay: false,
        animationData: step.default,
        rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };
  };
  const [actualStep, setActualStep] = useState<number>(1);

  const handleChangeStep = (nextStep: number) => () => {
    setActualStep(nextStep);
  };

  const buttonByStep = useCallback(() => {
    switch (actualStep) {
      case 1:
        return <PrimaryButton
          padding="12px"
          type="button"
          width="100%"
          onClick={handleChangeStep(2)}
        >
          <PrimaryTextSpan
            color={Colors.BLACK}
            fontWeight="bold"
            fontSize="16px"
          >
            {t('Start Introduction')}
          </PrimaryTextSpan>
        </PrimaryButton>;
      case 2:
        return <PrimaryButton
          padding="12px"
          type="button"
          width="100%"
          onClick={handleChangeStep(3)}
        >
          <PrimaryTextSpan
            color={Colors.BLACK}
            fontWeight="bold"
            fontSize="16px"
          >
            {t('Next')}
          </PrimaryTextSpan>
        </PrimaryButton>;
      case 3:
        return <PrimaryButton
          padding="12px"
          type="button"
          width="100%"
          onClick={handleChangeStep(4)}
        >
          <PrimaryTextSpan
            color={Colors.BLACK}
            fontWeight="bold"
            fontSize="16px"
          >
            {t('Next')}
          </PrimaryTextSpan>
        </PrimaryButton>;
      default: return;
    }
  }, [actualStep]);

  const tabByStep = useCallback(() => {
    switch (actualStep) {
      case 1:
        return <Lottie options={getLottieOptions(firstStep)}
           isStopped={true}
           height={520}
           width={400}/>;
      case 2:
        return <Lottie options={getLottieOptions(firstStep)}
           isStopped={false}
           height={520}
           width={400}/>;
      default: return;
    }
  }, [actualStep]);

  const closeOnBoarding = () => {
    setActualStep(8);
  };

  return (
    <BackFlowLayout
      onBoarding={true}
      type="close"
      pageTitle={`${actualStep} / 8 ${t('steps')}`}
      handleGoBack={closeOnBoarding}
    >
      <FlexContainer
        flexDirection="column"
        justifyContent="space-between"
        width="100%"
        height="100%"
      >
        <FlexContainer flexDirection="column" width="100%">
          {tabByStep()}
        </FlexContainer>
        <FlexContainer
          width="100%"
          alignItems="center"
          justifyContent="center"
          padding="0 16px 40px"
        >
          {buttonByStep()}
        </FlexContainer>
      </FlexContainer>
    </BackFlowLayout>
  );
};

export default Onboarding;

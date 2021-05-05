import React, { useEffect, useState } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import BackFlowLayout from '../components/BackFlowLayout';
import { PrimaryButton } from '../styles/Buttons';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Lottie from 'react-lottie';
import API from '../helpers/API';
import { useStores } from '../hooks/useStores';
import { OnBoardingInfo } from '../types/OnBoardingTypes';
import LoaderForComponents from '../components/LoaderForComponents';
import { ButtonActionType } from '../enums/ButtonActionType';
import Colors from '../constants/Colors';
import Page from '../constants/Pages';

const Onboarding = () => {
  const { t } = useTranslation();
  const { push } = useHistory();
  const { badRequestPopupStore, mainAppStore } = useStores();

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
  const [loading, setLoading] = useState<boolean>(false);
  const [actualStepInfo, setActualStepInfo] = useState<OnBoardingInfo | null>(null);
  const [isAnimation, setIsAnimation] = useState<boolean>(false);

  const getInfoByStep = async (step: number) => {
    setLoading(true);
    try {
      const response = await API.getOnBoardingInfoByStep(step, 2, mainAppStore.initModel.miscUrl);
      setActualStepInfo(response);
      setLoading(false);
      setIsAnimation(true);
    } catch (error) {
      badRequestPopupStore.openModal();
      badRequestPopupStore.setMessage(error);
    }
  };

  const handleChangeStep = (nextStep: number) => () => {
    setActualStep(nextStep);
    getInfoByStep(nextStep);
  };

  const closeOnBoarding = () => {
    setActualStep(8);
    getInfoByStep(8);
  };

  const actionByType = (type: ButtonActionType) => () => {
    switch (type) {
      case ButtonActionType.NextStep:
        return handleChangeStep(actualStep + 1);
      case ButtonActionType.Demo:
        return push(Page.DASHBOARD);
      case ButtonActionType.Deposit:
        return push('/');
      default:
        return handleChangeStep(actualStep + 1);
    }
  };

  useEffect(() => {
    getInfoByStep(1);
  }, []);

  if (loading && !!actualStepInfo) {
    return <LoaderForComponents isLoading={loading} />;
  }

  return (
    <BackFlowLayout
      onBoarding={true}
      type="close"
      pageTitle={`${actualStep} / ${actualStepInfo?.data.totalSteps} ${t('steps')}`}
      handleGoBack={closeOnBoarding}
    >
      <FlexContainer
        flexDirection="column"
        justifyContent="space-between"
        width="100%"
        height="100%"
      >
        <FlexContainer flexDirection="column" width="100%">
          <Lottie options={getLottieOptions(actualStepInfo?.data.lottieJson)}
            isStopped={false}
            height={520}
            eventListeners={[
              {
                eventName: 'complete',
                callback: () => setIsAnimation(false),
              }
            ]}
            width={400}/>
        </FlexContainer>
        {!actualStepInfo?.data.fullScreen &&
          <FlexContainer
              width="100%"
              alignItems="center"
              justifyContent="center"
              padding="0 16px 40px"
              flexDirection="column"
          >
            {actualStepInfo?.data.buttons.map((button) => <PrimaryButton
              padding="12px"
              type="button"
              width="100%"
              backgroundColor={
                button.action === ButtonActionType.Demo ?
                  'transparent' :
                  Colors.ACCENT_BLUE
              }
              onClick={actionByType(button.action)}
              disabled={isAnimation}
            >
              <PrimaryTextSpan
                color={
                  button.action === ButtonActionType.Demo ?
                    '#ffffff' :
                    Colors.BLACK
                }
                fontWeight="bold"
                fontSize="16px"
              >
                {button.text}
              </PrimaryTextSpan>
            </PrimaryButton>)}
          </FlexContainer>
        }
      </FlexContainer>
    </BackFlowLayout>
  );
};

export default Onboarding;

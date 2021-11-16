import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import mixapanelProps from '../constants/mixpanelProps';
import KeysInApi from '../constants/keysInApi';
import Topics from '../constants/websocketTopics';
import Fields from '../constants/fields';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';
import { observer } from 'mobx-react-lite';
import { OnBoardingResponseEnum } from '../enums/OnBoardingRsponseEnum';
import { HintEnum } from '../enums/HintEnum';

const Onboarding = observer(() => {
  const { t } = useTranslation();
  const { push } = useHistory();
  const {
    badRequestPopupStore,
    mainAppStore,
    userProfileStore,
    educationStore,
  } = useStores();

  const wrapperRef = useRef<HTMLDivElement>(document.createElement('div'));
  const [actualStep, setActualStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [actualStepInfo, setActualStepInfo] = useState<OnBoardingInfo | null>(
    null
  );
  const [parsedParams, setParsedParams] = useState('');
  const urlParams = new URLSearchParams();

  useEffect(() => {
    urlParams.set('token', mainAppStore.token);
    urlParams.set(
      'active_account_id',
      mainAppStore.accounts.find((item) => item.isLive)?.id || ''
    );
    urlParams.set('env', 'web_mob');
    urlParams.set('lang', mainAppStore.lang);
    urlParams.set('trader_id', userProfileStore.userProfileId || '');
    urlParams.set('api', mainAppStore.initModel.tradingUrl);
    urlParams.set('rt', mainAppStore.refreshToken);

    setParsedParams(urlParams.toString());
  }, [
    mainAppStore.token,
    mainAppStore.lang,
    mainAppStore.accounts,
    userProfileStore,
  ]);

  const getLottieOptions = useCallback(() => {
    return {
      loop: false,
      autoplay: true,
      pause: false,
      animationData:
        actualStepInfo?.data.lottieJson !== null
          ? JSON.parse(actualStepInfo?.data.lottieJson || '')
          : '',
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
        clearCanvas: false,
      },
    };
  }, [actualStepInfo]);

  const getInfoByStep = async (step: number) => {
    try {
      const response = await API.getOnBoardingInfoByStep(
        step,
        2,
        mainAppStore.initModel.miscUrl
      );
      if (response.responseCode === OnBoardingResponseEnum.Ok) {
        setActualStepInfo(null);
        setActualStepInfo(response);
        setActualStep(step);
        setLoading(false);
        if (step === 1) {
          mixpanel.track(mixpanelEvents.ONBOARDING, {
            [mixapanelProps.ONBOARDING_VALUE]: 'start1',
          });
        }
      } else {
        openDemoRealPopup();
      }
    } catch (error) {
      openDemoRealPopup();
    }
  };

  const handleClickLottie = (e: any) => {
    e.preventDefault();
  };

  const handleChangeStep = (nextStep: number) => () => {
    mixpanel.track(mixpanelEvents.ONBOARDING, {
      [mixapanelProps.ONBOARDING_VALUE]: mixpanelEventByStep(),
    });
    getInfoByStep(nextStep);
  };

  const closeOnBoarding = async () => {
    if (
      actualStepInfo?.data.totalSteps &&
      actualStepInfo?.data.totalSteps !== actualStep
    ) {
      mixpanel.track(mixpanelEvents.ONBOARDING, {
        [mixapanelProps.ONBOARDING_VALUE]: `close${actualStep}`,
      });
      setActualStep(actualStepInfo?.data.totalSteps);
      getInfoByStep(actualStepInfo?.data.totalSteps);
    } else {
      const acc = mainAppStore.accounts.find((acc) => acc.isLive);
      if (acc) {
        
        await mainAppStore.setActiveAccount(acc);
        console.log('set acc Live: ', acc.id);
        educationStore.setFTopenHint(HintEnum.SkipOB);
      }

      mixpanel.track(mixpanelEvents.ONBOARDING, {
        [mixapanelProps.ONBOARDING_VALUE]: `close${actualStep}`,
      });

      mainAppStore.onboardingJustClosed = true;
      mainAppStore.addTriggerDissableOnboarding();
      mainAppStore.isOnboarding = false;

      push(Page.DASHBOARD);
    }
  };

  const selectDemoAccount = async () => {
    const acc = mainAppStore.accounts.find((item) => !item.isLive);
    if (acc) {
      try {
        mainAppStore.activeSession?.send(Topics.SET_ACTIVE_ACCOUNT, {
          [Fields.ACCOUNT_ID]: acc.id,
        });
        mainAppStore.setActiveAccount(acc);
        mixpanel.track(mixpanelEvents.ONBOARDING, {
          [mixapanelProps.ONBOARDING_VALUE]: `demo${actualStep}`,
        });
        mainAppStore.addTriggerDissableOnboarding();
        mainAppStore.isOnboarding = false;
        educationStore.setFTopenHint(HintEnum.DemoACC);
        push(Page.DASHBOARD);
      } catch (error) {
        badRequestPopupStore.openModal();
        badRequestPopupStore.setMessage(`${error}`);
      }
    }
  };

  const selectRealAccount = async () => {
    educationStore.setFTopenHint(HintEnum.Deposit);
    const acc = mainAppStore.accounts.find((item) => item.isLive);
    if (acc) {
      try {
        await API.setKeyValue(
          {
            key: KeysInApi.ACTIVE_ACCOUNT_ID,
            value: acc.id,
          },
          mainAppStore.initModel.tradingUrl
        );
        mainAppStore.activeSession?.send(Topics.SET_ACTIVE_ACCOUNT, {
          [Fields.ACCOUNT_ID]: acc.id,
        });
        mainAppStore.setActiveAccount(acc);
        mainAppStore.addTriggerDissableOnboarding();
        mainAppStore.isOnboarding = false;
        mainAppStore.isLoading = true;
        mixpanel.track(mixpanelEvents.ONBOARDING, {
          [mixapanelProps.ONBOARDING_VALUE]: `real${actualStep}`,
        });

        if (userProfileStore.isBonus) {
          userProfileStore.showBonusPopup();
          mainAppStore.setLoading(false);
        } else {
          window.location.href = `${API_DEPOSIT_STRING}/?${parsedParams}`;
        }
      } catch (error) {
        badRequestPopupStore.openModal();
        badRequestPopupStore.setMessage(`${error}`);
      }
    }
  };

  const actionByType = (type: ButtonActionType) => {
    switch (type) {
      case ButtonActionType.NextStep:
        return handleChangeStep(actualStep + 1);
      case ButtonActionType.Demo:
        return selectDemoAccount;
      case ButtonActionType.Deposit:
        return selectRealAccount;
      default:
        return handleChangeStep(actualStep + 1);
    }
  };

  const mixpanelEventByStep = () => {
    switch (actualStep) {
      case 1:
        return 'start1';
      case 5:
        return 'buy5';
      case 6:
        return 'sell6';
      case 7:
        return 'withdraw7';
      default:
        return `next${actualStep}`;
    }
  };

  const getActualWidth = useCallback(() => {
    return wrapperRef.current?.offsetWidth || 375;
  }, [wrapperRef]);

  const openDemoRealPopup = () => {
    mainAppStore.isOnboarding = false;
    mainAppStore.isDemoRealPopup = true;
    push(Page.DEMO_REAL_PAGE);
  };

  useEffect(() => {
    let cleanupFunction = false;
    const getInfoFirstStep = async () => {
      try {
        const response = await API.getOnBoardingInfoByStep(
          1,
          2,
          mainAppStore.initModel.miscUrl
        );
        if (response.responseCode === OnBoardingResponseEnum.Ok) {
          setActualStepInfo(null);
          setActualStepInfo(response);
          setActualStep(1);
          setLoading(false);
        } else {
          openDemoRealPopup();
        }
      } catch (error) {
        openDemoRealPopup();
      }
    };
    getInfoFirstStep();

    return () => {
      cleanupFunction = true;
      const useAccount = mainAppStore.accounts.find(
        (account) => !account.isLive
      );
      if (useAccount) {
        mainAppStore.setActiveAccount(useAccount);
      }
    };
  }, []);

  useEffect(() => {
    if (mainAppStore.isPromoAccount) {
      push(Page.DASHBOARD);
    }
  }, [mainAppStore.isPromoAccount]);

  if (loading || actualStepInfo === null) {
    return (
      <LoaderForComponents isLoading={loading || actualStepInfo === null} />
    );
  }

  return (
    <BackFlowLayout
      onBoarding={true}
      type="close"
      pageTitle={`${actualStep} / ${actualStepInfo?.data.totalSteps} ${t(
        'steps'
      )}`}
      handleGoBack={closeOnBoarding}
    >
      <FlexContainer
        flexDirection="column"
        justifyContent="space-between"
        width="100%"
        height="100%"
        ref={wrapperRef}
      >
        <FlexContainer
          flexDirection="column"
          width="100%"
          onClick={
            actualStepInfo?.data.fullScreen
              ? handleChangeStep(actualStep + 1)
              : handleClickLottie
          }
        >
          <Lottie
            options={getLottieOptions()}
            height={getActualWidth() * 1.5}
            width={getActualWidth()}
            isClickToPauseDisabled={true}
          />
        </FlexContainer>
        {!actualStepInfo?.data.fullScreen && (
          <BottomWrapper justifyContent="center" flexDirection="column">
            <FlexContainer
              width="100%"
              alignItems="center"
              justifyContent="center"
              padding="0 16px 40px"
              flexDirection="column"
              position="relative"
              margin={`${actualStep === 7 ? '-80px' : '-200px'} 0 0 0`}
            >
              {actualStepInfo?.data.title && (
                <PrimaryTextSpan
                  fontSize="24px"
                  color="#ffffff"
                  marginBottom="16px"
                  textAlign="center"
                >
                  {actualStepInfo?.data.title}
                </PrimaryTextSpan>
              )}
              {actualStepInfo?.data.description && (
                <PrimaryTextSpan
                  fontSize="16px"
                  color="rgba(235, 235, 245, 0.6)"
                  textAlign="center"
                >
                  {actualStepInfo?.data.description}
                </PrimaryTextSpan>
              )}
            </FlexContainer>
            <FlexContainer
              width="100%"
              alignItems="center"
              justifyContent="center"
              padding="0 16px 40px"
              flexDirection="column"
            >
              {actualStepInfo?.data.buttons.map((button) => (
                <OnboardingButton
                  padding="12px"
                  type="button"
                  width="100%"
                  onClick={actionByType(button.action)}
                  key={`${button.action}_${actualStep}`}
                  isDemo={button.action === ButtonActionType.Demo}
                >
                  <PrimaryTextSpan
                    color={
                      button.action === ButtonActionType.Demo
                        ? '#ffffff'
                        : Colors.BLACK
                    }
                    fontWeight="bold"
                    fontSize="16px"
                  >
                    {button.text}
                  </PrimaryTextSpan>
                </OnboardingButton>
              ))}
            </FlexContainer>
          </BottomWrapper>
        )}
      </FlexContainer>
    </BackFlowLayout>
  );
});

export default Onboarding;

const translateAnimationIn = keyframes(`
  0% {
    transform: translateY(150px);
    opacity: 0;
  }
  50% {
    transform: translateY(150px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`);

const buttonAnimation = keyframes`
    from {
      background-color: rgba(196, 196, 196, 0.5);
    }
    to {
      background-color: #00FFDD;
    }
`;

const BottomWrapper = styled(FlexContainer)`
  opacity: 1;
  transform: translateY(0);
  animation: ${translateAnimationIn} 1s ease;
`;

const OnboardingButton = styled(PrimaryButton)<{ isDemo: boolean }>`
  animation: ${(props) => !props.isDemo && buttonAnimation} 2s ease;
  background-color: ${(props) => props.isDemo && 'transparent'};
  &:hover {
    background-color: ${(props) => props.isDemo && 'transparent'};
  }
`;

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

const Onboarding = () => {
  const { t } = useTranslation();
  const { push } = useHistory();
  const {
    badRequestPopupStore,
    mainAppStore,
    userProfileStore
  } = useStores();

  const wrapperRef = useRef<HTMLDivElement>(document.createElement('div'));
  const [actualStep, setActualStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [actualStepInfo, setActualStepInfo] = useState<OnBoardingInfo | null>(null);
  const [isAnimation, setIsAnimation] = useState<boolean>(true);
  const [pause, setPause] = useState<boolean>(false);
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
  }, [mainAppStore.token, mainAppStore.lang, mainAppStore.accounts]);

  const getLottieOptions = (step: any) => {
    return {
      loop: false,
      autoplay: true,
      pause: pause,
      animationData: JSON.parse(step),
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };
  };

  const getInfoByStep = async (step: number) => {
    try {
      const response = await API.getOnBoardingInfoByStep(step, 2, mainAppStore.initModel.miscUrl);
      if (response.responseCode === 0) {
        setActualStepInfo(response);
        setPause(false);
        setLoading(false);
        setIsAnimation(true);
      } else {
       push(Page.DASHBOARD);
      }
    } catch (error) {
      push(Page.DASHBOARD);
    }
  };

  const handleClickPause = () => {
    setPause(!pause);
  };

  const handleChangeStep = (nextStep: number) => () => {
    setActualStep(nextStep);
    getInfoByStep(nextStep);
  };

  const closeOnBoarding = () => {
    if (actualStepInfo?.data.totalSteps) {
      mixpanel.track(mixpanelEvents.ONBOARDING, {
        [mixapanelProps.ONBOARDING_VALUE]: `close${actualStep}`,
      });
      setActualStep(actualStepInfo?.data.totalSteps);
      getInfoByStep(actualStepInfo?.data.totalSteps);
    }
  };

  const selectDemoAccount = async () => {
    const acc = mainAppStore.accounts.find((item) => !item.isLive);
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
        mixpanel.track(mixpanelEvents.ONBOARDING, {
          [mixapanelProps.ONBOARDING_VALUE]: `demo${actualStep}`,
        });
        push(Page.DASHBOARD);
        mainAppStore.isDemoRealPopup = false;
      } catch (error) {
        badRequestPopupStore.openModal();
        badRequestPopupStore.setMessage(error);
      }
    }
  };

  const selectRealAccount = async () => {
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
        mainAppStore.isLoading = true;
        mixpanel.track(mixpanelEvents.ONBOARDING, {
          [mixapanelProps.ONBOARDING_VALUE]: `real${actualStep}`,
        });
        window.location.href = `${API_DEPOSIT_STRING}/?${parsedParams}`;
        mainAppStore.isDemoRealPopup = false;
      } catch (error) {
        badRequestPopupStore.openModal();
        badRequestPopupStore.setMessage(error);
      }
    }
  }

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

  const getActualWidth = useCallback(() => {
    return wrapperRef.current?.offsetWidth || 375;
  }, [wrapperRef]);

  useEffect(() => {
    mixpanel.track(mixpanelEvents.ONBOARDING, {
      [mixapanelProps.ONBOARDING_VALUE]: 'start1',
    });
    getInfoByStep(1);
  }, []);

  if (loading || actualStepInfo === null ) {
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
        ref={wrapperRef}
      >
        <FlexContainer
          flexDirection="column"
          width="100%"
          onClick={
            actualStepInfo?.data.fullScreen ?
              handleChangeStep(actualStep + 1) :
              handleClickPause
          }
        >
          <Lottie options={getLottieOptions(actualStepInfo?.data.lottieJson)}
            isStopped={false}
            height={getActualWidth() * 1.3}
            eventListeners={[
              {
                eventName: 'complete',
                callback: () => setIsAnimation(false),
              }
            ]}
            width={getActualWidth()}/>
        </FlexContainer>
        {!actualStepInfo?.data.fullScreen &&
          <>
            <FlexContainer
              width="100%"
              alignItems="center"
              justifyContent="center"
              padding="0 16px 40px"
              flexDirection="column"
              position="relative"
              margin="-100px 0 0 0"
            >
              {actualStepInfo?.data.title && <PrimaryTextSpan
                fontSize="24px"
                color="#ffffff"
                marginBottom="16px"
                textAlign="center"
              >
                {actualStepInfo?.data.title}
              </PrimaryTextSpan>}
              {actualStepInfo?.data.description && <PrimaryTextSpan
                fontSize="16px"
                color="rgba(235, 235, 245, 0.6)"
                textAlign="center"
              >
                {actualStepInfo?.data.description}
              </PrimaryTextSpan>}
            </FlexContainer>
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
                key={button.action}
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
          </>
        }
      </FlexContainer>
    </BackFlowLayout>
  );
};

export default Onboarding;

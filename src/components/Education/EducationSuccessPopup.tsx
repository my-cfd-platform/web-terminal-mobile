import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useState } from 'react';
import PopupContainer from '../../containers/PopupContainer';
import { useStores } from '../../hooks/useStores';
import { FlexContainer } from '../../styles/FlexContainer';

import Lottie from 'react-lottie';
import * as confettie from '../../assets/lotties/confettie-animation.json';
import * as SuccessImage from '../../assets/lotties/success-icon.json';
import { PrimaryButton } from '../../styles/Buttons';
import { useTranslation } from 'react-i18next';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { FULL_VH } from '../../constants/global';
import { useHistory } from 'react-router';
import Page from '../../constants/Pages';
import { IEducationCourses } from '../../types/EducationTypes';

const EducationSuccessPopup = observer(() => {
  const { mainAppStore, educationStore, userProfileStore } = useStores();
  const { t } = useTranslation();
  const { push } = useHistory();

  const [parsedParams, setParsedParams] = useState('');
  const urlParams = new URLSearchParams();

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

  const nextCourse = () => {
    let indexOfCourse: null | number | undefined = null;
    educationStore.coursesList?.map((item, index) => {
      if (item.id === educationStore.activeCourse?.id) {
        indexOfCourse = index;
      }
      return item;
    });
    educationStore.setActiveCourse(null);
    if (
      indexOfCourse !== null &&
      indexOfCourse !== undefined &&
      educationStore.coursesList
    ) {
      let nexCoursePage: IEducationCourses;
      switch (indexOfCourse) {
        case 0:
          if (
            educationStore.coursesList[1]?.totalQuestions ===
            educationStore.coursesList[1]?.lastQuestionNumber
          ) {
            nexCoursePage = educationStore.coursesList[indexOfCourse + 2];
          } else {
            nexCoursePage = educationStore.coursesList[indexOfCourse + 1];
          }
          break;
        case 1:
          if (
            educationStore.coursesList[0]?.totalQuestions ===
            educationStore.coursesList[0]?.lastQuestionNumber
          ) {
            nexCoursePage = educationStore.coursesList[indexOfCourse + 1];
          } else {
            nexCoursePage = educationStore.coursesList[0];
          }
          break;
        case 2:
          if (
            educationStore.coursesList[0]?.totalQuestions ===
            educationStore.coursesList[0]?.lastQuestionNumber
          ) {
            nexCoursePage = educationStore.coursesList[1];
          } else {
            nexCoursePage = educationStore.coursesList[0];
          }
          break;
        default:
          nexCoursePage = educationStore.coursesList[indexOfCourse + 1];
      }

      educationStore.setActiveCourse(nexCoursePage);
      push(`${Page.EDUCATION}/${nexCoursePage.id}`);
    }
    educationStore.setShowPopup(false);
  };

  const closePopup = () => {
    //educationStore.setActiveCourse(null);
    educationStore.setActiveQuestion(null);
    //educationStore.setQuestionsList(null);
    educationStore.setShowPopup(false);
    push(`${Page.EDUCATION}/${educationStore.activeCourse?.id}`);
  };

  const checkLastCourses = useCallback(() => {
    return educationStore.coursesList
      ?.filter((el) => el.totalQuestions > 0)
      .every((item) => item.lastQuestionNumber === item.totalQuestions);
  }, [educationStore.coursesList]);

  const handleOpenDeposit = () => {
    // if (userProfileStore.isBonus) {
    //   userProfileStore.showBonusPopup();
    //   mainAppStore.setLoading(false);
    // } else {
    //   window.location.href = `${API_DEPOSIT_STRING}/?${parsedParams}`;
    // }

    window.location.href = `${API_DEPOSIT_STRING}/?${parsedParams}`;
  };

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
    urlParams.set('useBonus', 'true');

    setParsedParams(urlParams.toString());
  }, [
    mainAppStore.token,
    mainAppStore.lang,
    mainAppStore.accounts,
    userProfileStore,
  ]);

  return (
    <PopupContainer
      title={`${educationStore.activeCourse?.title || ''}`}
      onClose={closePopup}
    >
      <FlexContainer width="100%" flex="1" flexDirection="column">
        <FlexContainer
          flexDirection="column"
          flex="1"
          maxHeight={`calc(${FULL_VH} - 144px)`}
          overflow="auto"
        >
          <FlexContainer
            justifyContent={'center'}
            alignItems={'center'}
            margin="20px 0 40px"
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

          <FlexContainer flexDirection="column" width="100%" padding="16px">
            <PrimaryTextSpan
              fontSize="22px"
              color="#ffffff"
              lineHeight="1.5"
              fontWeight="bold"
              textAlign="center"
            >
              {t('Congratulation! You have successfully completed')}
              <br />
              {educationStore.activeCourse?.title || ''}
            </PrimaryTextSpan>
          </FlexContainer>
        </FlexContainer>

        {/* buttons */}
        <FlexContainer width="100%" flexDirection="column" padding="16px">
          <FlexContainer width="100%">
            <PrimaryButton width="100%" onClick={handleOpenDeposit}>
              <PrimaryTextSpan color="#1C1F26" fontSize="16px" fontWeight={700}>
                {t('Deposit & Start Trading')}
              </PrimaryTextSpan>
            </PrimaryButton>
          </FlexContainer>

          <FlexContainer
            width="100%"
            height="56px"
            alignItems="center"
            justifyContent="center"
          >
            <ButtonWithoutStyles
              onClick={checkLastCourses() ? closePopup : nextCourse}
            >
              <PrimaryTextSpan color="#ffffff" fontSize="16px">
                {checkLastCourses() ? t('Finish Course') : t('Next Course')}
              </PrimaryTextSpan>
            </ButtonWithoutStyles>
          </FlexContainer>
        </FlexContainer>
        {/*  // buttons */}
      </FlexContainer>
    </PopupContainer>
  );
});

export default EducationSuccessPopup;

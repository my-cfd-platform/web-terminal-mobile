import styled from '@emotion/styled-base';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import BackFlowLayout from '../components/BackFlowLayout';
import SvgIcon from '../components/SvgIcon';
import Page from '../constants/Pages';
import { useStores } from '../hooks/useStores';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';

import IconList from '../assets/svg/education/icon-list.svg';
import { PrimaryButton } from '../styles/Buttons';
import { useTranslation } from 'react-i18next';
import { IEducationCourses } from '../types/EducationTypes';
import API from '../helpers/API';
import apiResponseCodeMessages from '../constants/apiResponseCodeMessages';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';

const EducationQuestionPage = observer(() => {
  const { educationStore, mainAppStore, notificationStore } = useStores();
  const { t, i18n } = useTranslation();
  const { push } = useHistory();

  const [activePage, setActivePage] = useState<number>(0);
  const [lastHandle, setLastHandle] = useState<'prev' | 'next' | null>(null);

  const checkPage = useCallback(() => {
    if (!educationStore.activeQuestion?.pages[activePage]?.url) {
      push(`${window.location.origin}${Page.PAGE_NOT_FOUND}`);
      return;
    }
    return `${window.location.origin}/${
      educationStore.activeQuestion?.pages[activePage]?.url || ''
    }?platform=${mainAppStore.initModel.brandName}&lang=${
      i18n.language || 'en'
    }`;
  }, [activePage, educationStore.activeQuestion]);

  const checkNumberOfQuestion = () => {
    const indexOfQuestion = educationStore.questionsList?.questions.indexOf(
      educationStore.activeQuestion!
    );
    if (indexOfQuestion) {
      return indexOfQuestion + 1;
    }
    return 1;
  };

  const checkFirstPage = useCallback(() => {
    return (
      educationStore.activeQuestion?.id ===
        educationStore.questionsList?.questions[0]?.id && activePage === 0
    );
  }, [educationStore.activeQuestion, educationStore.questionsList, activePage]);

  const checkLastPage = useCallback(() => {
    return (
      educationStore.activeQuestion?.id ===
        educationStore.questionsList?.questions[
          educationStore.questionsList?.questions.length - 1
        ]?.id && activePage === educationStore.activeQuestion?.pages.length! - 1
    );
  }, [educationStore.activeQuestion, educationStore.questionsList, activePage]);

  const handleNextPage = useCallback(async () => {
    setLastHandle('next');
    if (activePage === educationStore.activeQuestion?.pages.length! - 1) {
      setActivePage(0);
      const indexOfQuestion =
        educationStore.questionsList?.questions.indexOf(
          educationStore.activeQuestion!
        ) || 0;
      if (
        indexOfQuestion + 1 >
        educationStore.activeCourse?.lastQuestionNumber!
      ) {
        const newCourseList = educationStore.coursesList?.map((item) => {
          if (item.id === educationStore.activeCourse?.id) {
            const newCourse = {
              ...item,
              lastQuestionNumber: indexOfQuestion + 1,
            };
            educationStore.setActiveCourse(newCourse);
            return newCourse;
          }
          return item;
        });
        if (newCourseList) {
          educationStore.setCoursesList(newCourseList);
        }
        try {
          const response = await API.saveProgressEducation(
            mainAppStore.initModel.miscUrl,
            educationStore.activeCourse?.id || '',
            educationStore.activeQuestion?.id || 0
          );

          switch (response.responseCode) {
            case 0:
              break;

            default:
              notificationStore.notificationMessage = t(
                apiResponseCodeMessages[
                  OperationApiResponseCodes.TechnicalError
                ]
              );
              notificationStore.isSuccessfull = false;
              notificationStore.openNotification();
              break;
          }
        } catch (error) {
          educationStore.openErrorModal();
          return;
        }
      }
      if (
        indexOfQuestion ===
        educationStore.questionsList?.questions.length! - 1
      ) {
        educationStore.setShowPopup(true);
      } else {
        educationStore.setActiveQuestion(
          educationStore.questionsList?.questions[indexOfQuestion + 1] || null
        );
      }
    } else {
      setActivePage(activePage + 1);
    }
  }, [activePage, educationStore.questionsList, educationStore.activeQuestion]);

  const handlePrevPage = useCallback(() => {
    setLastHandle('prev');
    if (activePage === 0) {
      const indexOfQuestion =
        educationStore.questionsList?.questions.indexOf(
          educationStore.activeQuestion!
        ) || 0;
      educationStore.setActiveQuestion(
        educationStore.questionsList?.questions[indexOfQuestion - 1] || null
      );
    } else {
      setActivePage(activePage - 1);
    }
  }, [activePage, educationStore.questionsList, educationStore.activeQuestion]);

  useEffect(() => {
    if (lastHandle !== 'prev') {
      setActivePage(0);
    } else {
      setActivePage(educationStore.activeQuestion?.pages.length! - 1 || 0);
    }
  }, [educationStore.activeQuestion, educationStore.coursesList]);

  useEffect(() => {
    if (!educationStore.activeQuestion) {
      push(Page.EDUCATION);
    }
  }, []);

  return (
    <BackFlowLayout
      type="close"
      pageTitle={educationStore.activeCourse?.title}
      backLink={`${Page.EDUCATION}`}
    >
      <FlexContainer position="absolute" top="16px" right="16px">
        <PrimaryTextSpan
          color="rgba(255, 255, 255, 0.4)"
          fontWeight={500}
          fontSize="16px"
        >
          <PrimaryTextSpan color="#ffffff" fontSize="16px" fontWeight={500}>
            {checkNumberOfQuestion()}
          </PrimaryTextSpan>
          {` / ${educationStore.questionsList?.questions.length}`}
        </PrimaryTextSpan>
      </FlexContainer>
      <FlexContainer flexDirection="column" width="100%">
        <FlexContainer flex="1" backgroundColor="#1C1F26">
          <iframe
            frameBorder="none"
            width="100%"
            height="100%"
            src={checkPage()}
          />
        </FlexContainer>
        <FlexContainer padding="12px 16px" height="80px">
          <FlexContainer width="56px" marginRight="16px">
            <LinkBtn
              to={`${Page.EDUCATION}/${educationStore.activeCourse?.id}`}
            >
              <SvgIcon {...IconList} fillColor="#ffffff" />
            </LinkBtn>
          </FlexContainer>

          <ButtonContainer flex="1" justifyContent="space-between">
            <PrevBtn disabled={checkFirstPage()} onClick={handlePrevPage}>
              {t('Previous')}
            </PrevBtn>
            <PrimaryButton onClick={handleNextPage}>
              <PrimaryTextSpan color="#1C1F26" fontSize="16px" fontWeight={700}>
                {checkLastPage() ? t('Finish') : t('Next')}
              </PrimaryTextSpan>
            </PrimaryButton>
          </ButtonContainer>
        </FlexContainer>
      </FlexContainer>
    </BackFlowLayout>
  );
});

export default EducationQuestionPage;

const ButtonContainer = styled(FlexContainer)`
  button {
    width: ${`calc(50% - 8px)`};
  }
`;

const PrevBtn = styled(PrimaryButton)`
  background-color: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.64);

  &:hover {
    background-color: rgba(255, 255, 255, 0.12);
  }

  &:focus {
    background-color: rgba(255, 255, 255, 0.12);
  }

  &:disabled {
    background-color: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.64);
    opacity: 0.6;
  }
`;

const LinkBtn = styled(Link)`
  display: flex;
  width: 56px;
  height: 56px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.12);
  justify-content: center;
  align-items: center;
`;

import { observer, Observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router';
import BackFlowLayout from '../components/BackFlowLayout';
import EducationQuestionItem from '../components/Education/EducationQuestionItem';
import LoaderForComponents from '../components/LoaderForComponents';
import Page from '../constants/Pages';
import { EducationResponseEnum } from '../enums/EducationResponseEnum';
import { WelcomeBonusResponseEnum } from '../enums/WelcomeBonusResponseEnum';
import API from '../helpers/API';
import { useStores } from '../hooks/useStores';
import { FlexContainer } from '../styles/FlexContainer';
import {
  IEducationCourses,
  IEducationQuestion,
  IEducationQuestionsList,
} from '../types/EducationTypes';

const EducationListPage = observer(() => {
  const activeQuestionRef = useRef<HTMLDivElement | null>(null);

  const { mainAppStore, educationStore, notificationStore } = useStores();
  const { t } = useTranslation();
  const { push } = useHistory();
  const { id } = useParams<{ id: string }>();

  const openEmptyState = () => {
    educationStore.setQuestionsList(null);
    educationStore.setActiveQuestion(null);

    notificationStore.notificationMessage = `Oops... ${t(
      'Something went wrong'
    )}`;
    notificationStore.isSuccessfull = false;
    notificationStore.openNotification();
  };

  useEffect(() => {
    const getList = async () => {
      try {
        educationStore.setEducationIsLoaded(true);
        const response = await API.getQuestionsByCourses(
          mainAppStore.initModel.miscUrl,
          id
        );

        switch (response.responseCode) {
          case EducationResponseEnum.Ok: {
            if (
              response.data === null ||
              Object.keys(response.data).length <= 0 ||
              response.data.lastQuestionNumber === null ||
              !response.data.id ||
              response.data.questions === null ||
              response.data.questions.length <= 0
            ) {
              openEmptyState();
              break;
            }

            const newData: IEducationQuestionsList = response.data;
            newData.questions = response.data.questions.sort(
              (a, b) => a.id - b.id
            );
            
            educationStore.setQuestionsList(newData);
            if (
              educationStore.activeCourse?.totalQuestions ===
              educationStore.questionsList?.lastQuestionNumber
            ) {
              // is completed course
              educationStore.setActiveQuestion(
                educationStore.questionsList?.questions[
                  educationStore.activeCourse?.lastQuestionNumber! - 1
                ] || null
              );
            } else {
              educationStore.setActiveQuestion(
                educationStore.questionsList?.questions[
                  educationStore.activeCourse?.lastQuestionNumber!
                ] ||
                  educationStore.questionsList?.questions[0] ||
                  null
              );
            }

            console.log('loaded course');
            break;
          }
          default:
            openEmptyState();
            break;
        }

        console.log('loaded course');
        educationStore.setEducationIsLoaded(false);
      } catch (error) {
        educationStore.setEducationIsLoaded(false);
        educationStore.openErrorModal();
      }
    };

    if (
      !educationStore.questionsList ||
      (educationStore.questionsList && educationStore.questionsList?.id !== id)
    ) {
      getList();
    }
  }, []);

  useEffect(() => {
    if (educationStore.coursesList !== null) {
      const course = educationStore.coursesList.find(
        (item: IEducationCourses) => item.id === id
      );
      educationStore.setActiveCourse(course || null);
      educationStore.setEducationIsLoaded(false);
      if (!course) {
        push(Page.PAGE_NOT_FOUND);
      }
    }
  }, [educationStore.coursesList, educationStore.activeCourse, id]);

  useEffect(() => {
    let timer: any;
    if (activeQuestionRef !== null) {
      timer = setTimeout(() => {
        activeQuestionRef?.current?.scrollIntoView();
      }, 0);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [educationStore.activeQuestion]);

  return (
    <BackFlowLayout
      pageTitle={
        educationStore.educationIsLoaded
          ? ''
          : educationStore.questionsList?.title ||
            `Oops... ${t('Something went wrong')}`
      }
      backLink={`${Page.EDUCATION}`}
    >
      <FlexContainer
        maxHeight="calc(100vh - 72px)"
        width="100%"
        overflow="auto"
        flexDirection="column"
      >
        <LoaderForComponents isLoading={educationStore.educationIsLoaded} />
        {educationStore.questionsList?.questions.map(
          (item: IEducationQuestion, index: number) => (
            <EducationQuestionItem
              itemRef={
                item.id === educationStore.activeQuestion?.id
                  ? activeQuestionRef
                  : null
              }
              key={item.id}
              number={index + 1}
              isActive={
                educationStore.questionsList?.lastQuestionNumber === item.id
              }
              isVisited={
                !!(
                  educationStore.activeCourse &&
                  index <= educationStore.activeCourse.lastQuestionNumber
                )
              }
              item={item}
            />
          )
        )}
      </FlexContainer>
    </BackFlowLayout>
  );
});

export default EducationListPage;

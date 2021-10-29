import { observer, Observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router';
import BackFlowLayout from '../components/BackFlowLayout';
import EducationQuestionItem from '../components/Education/EducationQuestionItem';
import Page from '../constants/Pages';
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
  const { mainAppStore, educationStore, notificationStore } = useStores();
  const { t } = useTranslation();
  const { push } = useHistory();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const getList = async () => {
      try {
        const response = await API.getQuestionsByCourses(
          mainAppStore.initModel.miscUrl,
          id
        );

        switch (response.responseCode) {
          case WelcomeBonusResponseEnum.Ok: {
            const isEmpty = response.data.questions.length <= 0;
            if (isEmpty) {
              push(Page.PAGE_NOT_FOUND);
              break;
            }
            const newData: IEducationQuestionsList = response.data;
            newData.questions = response.data.questions.sort(
              (a, b) => a.id - b.id
            );
            educationStore.setQuestionsList(newData);
            educationStore.setActiveQuestion(
              educationStore.questionsList?.questions[
                educationStore.activeCourse?.lastQuestionNumber!
              ] ||
                educationStore.questionsList?.questions[0] ||
                null
            );

            break;
          }

          default:
            educationStore.setQuestionsList(null);
            educationStore.setActiveQuestion(null);
            
            notificationStore.notificationMessage = t('Course Not Found');
            notificationStore.isSuccessfull = false;
            notificationStore.openNotification();
            break;
        }
      } catch (error) {
        educationStore.openErrorModal();
      }
    };
    getList();
  }, []);

  useEffect(() => {
    if (educationStore.coursesList !== null) {
      const course = educationStore.coursesList.find(
        (item: IEducationCourses) => item.id === id
      );
      educationStore.setActiveCourse(course || null);
      if (!course) {
        push(Page.PAGE_NOT_FOUND);
      }
    }
  }, [educationStore.coursesList, educationStore.activeCourse, id]);

  return (
    <BackFlowLayout
      pageTitle={
        educationStore.questionsList?.title || `${t('Course Not Found')}`
      }
      backLink={`${Page.EDUCATION}`}
    >
      <FlexContainer
        maxHeight="calc(100vh - 72px)"
        width="100%"
        overflow="auto"
        flexDirection="column"
      >
        {educationStore.questionsList?.questions.map(
          (item: IEducationQuestion, index: number) => (
            <EducationQuestionItem
              key={item.id}
              number={index + 1}
              isActive={
                educationStore.questionsList?.lastQuestionId === item.id
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

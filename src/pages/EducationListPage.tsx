import { observer, Observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import BackFlowLayout from '../components/BackFlowLayout';
import EducationQuestionItem from '../components/Education/EducationQuestionItem';
import Page from '../constants/Pages';
import { WelcomeBonusResponseEnum } from '../enums/WelcomeBonusResponseEnum';
import API from '../helpers/API';
import { useStores } from '../hooks/useStores';
import { FlexContainer } from '../styles/FlexContainer';
import { IEducationCourses, IEducationQuestion, IEducationQuestionsList } from '../types/EducationTypes';

const EducationListPage = observer(() => {
  const { mainAppStore, educationStore } = useStores();
  const { push } = useHistory();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const getList = async () => {
      try {
        const response = await API.getQuestionsByCourses(
          mainAppStore.initModel.miscUrl,
          id
        );
        if (response.responseCode === WelcomeBonusResponseEnum.Ok) {
          const newData: IEducationQuestionsList = response.data;
          newData.questions = response.data.questions.sort((a, b) => a.id - b.id);
          educationStore.setQuestionsList(newData);
          educationStore.setActiveQuestion(
            educationStore.questionsList?.questions[
              educationStore.activeCourse?.lastQuestionNumber!
            ] ||
            educationStore.questionsList?.questions[0] ||
            null
          );
        }
      } catch (error) {}
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
        push(Page.EDUCATION);
      }
    }
  }, [educationStore.coursesList, educationStore.activeCourse, id]);

  return (
    <BackFlowLayout
      pageTitle={educationStore.questionsList?.title}
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

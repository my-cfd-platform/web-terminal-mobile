import { observer, Observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import EducationCourseListItem from '../components/Education/EducationCourseListItem';
import { WelcomeBonusResponseEnum } from '../enums/WelcomeBonusResponseEnum';
import API from '../helpers/API';
import { useStores } from '../hooks/useStores';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { IEducationCourses } from '../types/EducationTypes';

const EducationCourse = observer(() => {
  const { t } = useTranslation();
  const { educationStore } = useStores();

  useEffect(() => {
    
  }, []);

  return (
    <FlexContainer flexDirection="column">
      <FlexContainer padding="20px 16px" flexDirection="column">
        <PrimaryTextSpan color="#ffffff" fontWeight={600} fontSize="24px">
          {t('Education')}
        </PrimaryTextSpan>
      </FlexContainer>

      <FlexContainer flexDirection="column">
        {educationStore.coursesList?.map(
          (item: IEducationCourses, counter: number) => (
            <React.Fragment key={item.id}>
              {item.id && item.totalQuestions > 0 && (
                <EducationCourseListItem course={item} counter={counter} />
              )}
            </React.Fragment>
          )
        )}
      </FlexContainer>
    </FlexContainer>
  );
});

export default EducationCourse;

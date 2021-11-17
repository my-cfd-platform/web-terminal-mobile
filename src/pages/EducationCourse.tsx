import { observer, Observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EducationCourseListItem from '../components/Education/EducationCourseListItem';
import EducationEmptyState from '../components/Education/EducationEmptyState';
import { WelcomeBonusResponseEnum } from '../enums/WelcomeBonusResponseEnum';
import API from '../helpers/API';
import { useStores } from '../hooks/useStores';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { IEducationCourses } from '../types/EducationTypes';

const EducationCourse = observer(() => {
  const { t } = useTranslation();
  const { educationStore } = useStores();

  const [openCouerse, setOpenCourse] = useState<string | null>(null);

  const handleOpenCourse = (id: string) => {
    if (openCouerse === id) {
      setOpenCourse(null);
      return;
    }
    setOpenCourse(id);
  };

  return (
    <FlexContainer flexDirection="column" flex="1">
      <FlexContainer padding="20px 16px" flexDirection="column">
        <PrimaryTextSpan color="#ffffff" fontWeight={600} fontSize="24px">
          {t('Education')}
        </PrimaryTextSpan>
      </FlexContainer>

      <FlexContainer flexDirection="column">
        {educationStore.coursesList?.map(
          (item: IEducationCourses, counter: number) => (
            <EducationCourseListItem
              key={item.id}
              handleToggle={handleOpenCourse}
              isOpened={openCouerse === item.id}
              course={item}
              counter={counter}
            />
          )
        )}
      </FlexContainer>

      {!educationStore.coursesList && <EducationEmptyState />}
    </FlexContainer>
  );
});

export default EducationCourse;

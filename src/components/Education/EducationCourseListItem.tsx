import React, { FC, useEffect, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import { useStores } from '../../hooks/useStores';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { observer, Observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { IEducationCourses } from '../../types/EducationTypes';
import 'react-circular-progressbar/dist/styles.css';
import SvgIcon from '../SvgIcon';
import IconFullStar from '../../assets/svg/education/fullStar.svg';
import IconHalfStar from '../../assets/svg/education/halfStar.svg';
import IconShevronDown from '../../assets/svg/icon-shevron-down-sort-by.svg';
import IconEducation from '../../assets/svg/education/icon-education.svg';
import { PrimaryButton } from '../../styles/Buttons';
import { useHistory } from 'react-router';
import Page from '../../constants/Pages';

interface Props {
  course: IEducationCourses;
  counter: number;
}

const EducationCourseListItem: FC<Props> = observer((props) => {
  const {
    course: { id, title, description, lastQuestionNumber, totalQuestions },
    counter,
  } = props;

  const { educationStore } = useStores();

  const [on, toggle] = useState<boolean>(false);

  const { t } = useTranslation();
  const { push } = useHistory();

  const starsByCounter = () => {
    switch (counter) {
      case 0: {
        return (
          <FlexContainer alignItems="center">
            <FlexContainer marginRight="3px">
              <SvgIcon fillColor="#fffccc" {...IconFullStar} />
            </FlexContainer>
            <FlexContainer marginRight="3px">
              <SvgIcon fillColor="#fffccc" {...IconFullStar} />
            </FlexContainer>
            <FlexContainer marginRight="3px">
              <SvgIcon fillColor="#fffccc" {...IconFullStar} />
            </FlexContainer>
            <FlexContainer marginRight="3px">
              <SvgIcon fillColor="#fffccc" {...IconFullStar} />
            </FlexContainer>
            <FlexContainer>
              <SvgIcon fillColor="#fffccc" {...IconHalfStar} />
            </FlexContainer>
            <ReverseStar margin="0 8px 0 -1px">
              <SvgIcon fillColor="#7D8289" {...IconHalfStar} />
            </ReverseStar>
            <PrimaryTextSpan
              fontSize="12px"
              lineHeight="14px"
              color="rgba(255, 255, 255, 0.64)"
              letterSpacing="0.3px"
            >
              4.8 (22,012)
            </PrimaryTextSpan>
          </FlexContainer>
        );
      }
      case 1: {
        return (
          <FlexContainer alignItems="center">
            <FlexContainer marginRight="3px">
              <SvgIcon fillColor="#fffccc" {...IconFullStar} />
            </FlexContainer>
            <FlexContainer marginRight="3px">
              <SvgIcon fillColor="#fffccc" {...IconFullStar} />
            </FlexContainer>
            <FlexContainer marginRight="3px">
              <SvgIcon fillColor="#fffccc" {...IconFullStar} />
            </FlexContainer>
            <FlexContainer marginRight="3px">
              <SvgIcon fillColor="#fffccc" {...IconFullStar} />
            </FlexContainer>
            <FlexContainer marginRight="8px">
              <SvgIcon fillColor="#fffccc" {...IconFullStar} />
            </FlexContainer>
            <PrimaryTextSpan
              fontSize="12px"
              lineHeight="14px"
              color="rgba(255, 255, 255, 0.64)"
              letterSpacing="0.3px"
            >
              4.9 (12,843)
            </PrimaryTextSpan>
          </FlexContainer>
        );
      }
      case 2: {
        return (
          <FlexContainer alignItems="center">
            <FlexContainer marginRight="3px">
              <SvgIcon fillColor="#fffccc" {...IconFullStar} />
            </FlexContainer>
            <FlexContainer marginRight="3px">
              <SvgIcon fillColor="#fffccc" {...IconFullStar} />
            </FlexContainer>
            <FlexContainer marginRight="3px">
              <SvgIcon fillColor="#fffccc" {...IconFullStar} />
            </FlexContainer>
            <FlexContainer marginRight="3px">
              <SvgIcon fillColor="#fffccc" {...IconFullStar} />
            </FlexContainer>
            <FlexContainer marginRight="8px">
              <SvgIcon fillColor="#fffccc" {...IconFullStar} />
            </FlexContainer>
            <PrimaryTextSpan
              fontSize="12px"
              lineHeight="14px"
              color="rgba(255, 255, 255, 0.64)"
              letterSpacing="0.3px"
            >
              5.0 (8,628)
            </PrimaryTextSpan>
          </FlexContainer>
        );
      }
    }
  };

  const buttonByProgress = () => {
    switch ((lastQuestionNumber / totalQuestions) * 100) {
      case 0:
        return 'Start';
      case 100:
        return 'Review';
      default:
        return 'Continue';
    }
  };

  const toggling = () => {
    toggle(!on);
  };

  const handleOpenQuestions = () => {
    educationStore.setActiveCourse(props.course);
    push(`${Page.EDUCATION}/${props.course.id}`)
  };

  return (
    <CourseWrapper
      backgroundColor="rgba(42, 45, 56, 0.5);"
      padding="12px 16px"
      flexDirection="column"
      titleForOrder={props.course.title}
    >
      <FlexContainer
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        onClick={toggling}
        marginBottom={on ? '16px' : '0'}
      >
        <FlexContainer alignItems="center">
          <ProgressWrapper width="60px" height="60px" marginRight="12px">
            <CircularProgressbar
              value={parseInt(`${(lastQuestionNumber / totalQuestions) * 100}`)}
              text={`${parseInt(
                `${(lastQuestionNumber / totalQuestions) * 100}`
              )}%`}
              styles={buildStyles({
                strokeLinecap: 'butt',
                pathColor:
                  (lastQuestionNumber / totalQuestions) * 100 === 100
                    ? '#00FFDD'
                    : '#FFFCCC',
                trailColor: 'transparent',
                textColor:
                  (lastQuestionNumber / totalQuestions) * 100 === 100
                    ? '#00FFDD'
                    : '#FFFCCC',
                textSize: '16px',
              })}
              strokeWidth={3}
            />
            <ProgressBackground
              isFull={(lastQuestionNumber / totalQuestions) * 100 === 100}
            />
          </ProgressWrapper>
          <FlexContainer flexDirection="column">
            <PrimaryTextSpan
              fontSize="16px"
              lineHeight="19px"
              color="#fffccc"
              letterSpacing="0.3px"
              marginBottom="10px"
            >
              {t('Course')} - “{title}”
            </PrimaryTextSpan>
            <FlexContainer>{starsByCounter()}</FlexContainer>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer>
          <SvgIcon
            {...IconShevronDown}
            fillColor="rgba(255, 255, 255, 0.64)"
            width={10}
            height={6}
            transformProp={on ? 'rotate(0)' : 'rotate(180deg)'}
          />
        </FlexContainer>
      </FlexContainer>
      {on && (
        <FlexContainer flexDirection="column">
          <FlexContainer alignItems="center">
            <FlexContainer marginRight="4px" marginBottom="4px">
              <SvgIcon
                {...IconEducation}
                fillColor="#fffccc"
                width={16}
                height={10}
              />
            </FlexContainer>
            <PrimaryTextSpan
              textTransform="uppercase"
              color="#fff"
              fontSize="14px"
              lineHeight="21px"
              letterSpacing="0.3px"
              fontWeight={400}
            >
              {totalQuestions} {t('modules')}
            </PrimaryTextSpan>
          </FlexContainer>
          <PrimaryTextSpan
            color="rgba(255, 255, 255, 0.64)"
            fontSize="14px"
            lineHeight="19.6px"
            letterSpacing="0.3px"
            marginBottom="12px"
          >
            {description}
          </PrimaryTextSpan>
          <FlexContainer>
            <PrimaryButton
              padding="16px"
              width="100%"
              onClick={handleOpenQuestions}
            >
              <PrimaryTextSpan
                color="#003A38"
                fontSize="14px"
                fontWeight="bold"
              >
                {t(buttonByProgress())}
              </PrimaryTextSpan>
            </PrimaryButton>
          </FlexContainer>
        </FlexContainer>
      )}
    </CourseWrapper>
  );
});

export default EducationCourseListItem;

const CourseWrapper = styled(FlexContainer)<{ titleForOrder: string }>`
  cursor: pointer;
  // border-bottom: 1px solid rgba(255, 255, 255, 0.16);
  margin-bottom: 1px;
  translate: 0.4s;
  order: ${(props) => (props.titleForOrder === 'Beginner' ? '-1' : '')};
`;

const ProgressWrapper = styled(FlexContainer)`
  position: relative;
`;

const ReverseStar = styled(FlexContainer)`
  transform: scaleX(-1);
`;

const ProgressBackground = styled(FlexContainer)<{ isFull?: boolean }>`
  position: absolute;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background: ${(props) =>
    props.isFull ? 'rgba(0, 255, 221, 0.1)' : 'rgba(255, 252, 204, 0.1)'};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { IEducationQuestion } from '../../types/EducationTypes';
import IconLock from '../../assets/svg/education/icon-lock.svg';
import IconPlay from '../../assets/svg/education/icon-play.svg';

import SvgIcon from '../SvgIcon';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import API from '../../helpers/API';
import { useStores } from '../../hooks/useStores';
import { useHistory } from 'react-router';
import Page from '../../constants/Pages';
interface Props {
  item: IEducationQuestion;
  isVisited: boolean;
  isActive: boolean;
  number: number;
}
const EducationQuestionItem = ({
  item,
  isVisited,
  isActive,
  number,
}: Props) => {
  const { educationStore } = useStores();
  const { push } = useHistory();
  const handleSelectCourse = async () => {
    if (!isVisited) {
      return;
    }
    console.log(item)
    educationStore.setActiveQuestion(item);
    push(Page.EDUCATION_QUESTION);
  };

  return (
    <ButtonWithoutStyles onClick={handleSelectCourse}>
      <FlexContainer
        backgroundColor="rgba(42, 45, 56, 0.5)"
        padding="20px 16px"
        marginBottom="2px"
        alignItems="center"
        justifyContent="space-between"
      >
        <FlexContainer alignItems="center">
          <FlexContainer minWidth="16px" marginRight="8px">
            <PrimaryTextSpan fontSize="12px" color="rgba(255, 255, 255, 0.4)">
              {number}
            </PrimaryTextSpan>
          </FlexContainer>

          <FlexContainer maxWidth="calc(100vw - 72px)">
            <PrimaryTextSpan
              lineHeight="1.3"
              fontSize="14px"
              color={isActive ? '#ffffff' : `rgba(255, 255, 255, 0.64)`}
              textAlign="left"
            >
              {item.title}
            </PrimaryTextSpan>
          </FlexContainer>
        </FlexContainer>

        <FlexContainer>
          {isVisited ? (
            <SvgIcon fillColor="#00FFDD" {...IconPlay} />
          ) : (
            <SvgIcon fillColor="#7D8289" {...IconLock} />
          )}
        </FlexContainer>
      </FlexContainer>
    </ButtonWithoutStyles>
  );
};

export default EducationQuestionItem;

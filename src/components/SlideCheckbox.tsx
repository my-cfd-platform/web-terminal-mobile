import styled from '@emotion/styled';
import React, { FC, useState } from 'react';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { FlexContainer } from '../styles/FlexContainer';

interface Props {
  isActive: boolean;
  handleClick: (on: boolean) => void;
}

const SlideCheckbox: FC<Props> = ({ isActive, handleClick }) => {
  const [on, toggle] = useState(isActive);

  const handleClickAction = () => {
    toggle(!on);
    handleClick(!on);
  }

  return (
    <ButtonWithoutStyles onClick={handleClickAction}>
      <FlexContainer
      width="52px"
      height="31px"
      backgroundColor={on ? '#4CD964' : '#2d3341'}
      borderRadius="18px"
      alignItems="center"
      padding="0 2px"
      transition="all 0.4s ease"
      position="relative"
    >
      <FlexContainer
        height="25px"
        width="25px"
        backgroundColor="#ffffff"
        border="1px solid #E5E5E5"
        borderRadius="50%"
        boxShadow="0px 2px 2px rgba(0, 0, 0, 0.5)"
        transition="all 0.6s ease"
        position="relative"
        top="0px"
        left={on ? '22px' : '1px'}
      ></FlexContainer>
    </FlexContainer>
    </ButtonWithoutStyles>
  );
};

export default SlideCheckbox;

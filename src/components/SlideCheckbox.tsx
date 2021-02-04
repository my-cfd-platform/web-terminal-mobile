import styled from '@emotion/styled';
import React, { FC, useEffect, useState } from 'react';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { FlexContainer } from '../styles/FlexContainer';

interface Props {
  isActive: boolean;
  handleClick: (on: boolean) => void;
}

const SlideCheckbox: FC<Props> = ({ isActive, handleClick }) => {
  const handleClickAction = () => handleClick(!isActive);

  return (
    <ButtonWithoutStyles onClick={handleClickAction} type="button">
      <FlexContainer
        width="52px"
        height="31px"
        backgroundColor={isActive ? '#4CD964' : '#2d3341'}
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
          left={isActive ? '22px' : '1px'}
        ></FlexContainer>
      </FlexContainer>
    </ButtonWithoutStyles>
  );
};

export default SlideCheckbox;

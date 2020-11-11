import React from 'react';
import IconLoader from '../assets/svg/icon-loader-gray.svg';
import SvgIcon from './SvgIcon';
import { keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import { FlexContainer } from '../styles/FlexContainer';

const LoaderComponent = () => (
  <LoaderWrapper>
    <SvgIcon {...IconLoader} width="32px" height="32px" />
  </LoaderWrapper>
);

export default LoaderComponent;

const rotateAnimation = keyframes`
    from {
        transform: rotate(0);
    }

    to {
        transform: rotate(360deg);
    }
`;

const LoaderWrapper = styled(FlexContainer)`
  animation: ${rotateAnimation} 2s linear infinite;
`;

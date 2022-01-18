import { keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';


interface PreloaderButtonMaskProps {
  loading: boolean;
}

const PreloaderButtonMask = ({ loading }: PreloaderButtonMaskProps) => {
  if (!loading) {
    return null;
  }

  return (
    <FlexContainer
      position="absolute"
      top="0"
      left="0"
      bottom="0"
      right="0"
      width="100%"
      height="100%"
      zIndex="9"
      backgroundColor="#2F565E"
      border="1px solid rgba(0, 255, 221, 0.04)"
      alignItems="center"
      justifyContent="center"
    >
      <AnimatedBall />
      <LoaderWrapper>
        <svg
          width="25"
          height="26"
          viewBox="0 0 25 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23.0998 17.9524C22.2238 19.7398 20.8893 21.2628 19.2324 22.366C17.5755 23.4691 15.6556 24.1129 13.6686 24.2316C11.6816 24.3503 9.6987 23.9397 7.92226 23.0416C6.14581 22.1436 4.63944 20.7903 3.5569 19.1199C2.47435 17.4495 1.85439 15.5217 1.7603 13.5334C1.66621 11.5451 2.10135 9.56742 3.02131 7.80222C3.94127 6.03703 5.3131 4.54754 6.99681 3.48576C8.68051 2.42398 10.6158 1.82793 12.6051 1.75846"
            stroke="url(#paint0_angular)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <radialGradient
              id="paint0_angular"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(12.9977 13.0016) rotate(-2) scale(12)"
            >
              <stop offset="0.744586" stopColor="#00FFDD" />
              <stop offset="1" stopColor="#00FFDD" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </LoaderWrapper>
    </FlexContainer>
  );
};

export default PreloaderButtonMask;

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

const AnimatedBall = styled(FlexContainer)`
  width: 200px;
  height: 200px;
  background: rgba(0, 255, 221, 0.72);
  filter: blur(100px);
  border-radius: 100px;
  position: absolute;
  top: 100%;
  left: 0;
  transition: all .6s ease;
  animation: ${rotateAnimation} 7s linear infinite;
  margin: 0 auto;
  left: 0;
  right: 0;
  transform-origin: top;
`;

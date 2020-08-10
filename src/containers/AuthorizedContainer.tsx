import React, { FC, useEffect } from 'react';
import { FlexContainer, FlexContainerProps } from '../styles/FlexContainer';
import { observer, Observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';

interface Props {}

const AuthorizedContainer: FC<Props> = (props) => {
  const { children } = props;
  const { tabsStore, mainAppStore } = useStores();

  return <FlexContainer>{children}</FlexContainer>;
};
export default AuthorizedContainer;

const TabsLayoutWrapper = styled(FlexContainer)<
  FlexContainerProps & { isExpanded: boolean }
>`
  transform: ${(props) =>
    props.isExpanded ? 'translateX(100%)' : 'translateX(-60px)'};
  backface-visibility: hidden;
  will-change: transform;
  transition: transform 0.7s cubic-bezier(0.77, 0, 0.175, 1);
`;

const SideBarAndPageContentWrapper = styled(FlexContainer)`
  background: radial-gradient(
      92.11% 100% at 0% 0%,
      rgba(255, 252, 204, 0.08) 0%,
      rgba(255, 252, 204, 0) 100%
    ),
    #252636;
  box-shadow: inset 0px 1px 0px rgba(255, 255, 255, 0.08);
  overflow: hidden;
  border-top-left-radius: 8px;
`;

const fadein = keyframes`
    from { 
      opacity: 0;
      visibility: visible;
     }
    to { 
      opacity: 1;
      visibility: visible;
    }
`;

const ResizableContentAnimationWrapper = styled(FlexContainer)`
  visibility: hidden;
  opacity: 0;
  animation: ${fadein} 0.2s forwards 0.3s;
  flex-direction: column;
  height: 100%;
`;

import React, { FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { PrimaryTextSpan } from '../styles/TextsElements';

import IconBack from '../assets/svg/icon-back-btn.svg';
import IconClose from '../assets/svg/profile/icon-account-close.svg';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import SvgIcon from './SvgIcon';
import { useHistory } from 'react-router-dom';
import { FULL_VH } from '../constants/global';

interface Props {
  pageTitle?: string;
  handleGoBack?: any;
  type?: string
  backLink?: string;
}

const BackFlowLayout: FC<Props> = ({ children, pageTitle, backLink, handleGoBack, type }) => {
  const { goBack, push } = useHistory();
  const useIcon = type === 'close' ? IconClose : IconBack;
  const handleClickBack = () => {
    if (backLink) {
      push(backLink);
      return;
    }
    if (handleGoBack) {
      handleGoBack();
    } else {
      goBack();
    }
  }

  return (
    <FlexContainer
      position="relative"
      height={`calc(${FULL_VH})`}
      width="100vw"
      flexDirection="column"
    >
      <PageHeaderWrap>
        <BackButton onClick={handleClickBack}>
          <SvgIcon
            {...useIcon}
            fillColor="rgba(255, 255, 255, 0.6)"
            hoverFillColor="#ffffff"
          />
        </BackButton>
        <PrimaryTextSpan fontSize="16px" color="#ffffff" textTransform="capitalize">
          {pageTitle}
        </PrimaryTextSpan>
      </PageHeaderWrap>

      <PageContainerWrap>{children}</PageContainerWrap>
    </FlexContainer>
  );
};

export default BackFlowLayout;

const BackButton = styled(ButtonWithoutStyles)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 30px;
  z-index: 1;
  position: absolute;
  top: 12px;
  left: 16px;
`;

const PageHeaderWrap = styled(FlexContainer)`
  height: 72px;
  justify-content: center;
  padding-top: 18px;
  width: 100vw;
`;

const PageContainerWrap = styled(FlexContainer)`
  height: calc(100% - 72px);
`;

import styled from '@emotion/styled';
import React from 'react';
import { FC } from 'react';
import Modal from '../components/Modal';
import SvgIcon from '../components/SvgIcon';
import { FULL_VH } from '../constants/global';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import IconClose from '../assets/svg_no_compress/icon-close-popup.svg';
interface Props {
  title: string;
  onClose: () => void;
}

const PopupContainer: FC<Props> = ({ children, title, onClose }) => {
  return (
    <Modal>
      <Wrapper flexDirection="column">
        {/* header */}
        <FlexContainer
          height="48px"
          justifyContent="center"
          alignItems="center"
          position="relative"
        >
          <ClosePopupButton onClick={onClose}>
            <SvgIcon {...IconClose} />
          </ClosePopupButton>
          <PrimaryTextSpan color="#ffffff" fontWeight={500} fontSize="16px">
            {title}
          </PrimaryTextSpan>
        </FlexContainer>
        {/* header */}

        {/* content */}
        <FlexContainer width="100%" height={`calc(${FULL_VH} - 48px)`}>
          {children}
        </FlexContainer>
        {/* content */}
      </Wrapper>
    </Modal>
  );
};

export default PopupContainer;

const ClosePopupButton = styled(ButtonWithoutStyles)`
  position: absolute;
  top: 50%;
  left: 16px;
  z-index: 2;
  transform: translateY(-50%);
`;

const Wrapper = styled(FlexContainer)`
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100vw;
  height: ${`calc(${FULL_VH})`};
  background: #1c1f26;
`;

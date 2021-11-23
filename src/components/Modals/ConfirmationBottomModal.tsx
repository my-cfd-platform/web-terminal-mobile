import { keyframes } from '@emotion/core';
import styled from '@emotion/styled-base';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FULL_VH } from '../../constants/global';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import Modal from '../Modal';

interface Props {
  applyLabel: string;
  labelColor?: string;
  handleApply: () => void;
  handleCancel: () => void;
  show?: boolean;
}

const ConfirmationBottomModal = ({
  applyLabel,
  labelColor,
  handleApply,
  handleCancel,
  show,
}: Props) => {
  const { t } = useTranslation();
  const buttonsWrapRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setRender] = useState(false);

  const closeMofal = () => {
    setRender(false);

    setTimeout(() => {
      handleCancel();
    }, 500);
  };
  const handleClickOutside = (e: any) => {
    if (buttonsWrapRef.current && !buttonsWrapRef.current.contains(e.target)) {
      closeMofal();
    }
  };

  const onAnimationEnd = () => {
    if (!show) {
      setRender(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setRender(!!show);
  }, [show]);

  return show ? (
    <Modal>
      <ModalWrapper
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        width="100vw"
        height={`calc(${FULL_VH})`}
        zIndex="99"
        backgroundColor="rgba(0,0,0,0.4)"
        padding="0 16px 32px 16px"
        flexDirection="column"
        justifyContent="flex-end"
        show={shouldRender}
        onAnimationEnd={onAnimationEnd}
      >
        <ButtonsWrapper
          ref={buttonsWrapRef}
          show={shouldRender}
          onAnimationEnd={onAnimationEnd}
        >
          <ApplyButton onClick={handleApply}>
            <PrimaryTextSpan
              fontSize="16px"
              color={`${labelColor || '#ED145B'}`}
            >
              {t(`${applyLabel}`)}
            </PrimaryTextSpan>
          </ApplyButton>
          <CancelButton onClick={closeMofal}>
            <PrimaryTextSpan fontSize="16px" color="#00FFDD">
              {t('Cancel')}
            </PrimaryTextSpan>
          </CancelButton>
        </ButtonsWrapper>
      </ModalWrapper>
    </Modal>
  ) : null;
};

export default ConfirmationBottomModal;

const translateAnimationIn = keyframes`
  from {
    transform: translateY(1000px);
  }
  to {
    transform: translateY(0);
  }
`;
const translateAnimationOut = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(1000px);
  }
`;

const translateFadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
const translateFadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const ModalWrapper = styled(FlexContainer)<{ show: boolean }>`
  animation: ${(props) => (props.show ? translateFadeIn : translateFadeOut)}
    0.5s ease;
/* 
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    backdrop-filter: blur(1px);
  } */
`;

const ButtonsWrapper = styled(FlexContainer)<{ show: boolean }>`
  width: 100%;
  position: relative;
  z-index: 99;
  flex-direction: column;
  animation: ${(props) =>
      props.show ? translateAnimationIn : translateAnimationOut}
    0.5s ease;
`;

const ApplyButton = styled(ButtonWithoutStyles)`
  background: #222223;
  border-radius: 14px;
  padding: 18px 12px;
  margin-bottom: 8px;
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(37, 37, 37, 0.78);
    backdrop-filter: blur(12px);
  }
`;

const CancelButton = styled(ButtonWithoutStyles)`
  background: #2c2c2e;
  border-radius: 14px;
  padding: 18px 12px;
`;

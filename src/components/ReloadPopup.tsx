import React, { useEffect, FC, useState, useRef } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';
import { FlexContainer } from '../styles/FlexContainer';
import { useTranslation } from 'react-i18next';
import { PrimaryTextParagraph } from '../styles/TextsElements';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { useStores } from '../hooks/useStores';
import LoaderComponent from './LoaderComponent';
import IconCopy from '../assets/svg/icon-copy.svg';
import SvgIcon from './SvgIcon';

interface Props {
  show: boolean;
  isSuccessfull: boolean;
  text?: string;
  toggleNotify: (arg0: boolean) => void;
}

const ReloadPopup: FC<Props> = ({
  show,
  isSuccessfull,
  text = ''
}) => {
  const [shouldRender, setRender] = useState(show);
  const [isActiveNotification, setActive] = useState(true);
  const [copied, setCopied] = useState(false);
  const copyText = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const { badRequestPopupStore } = useStores();

  const handleCopyText = () => {
    if (copyText && copyText.current) {
      copyText.current.select();
      document.execCommand('copy');
      setCopied(true);
    }
  };

  useEffect(() => {
    if (show) {
      setRender(true);
    }
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) {
      setRender(false);
    }
  };

  return shouldRender ? (
    <>
      <NotificationPopupWrap
        flexDirection="column"
        isSuccessfull={isSuccessfull}
        show={isActiveNotification}
        backgroundColor="#23262f"
        width="calc(100% - 60px)"
        margin="0 auto"
        position="fixed"
        padding="20px 24px"
        onAnimationEnd={onAnimationEnd}
        zIndex="999"
        alignItems="center"
      >
        <PrimaryTextParagraph
          fontSize="18px"
          fontWeight={700}
          lineHeight="27px"
          marginBottom="2px"
          color="#fff"
        >
          {t('Something went wrong')}
        </PrimaryTextParagraph>
        <PrimaryTextParagraph
          fontSize="14px"
          color="rgba(255, 255, 255, 0.64)"
          marginBottom="17px"
          fontWeight={500}
          lineHeight="21px"
          textAlign="center"
        >
          {t('Please wait while we processing your request or click \'Reload\'')}
        </PrimaryTextParagraph>
        <LoaderComponent />
        <CustomButton
          onClick={() => {
            badRequestPopupStore.closeModalReload();
            window.location.reload();
          }}
        >
          {t('Reload')}
        </CustomButton>
        <ErrorMessage className={`${copied && 'active'}`}>
          <PrimaryTextParagraph
            fontWeight={500}
            fontSize="14px"
            color="#fff"
          >
            <TextBlockForDev
              ref={copyText}
              value={badRequestPopupStore.requestMessage || 'message is empty'}
              readOnly
            />
          </PrimaryTextParagraph>
          <CustomIcon onClick={handleCopyText}>
            <SvgIcon fillColor="#fff" {...IconCopy} />
          </CustomIcon>
        </ErrorMessage>
      </NotificationPopupWrap>
      <NotificationBackground> </NotificationBackground>
    </>
  ) : null;
};

export default ReloadPopup;

const translateAnimationIn = keyframes`
    from {
      transform: translateY(-1000px);
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
      transform: translateY(-1000px);
    }
`;

const NotificationPopupWrap = styled(FlexContainer)<{
  isSuccessfull: boolean;
  show: boolean;
}>`
  top: 16px;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
`;

const NotificationBackground = styled(FlexContainer)`
  top: 16px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #000000aa;
  z-index: 998;
  position: absolute;
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(18, 21, 28, 0.8);
    backdrop-filter: blur(12px);
  }
`;

const ErrorMessage = styled(FlexContainer)`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 5px;
  padding: 16px;
  width: 100%;
  justify-content: space-between;
  &.active {
    border-color: green;
  }
`;

const CustomButton = styled(ButtonWithoutStyles)`
  border-radius: 5px;
  font-weight: 700;
  background-color: #00fff2;
  width: 100%;
  height: 40px;
  transition: all 0.2s ease;
  margin: 33px 0 16px 0;
  will-change: background-color;

  &:hover {
    background-color: #9ffff2;
  }
`;

const CustomIcon = styled.span`
  margin-top: 2px;
  cursor: pointer;
`;

const TextBlockForDev = styled.input`
  box-sizing: border-box;
  padding-right: 50px;
  outline: none;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 14px;
  width: 100%;
  outline: none;
  &::selection {
    background-color: transparent;
    color: #fffccc;
  }
`;
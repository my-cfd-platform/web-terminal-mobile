import React, {FC, useEffect, useState} from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import BackFlowLayout from '../BackFlowLayout';
import { useStores } from '../../hooks/useStores';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import styled from '@emotion/styled';
import { PrimaryButton } from '../../styles/Buttons';
import Colors from '../../constants/Colors';

interface Props {
  changeStep?: any;
  pageTitle?: string;
  toClosePopup?: any;
  nextPage?: string;
  photo?: any;
  submit?: any;
}

const AccountVerificationPreview: FC<Props> = (props) => {
  const { changeStep, pageTitle, toClosePopup, nextPage, photo, submit } = props;
  const { mainAppStore } = useStores();
  const { t } = useTranslation();
  const { goBack } = useHistory();

  const handleClosePopup = () => {
    toClosePopup();
  };

  const handleSubmitPhoto = () => {
    submit();
  };

  return (
    <PreviewWrapper>
      {/* @ts-ignore */}
      <BackFlowLayout handleGoBack={handleClosePopup} pageTitle={t(pageTitle)}>
        <FlexContainer
          flexDirection="column"
          justifyContent="space-between"
          width="100%"
          height="100%"
        >
          <FlexContainer
            margin={'10px auto 50px'}
            justifyContent={'center'}
            width={'100%'}
            height={'100%'}
            flexDirection={'column'}
          >
            <FlexContainer
              padding={'15px 0'}
              justifyContent={'center'}
              flexDirection={'column'}
              alignItems={'center'}
              width={'100%'}
              marginBottom={'40px'}
            >
              <PrimaryTextSpan
                fontSize="13px"
                color="#ffffff"
                textAlign={'center'}
              >
                {t('Take a photo of the front of your identity card')}
              </PrimaryTextSpan>
            </FlexContainer>
            <FlexContainer
              padding={'0 15px'}
              justifyContent={'center'}
              flexDirection={'column'}
              alignItems={'center'}
              width={'100%'}
              marginBottom={'40px'}
            >
              <ImageElem src={photo} />
            </FlexContainer>
            <PrimaryTextSpan
              fontSize="13px"
              color={Colors.ACCENT}
              textAlign={'center'}
              onClick={handleClosePopup}
            >
              {t('Remove')}
            </PrimaryTextSpan>
          </FlexContainer>
          <FlexContainer
            width="100%"
            alignItems="center"
            justifyContent="center"
            padding="0 16px 40px"
          >
            <PrimaryButton
              padding="12px"
              type="button"
              width="100%"
              onClick={handleSubmitPhoto}
            >
              <PrimaryTextSpan
                color={Colors.BLACK}
                fontWeight="bold"
                fontSize="16px"
              >
                {t('Next')}
              </PrimaryTextSpan>
            </PrimaryButton>
          </FlexContainer>
        </FlexContainer>
      </BackFlowLayout>
    </PreviewWrapper>
  );
};

export default AccountVerificationPreview;

const PreviewWrapper = styled(FlexContainer)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${Colors.DARK_BLACK}
`;

const ImageElem = styled.img`
  display: block;
  object-fit: contain;
  width: 100%;
  max-height: 300px;
  background: #C4C4C4;
  border-radius: 5px;
`;
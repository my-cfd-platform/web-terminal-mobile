import React, { FC, useEffect, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import BackFlowLayout from '../BackFlowLayout';
import { useStores } from '../../hooks/useStores';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import SvgIcon from '../SvgIcon';
import IconVerify from '../../assets/svg/profile/icon-verify.svg';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import styled from '@emotion/styled';
import { PrimaryButton } from '../../styles/Buttons';
import Colors from '../../constants/Colors';

interface Props {
  changeStep: (name: string) => void;
  lastStep: string;
}

const AccountVerificationLargeFile: FC<Props> = (props) => {
  const { changeStep, lastStep } = props;
  const { mainAppStore } = useStores();
  const { t } = useTranslation();

  return (
    <BackFlowLayout
      handleGoBack={() => changeStep(lastStep)}
      type="close"
      pageTitle={t('Proof of Identity')}
    >
      <FlexContainer
        flexDirection="column"
        justifyContent="space-between"
        width="100%"
        height="100%"
      >
        <FlexContainer
          margin="10px auto 100px"
          justifyContent="center"
          width="100%"
          height="100%"
          flexDirection="column"
        >
          <FlexContainer
            padding="0 30px"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
            width="100%"
            marginBottom="40px"
          >
            <FlexContainer
              width="138px"
              height="138px"
              backgroundColor={Colors.RED}
              borderRadius="50%"
              justifyContent="center"
              alignItems="center"
              marginBottom="16px"
            >
              <SvgIcon
                width={58}
                height={58}
                {...IconVerify}
                fillColor="#ffffff"
              />
            </FlexContainer>
            <PrimaryTextSpan
              fontSize="18px"
              color="#ffffff"
              textAlign="center"
              marginBottom="10px"
            >
              {t('The file is too large')}
            </PrimaryTextSpan>
            <FlexContainer>
              <PrimaryTextSpan
                fontSize="13px"
                color="rgba(255, 255, 255, 0.4)"
                textAlign="center"
                marginRight="7px"
              >
                {t('Allowed maximum size is')}
              </PrimaryTextSpan>
              <PrimaryTextSpan
                fontSize="13px"
                color={Colors.ACCENT}
                textAlign="center"
              >
                {t('5MB')}
              </PrimaryTextSpan>
            </FlexContainer>
          </FlexContainer>
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
            onClick={() => changeStep(lastStep)}
            backgroundColor={Colors.ACCENT}
          >
            <PrimaryTextSpan
              color={Colors.BLACK}
              fontWeight="bold"
              fontSize="16px"
            >
              {t('Try again')}
            </PrimaryTextSpan>
          </PrimaryButton>
        </FlexContainer>
      </FlexContainer>
    </BackFlowLayout>
  );
};

export default AccountVerificationLargeFile;

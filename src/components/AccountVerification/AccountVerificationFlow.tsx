import React, {FC, useEffect, useState} from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import BackFlowLayout from '../BackFlowLayout';
import { useStores } from '../../hooks/useStores';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import styled from '@emotion/styled';
import SvgIcon from '../SvgIcon';
import IconChecked from '../../assets/svg/profile/icon-checked.svg';
import { PrimaryButton } from '../../styles/Buttons';
import Colors from '../../constants/Colors';
import accountVerifySteps from '../../constants/accountVerifySteps';

interface Props {
  changeStep?: any;
}

const AccountVerificationFlow: FC<Props> = (props) => {
  const { changeStep } = props;
  const { mainAppStore } = useStores();
  const { t } = useTranslation();

  return (
    <BackFlowLayout type={'close'} pageTitle={t('Verification Flow')}>
      <FlexContainer
        flexDirection="column"
        justifyContent="space-between"
        width="100%"
        height="100%"
      >
        <FlexContainer
          margin={'40px auto 0'}
          justifyContent={'center'}
          width={'100%'}
          flexDirection={'column'}
        >
          <FlexContainer
            padding={'0 15px'}
            justifyContent={'center'}
            flexDirection={'column'}
            width={'100%'}
            marginBottom={'40px'}
          >
            <PrimaryTextSpan
              fontSize="24px"
              color="#ffffff"
              textAlign={'center'}
              marginBottom={'10px'}
            >
              {t('Identity Confirmation')}
            </PrimaryTextSpan>
            <PrimaryTextSpan
              fontSize="13px"
              color="#ffffff"
              textAlign={'center'}
            >
              {t('In accordance with the KYC and AML Policy, you are required to pass the verification process.')}
            </PrimaryTextSpan>
          </FlexContainer>
          <FlexContainer
            flexDirection={'column'}
            width={'100%'}
            marginBottom={'40px'}
          >
            <VerificationText
              fontSize="13px"
              color="rgba(255, 255, 255, 0.4)"
              marginBottom={'10px'}
            >
              {t('Verification Flow')}
            </VerificationText>
            <VerificationStep>
              <FlexContainer alignItems="center">
                <FlexContainer
                  width="28px"
                  height="28px"
                  backgroundColor="#ffffff"
                  borderRadius="50%"
                  justifyContent="center"
                  alignItems="center"
                  marginRight="14px"
                >
                  <SvgIcon width={12} height={12} {...IconChecked} fillColor="rgba(42, 45, 56, 0.5)" />
                </FlexContainer>
                <PrimaryTextSpan
                  color="#ffffff"
                  fontSize="16px"
                  fontWeight="normal"
                >
                  {t('Proof of Identity')}
                </PrimaryTextSpan>
              </FlexContainer>
            </VerificationStep>
            <VerificationStep>
              <FlexContainer alignItems="center">
                <FlexContainer
                  width="28px"
                  height="28px"
                  backgroundColor="#ffffff"
                  borderRadius="50%"
                  justifyContent="center"
                  alignItems="center"
                  marginRight="14px"
                >
                  <SvgIcon width={12} height={12} {...IconChecked} fillColor="rgba(42, 45, 56, 0.5)" />
                </FlexContainer>
                <PrimaryTextSpan
                  color="#ffffff"
                  fontSize="16px"
                  fontWeight="normal"
                >
                  {t('Proof of Residence')}
                </PrimaryTextSpan>
              </FlexContainer>
            </VerificationStep>
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
            onClick={() => changeStep(accountVerifySteps.VERIFICATION_IDENTIFY)}
          >
            <PrimaryTextSpan
              color={Colors.BLACK}
              fontWeight="bold"
              fontSize="16px"
            >
              {t('Start')}
            </PrimaryTextSpan>
          </PrimaryButton>
        </FlexContainer>
      </FlexContainer>
    </BackFlowLayout>
  );
};

export default AccountVerificationFlow;

const VerificationText = styled(PrimaryTextSpan)`
  text-transform: uppercase;
  margin-left: 15px;
`;

const VerificationStep = styled(FlexContainer)`
  display: flex;
  align-items: center;
  height: 50px;
  padding: 8px 16px;
  text-decoration: none;
  background-color: rgba(42, 45, 56, 0.5);
  margin-bottom: 1px;
`;

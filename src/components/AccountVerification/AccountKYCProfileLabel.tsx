import styled from '@emotion/styled-base';
import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';

import IconArrowLink from '../../assets/svg/profile/icon-arrow-link.svg';
import IconNotVerify from '../../assets/svg_no_compress/kyc/not-verify.svg';
import IconInReview from '../../assets/svg_no_compress/kyc/in-review.svg';
import IconCompleted from '../../assets/svg_no_compress/kyc/completed.svg';
import IconRestricted from '../../assets/svg_no_compress/kyc/restricted.svg';

import SvgIcon from '../SvgIcon';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../hooks/useStores';
import { useTranslation } from 'react-i18next';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import Page from '../../constants/Pages';
import { useHistory } from 'react-router';
import { PersonalDataKYCEnum } from '../../enums/PersonalDataKYCEnum';

const AccountKYCProfileLabel = observer(() => {
  const { userProfileStore } = useStores();
  const { t } = useTranslation();
  const { push } = useHistory();
  // userProfileStore.userProfile?.kyc === PersonalDataKYCEnum.NotVerified

  const handlePushToKYC = () => push(Page.ACCOUNT_VERIFICATION);

  switch (userProfileStore.userProfile?.kyc) {
    //
    case PersonalDataKYCEnum.NotVerified:
      return (
        <KYCLabel onClick={handlePushToKYC} className="isLink">
          <FlexContainer alignItems="center">
            <FlexContainer marginRight="12px">
              <SvgIcon {...IconNotVerify} />
            </FlexContainer>
            <PrimaryTextSpan fontSize="16px" color="#ffffff">
              {t('Verification')}
            </PrimaryTextSpan>
          </FlexContainer>

          <FlexContainer alignItems="center">
            <PrimaryTextSpan
              color="rgba(255, 255, 255, 0.64)"
              fontSize="14px"
              fontWeight={500}
              textTransform="capitalize"
              marginRight="12px"
            >
              {t('Fill in personal details')}
            </PrimaryTextSpan>
            <SvgIcon {...IconArrowLink} fillColor="rgba(196, 196, 196, 0.5)" />
          </FlexContainer>
        </KYCLabel>
      );
    //
    case PersonalDataKYCEnum.OnVerification:
      return (
        <KYCLabel>
          <FlexContainer alignItems="center">
            <FlexContainer marginRight="12px">
              <SvgIcon {...IconInReview} />
            </FlexContainer>

            <PrimaryTextSpan fontSize="16px" color="#ffffff">
              {t('Verification')}
            </PrimaryTextSpan>
          </FlexContainer>

          <PrimaryTextSpan
            color="#FFFCCC"
            fontSize="14px"
            fontWeight={500}
            textTransform="capitalize"
          >
            {t('In review')}
          </PrimaryTextSpan>
        </KYCLabel>
      );
    //
    case PersonalDataKYCEnum.Restricted:
      return (
        <KYCLabel>
          <FlexContainer alignItems="center">
            <FlexContainer marginRight="12px">
              <SvgIcon {...IconRestricted} />
            </FlexContainer>
            <PrimaryTextSpan fontSize="16px" color="#ffffff">
              {t('Verification')}
            </PrimaryTextSpan>
          </FlexContainer>
          <PrimaryTextSpan
            color="#ED145B"
            fontSize="14px"
            fontWeight={500}
            textTransform="capitalize"
          >
            {t('Restricted')}
          </PrimaryTextSpan>
        </KYCLabel>
      );
    //
    case PersonalDataKYCEnum.Verified:
      return (
        <KYCLabel>
          <FlexContainer alignItems="center">
            <FlexContainer marginRight="12px">
              <SvgIcon {...IconCompleted} />
            </FlexContainer>
            <PrimaryTextSpan fontSize="16px" color="#ffffff">
              {t('Verification')}
            </PrimaryTextSpan>
          </FlexContainer>
          <PrimaryTextSpan
            color="#00FFDD"
            fontSize="14px"
            fontWeight={500}
            textTransform="capitalize"
          >
            {t('Completed')}
          </PrimaryTextSpan>
        </KYCLabel>
      );
    //
    default:
      return null;
  }
});

export default AccountKYCProfileLabel;

const KYCLabel = styled(FlexContainer)`
  background-color: #252933;
  margin-bottom: 16px;
  padding: 13px 16px;
  align-items: center;
  justify-content: space-between;

  &.isLink {
    &:active,
    &:hover {
      cursor: pointer;
      background: linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.1),
          rgba(255, 255, 255, 0.1)
        ),
        rgba(42, 45, 56, 0.5);
    }
  }
`;

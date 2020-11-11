import React, { FC } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import BackFlowLayout from '../BackFlowLayout';
import { useStores } from '../../hooks/useStores';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import SvgIcon from '../SvgIcon';
import IconChecked from '../../assets/svg/profile/icon-checked.svg';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { PrimaryButton } from '../../styles/Buttons';
import Colors from '../../constants/Colors';

interface Props {
  changeStep: (name: string) => void;
}

const AccountVerificationSuccess: FC<Props> = () => {
  const { t } = useTranslation();
  const { goBack } = useHistory();

  return (
    <BackFlowLayout type={'close'} pageTitle={t('Verification Flow')}>
      <FlexContainer
        flexDirection="column"
        justifyContent="space-between"
        width="100%"
        height="100%"
      >
        <FlexContainer
          margin={'10px auto 100px'}
          justifyContent={'center'}
          width={'100%'}
          height={'100%'}
          flexDirection={'column'}
        >
          <FlexContainer
            padding={'0 30px'}
            justifyContent={'center'}
            flexDirection={'column'}
            alignItems={'center'}
            width={'100%'}
            marginBottom={'40px'}
          >
            <FlexContainer
              width="138px"
              height="138px"
              backgroundColor={Colors.ACCENT_BLUE}
              borderRadius="50%"
              justifyContent="center"
              alignItems="center"
              marginBottom="16px"
            >
              <SvgIcon
                width={50}
                height={38}
                {...IconChecked}
                fillColor={Colors.DARK_BLACK}
              />
            </FlexContainer>
            <PrimaryTextSpan
              fontSize="18px"
              color="#ffffff"
              textAlign={'center'}
            >
              {t('Your info has been submitted')}
            </PrimaryTextSpan>
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
            onClick={goBack}
          >
            <PrimaryTextSpan
              color={Colors.BLACK}
              fontWeight="bold"
              fontSize="16px"
            >
              {t('Back to settings')}
            </PrimaryTextSpan>
          </PrimaryButton>
        </FlexContainer>
      </FlexContainer>
    </BackFlowLayout>
  );
};

export default AccountVerificationSuccess;

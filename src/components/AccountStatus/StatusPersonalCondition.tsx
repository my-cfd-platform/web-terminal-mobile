import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import IconPersonalCondition from '../../assets/svg_no_compress/account-status/icon-personal-condition.svg';
import SvgIcon from '../SvgIcon';
const StatusPersonalCondition = () => {
  const { t } = useTranslation();
  return (
    <FlexContainer
      marginBottom="16px"
      padding="16px 24px"
      backgroundColor="rgba(255, 255, 255, 0.04)"
      border="1px solid rgba(255, 255, 255, 0.12)"
      alignItems="center"
    >
      <FlexContainer>
        <SvgIcon {...IconPersonalCondition} />
      </FlexContainer>
      <FlexContainer flexDirection="column" padding="0 0 0 16px" flex="1">
        <PrimaryTextSpan color="#FFFCCC" fontSize="14px" fontWeight="bold" marginBottom="4px">
          {t('Personalized conditions')}
        </PrimaryTextSpan>
        <PrimaryTextSpan color="rgba(255, 255, 255, 0.64)" fontSize="12px">
          {t('Exclusive from')} $100,000
        </PrimaryTextSpan>
      </FlexContainer>
    </FlexContainer>
  );
};

export default StatusPersonalCondition;

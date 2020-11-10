import React from 'react';
import { useTranslation } from 'react-i18next';
import BackFlowLayout from '../components/BackFlowLayout';
import SlideCheckbox from '../components/SlideCheckbox';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';

const PositionEditSL = () => {
  const { t } = useTranslation();
  return (
    <BackFlowLayout pageTitle={'Stop Loss'}>
      <FlexContainer width="100%" flexDirection="column">
        <FlexContainer
          backgroundColor="rgba(42, 45, 56, 0.5)"
          height="50px"
          justifyContent="space-between"
          alignItems="center"
          padding="0 16px"
          marginBottom="1px"
        >
          <PrimaryTextSpan color="#ffffff" fontSize="16px">
            {t('Stop Loss')}
          </PrimaryTextSpan>
          
          <SlideCheckbox isActive={false} handleClick={(on) => console.log(on)}/>
        </FlexContainer>
      </FlexContainer>
    </BackFlowLayout>
  );
};

export default PositionEditSL;

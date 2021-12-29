import styled from '@emotion/styled';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonWithoutStyles } from '../../../styles/ButtonWithoutStyles';
import { FlexContainer } from '../../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../../styles/TextsElements';
import IconCheck from '../../../assets/svg_no_compress/kyc/icon-check.svg';
import SvgIcon from '../../SvgIcon';
import { KYCdocumentTypeEnum } from '../../../enums/KYC/KYCdocumentTypeEnum';
import { useStores } from '../../../hooks/useStores';
import { observer } from 'mobx-react-lite';

const AccountVerificationsList = observer(() => {
  const { t } = useTranslation();
  const { kycStore } = useStores();

  const items = [
    {
      type: KYCdocumentTypeEnum.IDENTITY_DOCUMENT,
      title: 'Identity Document (Required)',
      description:
        'Please upload one of identity document - Passport, Driving Licence or ID Card',
    },
    {
      type: KYCdocumentTypeEnum.PROOF_OF_ADRESS,
      title: 'Proof of Address (Required)',
      description:
        'The document must contain your name, address and date created less than 3 months old',
    },
    {
      type: KYCdocumentTypeEnum.BANK_CARD,
      title: 'Bank Card (For card payments only)',
      description:
        'If you make a deposit using a bank card, you need to confirm that it belongs to you',
    },
    {
      type: KYCdocumentTypeEnum.ADDITIONAL_DOCUMENT,
      title: 'Additional documents (Upon the request)',
      description:
        'Proof of Payment, Proof of Wire Transfer (Invoice), Card Authorization Form',
    },
  ];

  const isFilledItem = useCallback(
    (type: KYCdocumentTypeEnum) => {
      console.log('change list');
      return (
        kycStore.filledSteps !== null && kycStore.filledSteps.includes(type)
      );
    },
    [kycStore.filledSteps]
  );

  const handleClickStart = (type: KYCdocumentTypeEnum) => {
    kycStore.setActiveStep(type);
  };

  return (
    <FlexContainer flex="1" flexDirection="column" padding="16px">
      {items.map((item, index) => (
        <FlexContainer
          key={item.title}
          backgroundColor="#384250"
          borderRadius="10px"
          marginBottom="16px"
        >
          <FlexContainer padding="12px">
            {isFilledItem(item.type) ? (
              <SvgIcon {...IconCheck} />
            ) : (
              <FlexContainer
                width="32px"
                height="32px"
                borderRadius="50%"
                justifyContent="center"
                alignItems="center"
                backgroundColor="rgba(255, 255, 255, 0.04)"
                border="1px solid rgba(255, 255, 255, 0.12)"
              >
                <PrimaryTextSpan
                  color="#ffffff"
                  fontSize="16px"
                  fontWeight={500}
                  lineHeight="1"
                >
                  {index + 1}
                </PrimaryTextSpan>
              </FlexContainer>
            )}
          </FlexContainer>

          <FlexContainer flexDirection="column" padding="16px 0">
            <TextBlock>
              <PrimaryTextSpan
                color="#ffffff"
                fontWeight={600}
                fontSize="16px"
                marginBottom="8px"
              >
                {item.title}
              </PrimaryTextSpan>
              <PrimaryTextSpan
                color="#ffffff"
                fontSize="13px"
                marginBottom="16px"
              >
                {item.description}
              </PrimaryTextSpan>
            </TextBlock>

            <FlexContainer padding="16px 0 0">
              <ButtonWithoutStyles onClick={() => handleClickStart(item.type)}>
                <PrimaryTextSpan
                  color="#00FFDD"
                  fontWeight={600}
                  fontSize="16px"
                >
                  {isFilledItem(item.type) ? t('Edit') : t('Start')}
                </PrimaryTextSpan>
              </ButtonWithoutStyles>
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      ))}
    </FlexContainer>
  );
});

export default AccountVerificationsList;

const TextBlock = styled(FlexContainer)`
  flex-direction: column;
  padding-right: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
`;

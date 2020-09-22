import React, { FC } from 'react';
import styled from '@emotion/styled';

import FailImage from '../../assets/images/fail.png';
import { FlexContainer } from '../../styles/FlexContainer';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { useHistory } from 'react-router-dom';
import Pages from '../../constants/Pages';
import HashLocation from '../../constants/hashLocation';
import { useTranslation } from 'react-i18next';

const DepositPaymentFail: FC = () => {
  const { push } = useHistory();
  const { t } = useTranslation();
  return (
    <>
      <FlexContainer
        flexDirection="column"
        alignItems="center"
        marginBottom="112px"
      >
        <FlexContainer justifyContent={'center'} alignItems={'center'} marginBottom="40px">
          <img src={FailImage} width={138} />
        </FlexContainer>
        <FailText>{t('Failed')}</FailText>
        <FailDescription>
          {t('Something went wrong.')}
          <br />
          {t('Try again or use another payment method.')}
        </FailDescription>
      </FlexContainer>
      <FlexContainer padding="0 16px" width="100%">
        <OtherMethodsButton
          onClick={() => {
            push(Pages.DASHBOARD);
          }}
        >
          {t('Trade')}
        </OtherMethodsButton>
      </FlexContainer>
    </>
  );
};

export default DepositPaymentFail;

const OtherMethodsButton = styled(ButtonWithoutStyles)`
  background-color: #00ffdd;
  border-radius: 10px;
  width: 100%;
  padding: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #252636;
`;

const FailText = styled.span`
  font-weight: 500;
  font-size: 18px;
  line-height: 18px;
  text-align: center;
  color: #ffffff;
  margin-bottom: 18px;
`;

const FailDescription = styled.span`
  font-size: 13px;
  line-height: 16px;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
`;

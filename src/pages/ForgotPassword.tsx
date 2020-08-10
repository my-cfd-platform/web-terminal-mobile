import React from 'react';
import BackFlowLayout from '../components/BackFlowLayout';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import InputField from '../components/InputField';
import Fields from '../constants/fields';
import { PrimaryButton } from '../styles/Buttons';
import Colors from '../constants/Colors';
import { PrimaryTextSpan } from '../styles/TextsElements';

const ForgotPassword = () => {
  return (
    <BackFlowLayout pageTitle="Forgot Password">
      <FlexContainer
        minHeight="100%"
        flexDirection="column"
        justifyContent="space-between"
      >
        <FlexContainer flexDirection="column" width="100vw" height="calc(100% - 82px)" justifyContent="center">
          <CustomForm>
            <InputField
              id={Fields.EMAIL}
              name={Fields.EMAIL}
              placeholder="Email"
              type="email"
            />
          </CustomForm>
        </FlexContainer>
        <FlexContainer width="100vw" padding="0 16px" marginBottom="26px">
          <PrimaryButton
            padding="12px"
            type="submit"
            width="100%"
            // onClick={handlerClickSubmit}
            // disabled={true}
          >
            <PrimaryTextSpan
              color={Colors.BLACK}
              fontWeight="bold"
              fontSize="16px"
            >
              Confirm
            </PrimaryTextSpan>
          </PrimaryButton>
        </FlexContainer>
      </FlexContainer>
    </BackFlowLayout>
  );
};

export default ForgotPassword;

const CustomForm = styled.form`
  width: 100%;
  margin: 20px 0;
`;

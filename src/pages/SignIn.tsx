import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import SignFlowLayout from '../components/SignFlowLayout';
import SignTypeTabs from '../components/SignTypeTabs';
import styled from '@emotion/styled';
import InputField from '../components/InputField';
import Fields from '../constants/fields';
import { Link } from 'react-router-dom';
import Page from '../constants/Pages';
import Colors from '../constants/Colors';
import { PrimaryButton } from '../styles/Buttons';
import { PrimaryTextSpan } from '../styles/TextsElements';

const SignIn = () => {
  return (
    <SignFlowLayout>
      <FlexContainer
        flexDirection="column"
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        minHeight="calc(100vh - 100px)"
        maxHeight="calc(100vh - 100px)"
      >
        <FlexContainer flexDirection="column" alignItems="center" width="100%">
          <SignTypeTabs />

          <CustomForm>
            <InputField
              id={Fields.EMAIL}
              name={Fields.EMAIL}
              placeholder="Email"
              type="email"
            />
            <InputField
              id={Fields.PASSWORD}
              name={Fields.PASSWORD}
              placeholder="Password"
              type="password"
            />
          </CustomForm>

          <FlexContainer
            alignItems="center"
            justifyContent="center"
            marginBottom="24px"
          >
            <LinkForgot to={Page.FORGOT_PASSWORD}>Forgot password?</LinkForgot>
          </FlexContainer>
        </FlexContainer>

        <FlexContainer flexDirection="column">
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
                Log In
              </PrimaryTextSpan>
            </PrimaryButton>
          </FlexContainer>

          <FlexContainer alignItems="center" justifyContent="center" padding="0 0 40px 0">
            <PrimaryTextSpan color={Colors.INPUT_LABEL_TEXT}>Don`t have an account yet?</PrimaryTextSpan>&nbsp;
            <StyledLink to={Page.SIGN_UP}>Sign Up</StyledLink>
          </FlexContainer>
        </FlexContainer>

      </FlexContainer>
    </SignFlowLayout>
  );
};

export default SignIn;

const CustomForm = styled.form`
  width: 100%;
`;

const StyledLink = styled(Link)`
font-size: 13px;
  color: ${Colors.ACCENT};
  text-decoration: none;
  font-weight: 500;
  transition: all 0.4s ease;
  &:hover {
    text-decoration: none;
    color: #ffffff;
  }
`;


const LinkForgot = styled(Link)`
  font-size: 13px;
  color: ${Colors.ACCENT};
  text-decoration: none;
  font-weight: 500;
  transition: all 0.4s ease;
  &:hover {
    text-decoration: none;
    color: #ffffff;
  }
`;

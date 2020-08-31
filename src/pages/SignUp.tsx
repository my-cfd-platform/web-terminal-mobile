import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useStores } from '../hooks/useStores';
import styled from '@emotion/styled';
import * as yup from 'yup';
import { FormikHelpers, useFormik } from 'formik';

import { UserRegistration } from '../types/UserInfo';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';

import Colors from '../constants/Colors';
import Page from '../constants/Pages';
import Fields from '../constants/fields';
import validationInputTexts from '../constants/validationInputTexts';
import apiResponseCodeMessages from '../constants/apiResponseCodeMessages';

import SignTypeTabs from '../components/SignTypeTabs';
import InputField from '../components/InputField';
import Checkbox from '../components/Checkbox';

import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryButton } from '../styles/Buttons';
import { PrimaryTextSpan } from '../styles/TextsElements';

const SignUp = () => {
  const { push } = useHistory();
  const [validateAssigments, setValitdateAssigments] = useState(false);
  const { mainAppStore, notificationStore, badRequestPopupStore } = useStores();

  const validationSchema = yup.object().shape<UserRegistration>({
    email: yup
      .string()
      .required(validationInputTexts.EMAIL)
      .email(validationInputTexts.EMAIL),
    password: yup
      .string()
      .required(validationInputTexts.REQUIRED_FIELD)
      .min(8, validationInputTexts.PASSWORD_MIN_CHARACTERS)
      .max(31, validationInputTexts.PASSWORD_MAX_CHARACTERS)
      .matches(/^(?=.*\d)(?=.*[a-zA-Z])/, validationInputTexts.PASSWORD_MATCH),
    userAgreement: yup
      .bool()
      .oneOf([true], validationInputTexts.USER_AGREEMENT),
    captcha: yup.string(),
  });

  const initialValues: UserRegistration = {
    email: '',
    password: '',
    userAgreement: false,
    captcha: '',
  };

  const handleSubmitForm = async (
    { email, password }: UserRegistration,
    { setStatus, setSubmitting }: FormikHelpers<UserRegistration>
  ) => {
    setSubmitting(true);
    mainAppStore.isInitLoading = true;

    try {
      const result = await mainAppStore.signUp({
        email,
        password,
        captcha: 'qewqeqwe',
      });
      if (result !== OperationApiResponseCodes.Ok) {
        notificationStore.notificationMessage = apiResponseCodeMessages[result];
        notificationStore.isSuccessfull = false;
        notificationStore.openNotification();
        mainAppStore.isInitLoading = false;
      } else {
        push(Page.DASHBOARD);
      }
    } catch (error) {
      badRequestPopupStore.openModal();
      badRequestPopupStore.setMessage(error);
      setStatus(error);
      setSubmitting(false);
      mainAppStore.isInitLoading = false;
    }
  };

  const {
    values,
    setFieldError,
    setFieldValue,
    validateForm,
    handleSubmit,
    handleChange,
    errors,
    touched,
    isSubmitting,
  } = useFormik({
    initialValues,
    onSubmit: handleSubmitForm,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: true,
  });

  const handleChangeUserAgreements = (setFieldValue: any) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFieldValue(Fields.USER_AGREEMENT, e.target.checked);
    e.target.checked
      ? setFieldError(Fields.USER_AGREEMENT, '')
      : setFieldError(
          Fields.USER_AGREEMENT,
          validationInputTexts.USER_AGREEMENT
        );
  };

  const handlerClickSubmit = async () => {
    const curErrors = await validateForm();
    const curErrorsKeys = Object.keys(curErrors);
    if (curErrorsKeys.length) {
      const el = document.getElementById(curErrorsKeys[0]);
      if (el) el.focus();
    }
    if (
      curErrorsKeys.length === 1 &&
      curErrorsKeys.includes(Fields.USER_AGREEMENT)
    ) {
      setValitdateAssigments(true);
      setFieldError(Fields.USER_AGREEMENT, '');
    }
  };

  return (
    <FlexContainer
      flexDirection="column"
      width="100%"
      height="100%"
      alignItems="center"
      justifyContent="space-between"
    >
      <CustomForm noValidate onSubmit={handleSubmit}>
        <FlexContainer flexDirection="column" alignItems="center" width="100%">
          <SignTypeTabs />

          <InputField
            id={Fields.EMAIL}
            name={Fields.EMAIL}
            onChange={handleChange}
            value={values.email || ''}
            placeholder="Email"
            type="email"
            hasError={!!(touched.email && errors.email)}
            errorText={errors.email}
          />
          <InputField
            id={Fields.PASSWORD}
            name={Fields.PASSWORD}
            value={values.password || ''}
            onChange={handleChange}
            placeholder="Password"
            type="password"
            hasError={!!(touched.email && errors.email)}
            errorText={errors.email}
          />

          <FlexContainer padding="14px 16px 0" marginBottom="24px">
            <Checkbox
              id="user-agreements"
              checked={values.userAgreement}
              onChange={handleChangeUserAgreements(setFieldValue)}
              hasError={!!(validateAssigments && errors.userAgreement)}
              errorText={errors.userAgreement}
            >
              <PrimaryTextSpan
                color={Colors.INPUT_LABEL_TEXT}
                fontSize="11px"
                lineHeight="1.6"
              >
                I’m 18 years old, and agree to &nbsp;
                <StyledLink fontSize="11px" to={Page.SIGN_IN}>
                  Terms & Conditions
                </StyledLink>
                &nbsp; and &nbsp;
                <StyledLink fontSize="11px" to={Page.SIGN_IN}>
                  Privacy Policy
                </StyledLink>
                &nbsp;
              </PrimaryTextSpan>
            </Checkbox>
          </FlexContainer>
        </FlexContainer>

        <FlexContainer flexDirection="column">
          <FlexContainer width="100vw" padding="0 16px" marginBottom="26px">
            <PrimaryButton
              padding="12px"
              type="submit"
              width="100%"
              disabled={isSubmitting}
              onClick={handlerClickSubmit}
            >
              <PrimaryTextSpan
                color={Colors.BLACK}
                fontWeight="bold"
                fontSize="16px"
              >
                Sign Up
              </PrimaryTextSpan>
            </PrimaryButton>
          </FlexContainer>

          <FlexContainer
            alignItems="center"
            justifyContent="center"
            padding="0 0 40px 0"
          >
            <PrimaryTextSpan color={Colors.INPUT_LABEL_TEXT}>
              Already have account?
            </PrimaryTextSpan>
            &nbsp;
            <StyledLink to={Page.SIGN_IN}>Log In</StyledLink>
          </FlexContainer>
        </FlexContainer>
      </CustomForm>
    </FlexContainer>
  );
};

export default SignUp;

const CustomForm = styled.form`
  margin: 0;
`;

const StyledLink = styled(Link)<{ fontSize?: string }>`
  font-size: ${(props) => props.fontSize || '13px'};
  color: ${Colors.ACCENT};
  text-decoration: none;
  font-weight: 500;
  transition: all 0.4s ease;
  &:hover {
    text-decoration: none;
    color: #ffffff;
  }
`;

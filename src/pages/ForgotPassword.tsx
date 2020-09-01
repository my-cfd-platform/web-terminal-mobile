import React, { useState } from 'react';
import * as yup from 'yup';
import { FormikHelpers, useFormik } from 'formik';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useHistory, Link } from 'react-router-dom';

import { useStores } from '../hooks/useStores';
import API from '../helpers/API';

import Fields from '../constants/fields';
import Colors from '../constants/Colors';
import validationInputTexts from '../constants/validationInputTexts';

import { UserForgotPassword } from '../types/UserInfo';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';

import InputField from '../components/InputField';
import BackFlowLayout from '../components/BackFlowLayout';
import SvgIcon from '../components/SvgIcon';

import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { PrimaryButton } from '../styles/Buttons';

import CheckDone from '../assets/images/success-send.png';
import Page from '../constants/Pages';
import LoaderForComponents from '../components/LoaderForComponents';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const { push } = useHistory();
  const { mainAppStore } = useStores();
  const validationSchema = yup.object().shape<UserForgotPassword>({
    email: yup
      .string()
      .required(t(validationInputTexts.EMAIL))
      .email(t(validationInputTexts.EMAIL)),
  });

  const initialValues: UserForgotPassword = {
    email: '',
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessfull] = useState(false);

  const handleSubmitForm = async (
    { email }: UserForgotPassword,
    { setSubmitting }: FormikHelpers<UserForgotPassword>
  ) => {
    try {
      setIsLoading(true);
      setSubmitting(true);

      const result = await API.forgotEmail(email);

      if (result.result === OperationApiResponseCodes.Ok) {
        setIsSuccessfull(true);
      } else {
        setSubmitting(false);
        setIsSuccessfull(false);
      }
      setIsLoading(false);
    } catch (error) {
      setSubmitting(false);
      setIsLoading(false);
    }
  };

  const {
    values,
    validateForm,
    handleSubmit,
    handleChange,
    errors,
    touched,
    isSubmitting,
    submitForm,
  } = useFormik({
    initialValues,
    onSubmit: handleSubmitForm,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: true,
  });

  const handlerClickSubmit = async () => {
    const curErrors = await validateForm();
    const curErrorsKeys = Object.keys(curErrors);
    if (curErrorsKeys.length) {
      const el = document.getElementById(curErrorsKeys[0]);
      if (el) el.focus();
    }
    submitForm();
  };

  return (
    <BackFlowLayout pageTitle="Forgot Password">
      {isSuccessful && <DoneBtn to={Page.SIGN_IN}>Done</DoneBtn>}

      <FlexContainer
        minHeight="100%"
        flexDirection="column"
        justifyContent="space-between"
      >
        {isLoading && <LoaderForComponents isLoading={isLoading} />}

        <FlexContainer
          flexDirection="column"
          width="100vw"
          height="calc(100% - 82px)"
          justifyContent="center"
        >
          {!isSuccessful && (
            <CustomForm noValidate onSubmit={handleSubmit}>
              <InputField
                id={Fields.EMAIL}
                name={Fields.EMAIL}
                placeholder="Email"
                type="email"
                value={values.email || ''}
                onChange={handleChange}
                hasError={!!(touched.email && errors.email)}
                errorText={errors.email}
              />
            </CustomForm>
          )}

          {isSuccessful && (
            <FlexContainer flexDirection="column" alignItems="center">
              <FlexContainer marginBottom="36px">
                <img src={CheckDone} alt="" width="136px" height="136px" />
              </FlexContainer>

              <PrimaryTextSpan
                color="#ffffff"
                fontSize="16px"
                fontWeight="bold"
                marginBottom="18px"
              >
                Check your email
              </PrimaryTextSpan>
              <PrimaryTextSpan
                color="rgba(255, 255, 255, 0.4)"
                fontSize="13px"
                textAlign="center"
              >
                We’ve sent you a link to create
                <br />a new password
              </PrimaryTextSpan>
            </FlexContainer>
          )}

        </FlexContainer>

        <FlexContainer width="100vw" padding="0 16px" marginBottom="26px">
          {!isSuccessful && (
            <PrimaryButton
              padding="12px"
              type="button"
              width="100%"
              onClick={handlerClickSubmit}
              disabled={isSubmitting}
            >
              <PrimaryTextSpan
                color={Colors.BLACK}
                fontWeight="bold"
                fontSize="16px"
              >
                {t('Confirm')}
              </PrimaryTextSpan>
            </PrimaryButton>
          )}

          {isSuccessful && (
            <CustomLink
              to={{
                pathname: `//${values.email}`,
              }}
              target="_blank"
            >
              <PrimaryTextSpan
                color={Colors.BLACK}
                fontWeight="bold"
                fontSize="16px"
              >
                Open Mail
              </PrimaryTextSpan>
            </CustomLink>
          )}
        </FlexContainer>
      </FlexContainer>
    </BackFlowLayout>
  );
};

export default ForgotPassword;

const CustomLink = styled(Link)`
  padding: 12px;
  width: 100%;
  height: 56px;
  background-color: ${Colors.ACCENT_BLUE};
  border-radius: 12px;
  transition: background-color 0.2s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #9ffff2;
    text-decoration: none;
  }
  &:focus {
    background-color: #21b3a4;
    text-decoration: none;
  }
  &:disabled {
    background-color: ${Colors.DISSABLED};
  }
`;

const CustomForm = styled.form`
  width: 100%;
  margin: 20px 0;
`;

const DoneBtn = styled(Link)`
  font-weight: 600;
  font-size: 13px;
  line-height: 18px;
  color: #ffffff;
  text-decoration: none;
  &:hover {
    text-decoration: none;
  }

  position: absolute;
  top: 18px;
  right: 16px;
`;

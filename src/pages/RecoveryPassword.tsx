import React, { useState } from 'react';
import BackFlowLayout from '../components/BackFlowLayout';
import { useTranslation } from 'react-i18next';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { useParams, Link } from 'react-router-dom';
import { useStores } from '../hooks/useStores';
import { IResetPassword } from '../types/UserInfo';
import validationInputTexts from '../constants/validationInputTexts';
import Fields from '../constants/fields';
import API from '../helpers/API';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import mixapanelProps from '../constants/mixpanelProps';
import { useFormik } from 'formik';
import * as yup from 'yup';
import LoaderForComponents from '../components/LoaderForComponents';
import { PrimaryTextSpan, PrimaryTextParagraph } from '../styles/TextsElements';
import CheckDone from '../assets/svg/icon-check-done.svg';
import Page from '../constants/Pages';
import InputField from '../components/InputField';
import Colors from '../constants/Colors';
import { PrimaryButton } from '../styles/Buttons';
import SvgIcon from '../components/SvgIcon';

const RecoveryPassword = () => {
  const { t } = useTranslation();
  const { token } = useParams<{ token: string }>();

  const validationSchema = yup.object().shape<IResetPassword>({
    password: yup
      .string()
      .required(t(validationInputTexts.REQUIRED_FIELD))
      .min(8, t(validationInputTexts.PASSWORD_MIN_CHARACTERS))
      .max(31, t(validationInputTexts.PASSWORD_MAX_CHARACTERS))
      .matches(
        /^(?=.*\d)(?=.*[a-zA-Z])/,
        t(validationInputTexts.PASSWORD_MATCH)
      ),
    repeatPassword: yup
      .string()
      .required(t(validationInputTexts.REPEAT_PASSWORD))
      .oneOf(
        [yup.ref(Fields.PASSWORD), null],
        t(validationInputTexts.REPEAT_PASSWORD_MATCH)
      ),
  });

  const initialValues: IResetPassword = {
    password: '',
    repeatPassword: '',
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessfull] = useState(false);
  const [isNotSuccessful, setNotIsSuccessfull] = useState(false);

  const { badRequestPopupStore, mainAppStore } = useStores();

  const handleSubmitForm = async ({ password }: IResetPassword) => {
    setIsLoading(true);
    try {
      const response = await API.recoveryPassword(
        {
          token: token || '',
          password,
        },
        mainAppStore.initModel.authUrl
      );
      if (response.result === OperationApiResponseCodes.Ok) {
        mixpanel.track(mixpanelEvents.FORGOT_PASSWORD_SET_NEW, {
          [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandName.toLowerCase(),
        });
        setIsSuccessfull(true);
      }
      if (response.result === OperationApiResponseCodes.Expired) {
        setNotIsSuccessfull(true);
      }
      setIsLoading(false);
    } catch (error) {
      badRequestPopupStore.openModal();
      badRequestPopupStore.setMessage(error);
      setIsLoading(false);
      setIsSuccessfull(false);
      setNotIsSuccessfull(false);
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
  };

  return (
    <BackFlowLayout pageTitle={t('Recovery password')}>
      {isLoading && <LoaderForComponents isLoading={isLoading} />}
      <FlexContainer
        height="100%"
        flexDirection="column"
        width="100%"
        justifyContent="center"
      >
        {isSuccessful && (
          <FlexContainer flexDirection="column" padding="16px">
            <PrimaryTextParagraph
              color="#fffccc"
              fontSize="24px"
              fontWeight="bold"
              marginBottom="20px"
            >
              {t('Congratulation')}
            </PrimaryTextParagraph>

            <FlexContainer alignItems="center" padding="20px 0">
              <FlexContainer margin="0 20px 0 0">
                <SvgIcon {...CheckDone} fillColor="#005E5E" />
              </FlexContainer>
              <PrimaryTextParagraph color="#7b7b85" fontSize="12px">
                {t('Your password has been successfully changed')}
              </PrimaryTextParagraph>
            </FlexContainer>

            <FlexContainer
              alignItems="center"
              justifyContent="center"
              padding="12px 0 20px"
            >
              <LinkForgotSuccess to={Page.SIGN_IN}>
                {t('Back to Login')}
              </LinkForgotSuccess>
            </FlexContainer>
          </FlexContainer>
        )}
        {isNotSuccessful && (
          <FlexContainer flexDirection="column" padding="16px">
            <PrimaryTextParagraph
              color="#fffccc"
              fontSize="24px"
              fontWeight="bold"
              marginBottom="20px"
            >
              {t('The link has expired')}
            </PrimaryTextParagraph>

            <FlexContainer alignItems="center" padding="20px 0">
              <FlexContainer margin="0 20px 0 0">
                <FallDownIco />
              </FlexContainer>
              <PrimaryTextParagraph color="#7b7b85" fontSize="12px">
                {t('The link you followed has expired. Please try again.')}
              </PrimaryTextParagraph>
            </FlexContainer>

            <FlexContainer
              alignItems="center"
              justifyContent="center"
              padding="12px 0 20px"
            >
              <LinkForgotSuccess to={Page.SIGN_IN}>
                {t('Back to Login')}
              </LinkForgotSuccess>
            </FlexContainer>
          </FlexContainer>
        )}

        {!isSuccessful && !isNotSuccessful && (
          <CustomForm onSubmit={handleSubmit} noValidate>
            <FlexContainer flexDirection="column">
              <InputField
                name={Fields.PASSWORD}
                id={Fields.PASSWORD}
                placeholder={t('Password')}
                value={values.password || ''}
                onChange={handleChange}
                type="password"
                hasError={!!(touched.password && errors.password)}
                errorText={errors.password}
              />
              <InputField
                name={Fields.REPEAT_PASSWORD}
                id={Fields.REPEAT_PASSWORD}
                onChange={handleChange}
                placeholder={t('Repeat Password')}
                value={values.repeatPassword || ''}
                type="password"
                hasError={!!(touched.repeatPassword && errors.repeatPassword)}
                errorText={errors.repeatPassword}
              />
            </FlexContainer>

            <FlexContainer padding="16px">
              <PrimaryButton
                padding="12px"
                type="submit"
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
            </FlexContainer>
          </CustomForm>
        )}
      </FlexContainer>
    </BackFlowLayout>
  );
};

export default RecoveryPassword;

const CustomForm = styled.form`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
`;

const LinkForgot = styled(Link)`
  font-size: 14px;
  color: #fff;
  text-decoration: none;
  transition: all 0.4s ease;
  will-change: color;

  &:hover {
    text-decoration: none;
    color: #00fff2;
  }
`;

const LinkForgotSuccess = styled(Link)`
  font-size: 14px;
  color: #fff;
  text-decoration: none;
  display: flex;
  justify-content: center;
  padding: 10px;
  background-color: #51505d;
  color: #fffcd1;
  border-radius: 5px;
  transition: all 0.4s ease;
  will-change: background-color;
  width: 100%;

  &:hover {
    text-decoration: none;
    background-color: #3c3b46;
    color: #fffcd1;
  }
`;

// TODO: whats this? :D
const FallDownIco = () => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24Z"
        fill="#444444"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M24 47C36.7025 47 47 36.7025 47 24C47 11.2975 36.7025 1 24 1C11.2975 1 1 11.2975 1 24C1 36.7025 11.2975 47 24 47ZM24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z"
        fill="white"
        fill-opacity="0.1"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M23.6465 24.3535L17.0002 17.7071L17.7073 17L24.3536 23.6464L31 17L31.7071 17.7071L25.0608 24.3535L31.7073 31L31.0002 31.7071L24.3536 25.0606L17.7071 31.7071L17 31L23.6465 24.3535Z"
        fill="#FF557E"
      />
    </svg>
  );
};

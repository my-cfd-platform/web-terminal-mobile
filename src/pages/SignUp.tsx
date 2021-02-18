import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useStores } from '../hooks/useStores';
import styled from '@emotion/styled';
import * as yup from 'yup';
import { FormikHelpers, useFormik } from 'formik';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import mixapanelProps from '../constants/mixpanelProps';

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
import { useTranslation } from 'react-i18next';
import LoaderForComponents from '../components/LoaderForComponents';
import { Observer } from 'mobx-react-lite';

const SignUp = () => {
  const { push } = useHistory();
  const [validateAssigments, setValitdateAssigments] = useState(false);
  const { mainAppStore, notificationStore, badRequestPopupStore } = useStores();
  const { t } = useTranslation();

  const validationSchema = yup.object().shape<UserRegistration>({
    email: yup
      .string()
      .required(t(validationInputTexts.EMAIL))
      .email(t(validationInputTexts.EMAIL)),
    password: yup
      .string()
      .required(t(validationInputTexts.REQUIRED_FIELD))
      .min(8, t(validationInputTexts.PASSWORD_MIN_CHARACTERS))
      .max(31, t(validationInputTexts.PASSWORD_MAX_CHARACTERS))
      .matches(
        /^(?=.*\d)(?=.*[a-zA-Z])/,
        t(validationInputTexts.PASSWORD_MATCH)
      ),
    userAgreement: yup
      .bool()
      .oneOf([true], t(validationInputTexts.USER_AGREEMENT)),
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
    mainAppStore.isLoading = true;

    try {
      grecaptcha.ready(function () {
        grecaptcha
          .execute(mainAppStore.initModel.recaptchaToken, {
            action: 'submit',
          })
          .then(
            async function (captcha: any) {
              try {
                const result = await mainAppStore.signUp({
                  email,
                  password,
                  captcha,
                });
                if (result !== OperationApiResponseCodes.Ok) {
                  notificationStore.notificationMessage = t(
                    apiResponseCodeMessages[result]
                  );
                  notificationStore.isSuccessfull = false;
                  notificationStore.openNotification();
                  mainAppStore.isLoading = false;
                  mixpanel.track(mixpanelEvents.SIGN_UP_FAILED, {
                    [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandName.toLowerCase(),
                    [mixapanelProps.ERROR_TEXT]:
                      apiResponseCodeMessages[result],
                    [mixapanelProps.EMAIL_FAILED]: values.email,
                  });
                } else {
                  mainAppStore.setSignUpFlag(true);
                  mixpanel.track(mixpanelEvents.SIGN_UP, {
                    [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandName.toLowerCase(),
                  });
                  mainAppStore.isDemoRealPopup = true;
                  push(Page.DASHBOARD);
                }
              } catch (error) {
                badRequestPopupStore.openModal();
                badRequestPopupStore.setMessage(error);
                setStatus(error);
                setSubmitting(false);
                mainAppStore.isLoading = false;
              }
            },
            () => {
              badRequestPopupStore.openModal();
              badRequestPopupStore.setMessage(
                t(
                  apiResponseCodeMessages[
                    OperationApiResponseCodes.TechnicalError
                  ]
                )
              );
              setStatus(
                t(
                  apiResponseCodeMessages[
                    OperationApiResponseCodes.TechnicalError
                  ]
                )
              );
              setSubmitting(false);
              mainAppStore.isLoading = false;
            }
          );
      });
    } catch (error) {
      badRequestPopupStore.openModal();
      badRequestPopupStore.setMessage(error);
      setStatus(error);
      setSubmitting(false);
      mainAppStore.isLoading = false;
    }
  };

  useEffect(() => {
    mixpanel.track(mixpanelEvents.SIGN_UP_VIEW, {
      [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandName.toLowerCase(),
    });
  }, []);

  const {
    values,
    setFieldError,
    setFieldValue,
    validateForm,
    handleSubmit,
    handleBlur,
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
    submitForm();
  };

  return (
    <FlexContainer
      flexDirection="column"
      width="100%"
      height="100%"
      minHeight="calc(100vh - 200px)"
      alignItems="center"
      justifyContent="space-between"
    >
      <Observer>
        {() => (
          <LoaderForComponents
            isLoading={mainAppStore.isLoading}
          ></LoaderForComponents>
        )}
      </Observer>
      <FlexContainer flexDirection="column" alignItems="center" width="100%">
        <SignTypeTabs />
        <CustomForm noValidate onSubmit={handleSubmit}>
          <InputField
            id={Fields.EMAIL}
            name={Fields.EMAIL}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email || ''}
            placeholder={t('Email')}
            type="email"
            hasError={!!(touched.email && errors.email)}
            errorText={errors.email}
          />
          <InputField
            id={Fields.PASSWORD}
            name={Fields.PASSWORD}
            value={values.password || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t('Password')}
            type="password"
            hasError={!!(touched.password && errors.password)}
            errorText={errors.password}
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
                {t('I’m 18 years old, and agree to')} &nbsp;
                <StyledLinkAnchor
                  fontSize="11px"
                  href={mainAppStore.initModel.termsUrl}
                >
                  {t('Terms & Conditions')}
                </StyledLinkAnchor>
                &nbsp; {t('and')} &nbsp;
                <StyledLinkAnchor
                  fontSize="11px"
                  href={mainAppStore.initModel.policyUrl}
                >
                  {t('Privacy Policy')}
                </StyledLinkAnchor>
                &nbsp;
              </PrimaryTextSpan>
            </Checkbox>
          </FlexContainer>
        </CustomForm>
      </FlexContainer>

      <FlexContainer flexDirection="column">
        <FlexContainer width="100vw" padding="0 16px" marginBottom="26px">
          <PrimaryButton
            padding="12px"
            type="button"
            width="100%"
            disabled={isSubmitting}
            onClick={handlerClickSubmit}
          >
            <PrimaryTextSpan
              color={Colors.BLACK}
              fontWeight="bold"
              fontSize="16px"
            >
              {t('Sign up')}
            </PrimaryTextSpan>
          </PrimaryButton>
        </FlexContainer>

        <FlexContainer
          alignItems="center"
          justifyContent="center"
          padding="0 0 40px 0"
        >
          <PrimaryTextSpan color={Colors.INPUT_LABEL_TEXT}>
            {t('Already have account?')}
          </PrimaryTextSpan>
          &nbsp;
          <StyledLink to={Page.SIGN_IN}>{t('Log in')}</StyledLink>
        </FlexContainer>
      </FlexContainer>
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

const StyledLinkAnchor = styled.a<{ fontSize?: string }>`
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

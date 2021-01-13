import React, {useEffect} from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { FlexContainer } from '../styles/FlexContainer';
import SignTypeTabs from '../components/SignTypeTabs';
import styled from '@emotion/styled';
import InputField from '../components/InputField';
import Fields from '../constants/fields';
import { Link } from 'react-router-dom';
import Page from '../constants/Pages';
import Colors from '../constants/Colors';
import { PrimaryButton } from '../styles/Buttons';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { useTranslation } from 'react-i18next';
import { UserAuthenticate } from '../types/UserInfo';
import validationInputTexts from '../constants/validationInputTexts';
import { useStores } from '../hooks/useStores';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import apiResponseCodeMessages from '../constants/apiResponseCodeMessages';
import { Observer } from 'mobx-react-lite';
import LoaderForComponents from '../components/LoaderForComponents';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import mixapanelProps from '../constants/mixpanelProps';

const SignIn = () => {
  const { t } = useTranslation();
  const validationSchema = yup.object().shape<UserAuthenticate>({
    email: yup
      .string()
      .required(t(validationInputTexts.EMAIL))
      .email(t(validationInputTexts.EMAIL)),
    password: yup
      .string()
      .required(t(validationInputTexts.REQUIRED_FIELD))
      .min(8, t(validationInputTexts.PASSWORD_MIN_CHARACTERS))
      .max(40, t(validationInputTexts.PASSWORD_MAX_CHARACTERS)),
  });

  useEffect(() => {
    mixpanel.track(mixpanelEvents.LOGIN_VIEW, {
      [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandName.toLowerCase(),
    });
  }, []);

  const initialValues: UserAuthenticate = {
    email: '',
    password: '',
  };

  const { mainAppStore, notificationStore, badRequestPopupStore } = useStores();

  const handleSubmitForm = async (credentials: UserAuthenticate) => {
    mainAppStore.isLoading = true;
    try {
      const result = await mainAppStore.signIn(credentials);
      if (result !== OperationApiResponseCodes.Ok) {
        notificationStore.notificationMessage = t(
          apiResponseCodeMessages[result]
        );
        notificationStore.isSuccessfull = false;
        notificationStore.openNotification();
        mainAppStore.isLoading = false;

        mixpanel.track(mixpanelEvents.LOGIN_FAILED, {
          [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandName.toLowerCase(),
          [mixapanelProps.ERROR_TEXT]: apiResponseCodeMessages[result],
          [mixapanelProps.EMAIL_FAILED]: credentials.email,
        });
      }
      if (result === OperationApiResponseCodes.Ok) {
        mixpanel.people.union({
          [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandName.toLowerCase(),
          [mixapanelProps.PLATFORMS_USED]: 'mobile',
        });
        mixpanel.track(mixpanelEvents.LOGIN_VIEW, {
          [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandName.toLowerCase(),
        });
      }
    } catch (error) {
      badRequestPopupStore.openModal();
      badRequestPopupStore.setMessage(error);
      mainAppStore.isLoading = false;
    }
  };

  const {
    values,
    validateForm,
    handleChange,
    handleBlur,
    errors,
    touched,
    submitForm,
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
    submitForm();
  };

  return (
    <FlexContainer
      flexDirection="column"
      width="100%"
      height="100%"
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

        <CustomForm>
          <InputField
            id={Fields.EMAIL}
            name={Fields.EMAIL}
            placeholder={t('Email')}
            type="email"
            hasError={!!(touched.email && errors.email)}
            errorText={errors.email}
            value={values.email || ''}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <InputField
            name={Fields.PASSWORD}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password || ''}
            id={Fields.PASSWORD}
            type="password"
            placeholder={t('Password')}
            hasError={!!(touched.password && errors.password)}
            errorText={errors.password}
          />
        </CustomForm>

        <FlexContainer
          alignItems="center"
          justifyContent="center"
          marginBottom="24px"
        >
          <LinkForgot to={Page.FORGOT_PASSWORD}>
            {t('Forgot password?')}
          </LinkForgot>
        </FlexContainer>
      </FlexContainer>
      <FlexContainer flexDirection="column">
        <FlexContainer width="100vw" padding="0 16px" marginBottom="26px">
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
              {t('Log In')}
            </PrimaryTextSpan>
          </PrimaryButton>
        </FlexContainer>

        <FlexContainer
          alignItems="center"
          justifyContent="center"
          padding="0 0 40px 0"
        >
          <PrimaryTextSpan color={Colors.INPUT_LABEL_TEXT}>
            {t('Don`t have an account yet?')}
          </PrimaryTextSpan>
          &nbsp;
          <StyledLink to={Page.SIGN_UP}>{t('Sign Up')}</StyledLink>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
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

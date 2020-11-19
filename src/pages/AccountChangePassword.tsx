import React, { FC, useState } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { useFormik } from 'formik';
import Fields from '../constants/fields';
import { PrimaryButton } from '../styles/Buttons';
import styled from '@emotion/styled';
import API from '../helpers/API';
import * as yup from 'yup';
import { useStores } from '../hooks/useStores';
import { useTranslation } from 'react-i18next';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import InputField from '../components/InputField';
import { ChangePassword } from '../types/UserInfo';
import validationInputTexts from '../constants/validationInputTexts';
import apiResponseCodeMessages from '../constants/apiResponseCodeMessages';
import changePasswordMessages from '../constants/changePasswordMessages';
import Page from '../constants/Pages';
import BackFlowLayout from '../components/BackFlowLayout';
import { useHistory } from 'react-router-dom';
import IconShow from '../assets/svg/icon-show-password.svg';
import IconHide from '../assets/svg/icon-hide-password.svg';
import SvgIcon from '../components/SvgIcon';

const AccountChangePassword: FC = () => {
  const { t } = useTranslation();
  const validationSchema = yup.object().shape<ChangePassword>({
    oldPassword: yup
      .string()
      .required(t(validationInputTexts.REQUIRED_FIELD))
      .min(8, t(validationInputTexts.PASSWORD_MAX_MIN_OLD_CHARACTERS))
      .max(31, t(validationInputTexts.PASSWORD_MAX_MIN_OLD_CHARACTERS))
      .matches(
        /^(?=.*\d)(?=.*[a-zA-Z])/,
        t(validationInputTexts.PASSWORD_MATCH)
      ),
    newPassword: yup
      .string()
      .required(t(validationInputTexts.NEW_PASSWORD))
      .min(8, t(validationInputTexts.PASSWORD_MAX_MIN_CHARACTERS))
      .max(31, t(validationInputTexts.PASSWORD_MAX_MIN_CHARACTERS))
      .matches(
        /^(?=.*\d)(?=.*[a-zA-Z])/,
        t(validationInputTexts.PASSWORD_MATCH)
      ),
    repeatPassword: yup
      .string()
      .required(t(validationInputTexts.NEW_PASSWORD))
      .min(8, t(validationInputTexts.PASSWORD_MAX_MIN_CHARACTERS))
      .max(31, t(validationInputTexts.PASSWORD_MAX_MIN_CHARACTERS))
      .matches(
        /^(?=.*\d)(?=.*[a-zA-Z])/,
        t(validationInputTexts.PASSWORD_MATCH)
      )
      .oneOf(
        [yup.ref(Fields.NEW_PASSWORD), null],
        t(validationInputTexts.CONFIRMATION_PASSWORD)
      ),
  });
  const [showedCurrent, setCurrent] = useState<boolean>(false);
  const [showedNew, setNew] = useState<boolean>(false);
  const [showedConfirm, setConfirm] = useState<boolean>(false);

  const { mainAppStore, notificationStore } = useStores();
  const { push } = useHistory();

  const initialValues: ChangePassword = {
    oldPassword: '',
    newPassword: '',
    repeatPassword: '',
  };

  const changeCurrent = (value: boolean) => {
    setCurrent(value);
  };

  const changeNew = (value: boolean) => {
    setNew(value);
  };

  const changeConfirm = (value: boolean) => {
    setConfirm(value);
  };

  const handleSubmitForm = async (props: ChangePassword) => {
    try {
      const response = await API.changePassword(
        {
          newPassword: props.newPassword,
          oldPassword: props.oldPassword,
        },
        mainAppStore.initModel.authUrl
      );
      if (response.result === OperationApiResponseCodes.Ok) {
        notificationStore.notificationMessage = `${t(changePasswordMessages.SUCCESS)}`;
        notificationStore.isSuccessfull = true;
        notificationStore.openNotification();
        push(Page.ACCOUNT_PROFILE);
      } else {
        const resultText = response.result === OperationApiResponseCodes.OldPasswordNotMatch
          ? changePasswordMessages.FAILED : apiResponseCodeMessages[response.result];
        notificationStore.notificationMessage = `${t(resultText)}`;
        notificationStore.isSuccessfull = false;
        notificationStore.openNotification();
      }
    } catch (error) {}
  };

  const {
    validateForm,
    handleSubmit,
    errors,
    touched,
    values,
    handleChange,
    handleBlur,
  } = useFormik({
    initialValues,
    onSubmit: handleSubmitForm,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: true,
    enableReinitialize: true,
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
    <BackFlowLayout pageTitle={t('Change password')}>
      <FlexContainer
        width="100%"
        height="100%"
        flexDirection="column"
        alignItems="center"
      >
        <FlexContainer
          width="100%"
          height="100%"
          flexDirection="column"
          justifyContent="space-between"
        >
          <FlexContainer flexDirection="column" height="100%">
            <CustomForm onSubmit={handleSubmit} noValidate>
              <FlexContainer flexDirection="column">
                <FlexContainer width="100%" margin="120px 0 0">
                  <PasswordInputWrapper width="100%" flexDirection="column">
                    <Label>{t('Current password')}</Label>
                    <InputField
                      name={Fields.OLD_PASSWORD}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.oldPassword || ''}
                      id={Fields.OLD_PASSWORD}
                      type={showedCurrent ? 'text' : 'password'}
                      hasError={!!(touched.oldPassword && errors.oldPassword)}
                      errorText={errors.oldPassword}
                      padding={'14px 52px 14px 165px'}
                    />
                    <ShowHideButton>
                      {showedCurrent
                        ? <SvgIcon
                          {...IconHide}
                          hoverFillColor="rgba(255, 255, 255, 1)"
                          fillColor="rgba(255, 255, 255, 0.4)"
                          width="20"
                          height="20"
                          onClick={() => changeCurrent(false)}
                        />
                        : <SvgIcon
                          {...IconShow}
                          hoverFillColor="rgba(255, 255, 255, 1)"
                          fillColor="rgba(255, 255, 255, 0.4)"
                          width="20"
                          height="20"
                          onClick={() => changeCurrent(true)}
                        />
                      }
                    </ShowHideButton>
                  </PasswordInputWrapper>
                </FlexContainer>
                <FlexContainer width="100%">
                  <PasswordInputWrapper width="100%" flexDirection="column">
                    <Label>{t('New password')}</Label>
                    <InputField
                      name={Fields.NEW_PASSWORD}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.newPassword || ''}
                      id={Fields.NEW_PASSWORD}
                      type={showedNew ? 'text' : 'password'}
                      hasError={!!(touched.newPassword && errors.newPassword)}
                      errorText={errors.newPassword}
                      padding={'14px 52px 14px 165px'}
                    />
                    <ShowHideButton>
                      {showedNew
                        ? <SvgIcon
                          {...IconHide}
                          hoverFillColor="rgba(255, 255, 255, 1)"
                          fillColor="rgba(255, 255, 255, 0.4)"
                          width="20"
                          height="20"
                          onClick={() => changeNew(false)}
                        />
                        : <SvgIcon
                          {...IconShow}
                          hoverFillColor="rgba(255, 255, 255, 1)"
                          fillColor="rgba(255, 255, 255, 0.4)"
                          width="20"
                          height="20"
                          onClick={() => changeNew(true)}
                        />
                      }
                    </ShowHideButton>
                  </PasswordInputWrapper>
                </FlexContainer>
                <FlexContainer width="100%">
                  <PasswordInputWrapper width="100%" flexDirection="column">
                    <Label>{t('Repeat password')}</Label>
                    <InputField
                      name={Fields.REPEAT_PASSWORD}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.repeatPassword || ''}
                      id={Fields.REPEAT_PASSWORD}
                      type={showedConfirm ? 'text' : 'password'}
                      hasError={!!(touched.repeatPassword && errors.repeatPassword)}
                      errorText={errors.repeatPassword}
                      padding={'14px 52px 14px 165px'}
                    />
                    <ShowHideButton>
                      {showedConfirm
                        ? <SvgIcon
                          {...IconHide}
                          hoverFillColor="rgba(255, 255, 255, 1)"
                          fillColor="rgba(255, 255, 255, 0.4)"
                          width="20"
                          height="20"
                          onClick={() => changeConfirm(false)}
                        />
                        : <SvgIcon
                          {...IconShow}
                          hoverFillColor="rgba(255, 255, 255, 1)"
                          fillColor="rgba(255, 255, 255, 0.4)"
                          width="20"
                          height="20"
                          onClick={() => changeConfirm(true)}
                        />
                      }
                    </ShowHideButton>
                  </PasswordInputWrapper>
                </FlexContainer>
              </FlexContainer>
              <FlexContainer padding="0 16px 40px">
                <PrimaryButton
                  type="submit"
                  onClick={handlerClickSubmit}
                  padding="8px 32px"
                  width="100%"
                >
                  <PrimaryTextSpan
                    color="#003A38"
                    fontWeight="bold"
                    fontSize="16px"
                  >
                    {t('Change password')}
                  </PrimaryTextSpan>
                </PrimaryButton>
              </FlexContainer>
            </CustomForm>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </BackFlowLayout>
  );
};

export default AccountChangePassword;

const CustomForm = styled.form`
  margin: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const PasswordInputWrapper = styled(FlexContainer)`
  position: relative;
  input {
    text-align: right;
  }
`;

const ShowHideButton = styled(FlexContainer)`
  position: absolute;
  right: 16px;
  top: 15px;
  cursor: pointer;
`;

const Label = styled(PrimaryTextSpan)`
  position: absolute;
  top: 19px;
  left: 14px;
  transform: translateY(-4px);
  transition: transform 0.2s ease, font-size 0.2s ease, color 0.2s ease;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.4);
`;

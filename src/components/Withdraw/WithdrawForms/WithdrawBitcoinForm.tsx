import styled from '@emotion/styled';
import React, { useCallback, useEffect, useState } from 'react';
import { FlexContainer } from '../../../styles/FlexContainer';
import * as yup from 'yup';
import { useFormik, FormikHelpers } from 'formik';
import { PrimaryTextSpan } from '../../../styles/TextsElements';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../../hooks/useStores';
import { css } from '@emotion/core';
import Colors from '../../../constants/Colors';
import Fields from '../../../constants/fields';
import withdrawalResponseMessages from '../../../constants/withdrawalResponseMessages';
import { WithdrawalHistoryResponseStatus } from '../../../enums/WithdrawalHistoryResponseStatus';
import { WithdrawalTabsEnum } from '../../../enums/WithdrawalTabsEnum';
import { WithdrawalTypesEnum } from '../../../enums/WithdrawalTypesEnum';
import API from '../../../helpers/API';
import { CreateWithdrawalParams } from '../../../types/WithdrawalTypes';
import { Observer } from 'mobx-react-lite';
import InputField from '../../InputField';
import { PrimaryButton } from '../../../styles/Buttons';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../../../constants/mixpanelEvents';
import mixapanelProps from '../../../constants/mixpanelProps';
import { useHistory } from 'react-router-dom';
import Page from '../../../constants/Pages';

interface RequestValues {
  amount: number;
  bitcoinAdress: string;
}
const PRECISION_USD = 2;
const VALIDATE_BITCOIN = /^([13])[a-km-zA-HJ-NP-Z1-9]{25,34}$/;

const WithdrawBitcoinForm = () => {
  const { t } = useTranslation();
  const { push } = useHistory();

  const initialValues: RequestValues = {
    amount: 0,
    bitcoinAdress: '',
  };
  const { mainAppStore, withdrawalStore, notificationStore } = useStores();

  const validationSchema = useCallback(
    () =>
      yup.object().shape<RequestValues>({
        amount: yup
          .number()
          .min(10, `${t('min')}: $10`)
          .max(
            mainAppStore.activeAccount?.balance || 0,
            `${t('max')}: ${
              mainAppStore.accounts
                .find((item) => item.isLive)
                ?.balance.toFixed(2) || 0
            }`
          ),

        bitcoinAdress: yup
          .string()
          .min(26, t('Incorrect Bitcoin address'))
          .max(35, t('Incorrect Bitcoin address'))
          .matches(VALIDATE_BITCOIN, t('Incorrect Bitcoin address'))
          .required(t('Incorrect Bitcoin address')),
      }),
    [mainAppStore.accounts]
  );

  const [dissabled, setDissabled] = useState(true);

  const handleSubmitForm = async () => {
    const accountInfo = mainAppStore.accounts.find((item) => item.isLive);
    try {
      const dataParam = {
        address: values.bitcoinAdress,
      };
      const data: CreateWithdrawalParams = {
        accountId: accountInfo?.id || '',
        currency: accountInfo?.currency || '',
        amount: +values.amount,
        withdrawalType: WithdrawalTypesEnum.Bitcoin,
        data: JSON.stringify(dataParam),
      };

      const result = await API.createWithdrawal(data);
      if (result.status === WithdrawalHistoryResponseStatus.Successful) {
        withdrawalStore.opentTab(WithdrawalTabsEnum.History);
        notificationStore.isSuccessfull = true;
        push(Page.ACCOUNT_WITHDRAW_NEW_SUCCESS);

        mixpanel.track(mixpanelEvents.WITHDRAW_REQUEST, {
          [mixapanelProps.AMOUNT]: +values.amount,
          [mixapanelProps.WITHDRAWAL_METHOD]: 'Bitcoin',
        });
      } else {
        notificationStore.isSuccessfull = false;
      }
      if (
        result.status ===
        WithdrawalHistoryResponseStatus.WithdrawalRequestAlreadyCreated
      ) {
        withdrawalStore.setPendingPopup();
      }

      notificationStore.notificationMessage = t(
        withdrawalResponseMessages[result.status]
      );
      notificationStore.openNotification();
    } catch (error) {}
  };

  const {
    values,
    setFieldError,
    setFieldValue,
    validateForm,
    handleChange,
    handleSubmit,
    errors,
    touched,
    isSubmitting,
    setSubmitting,
  } = useFormik({
    initialValues,
    onSubmit: handleSubmitForm,
    validationSchema,
    validateOnBlur: true,
    validateOnChange: true,
  });

  const handleChangeAmount = (e: any) => {
    let filteredValue: any = e.target.value.replace(',', '.');
    setFieldValue('amount', filteredValue);
  };

  const handleBlurAmount = () => {
    let amount = values.amount.toString().replace(/,/g, '');
    amount = parseFloat(amount || '0')
      .toLocaleString('en-US', {
        style: 'decimal',
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      })
      .replace(/,/g, '');
    setFieldValue('amount', amount);
  };
  const amountOnBeforeInputHandler = (e: any) => {
    const currTargetValue = e.currentTarget.value;

    if (!e.data.match(/^[0-9.,]*$/g)) {
      e.preventDefault();
      return;
    }

    if (!currTargetValue && [',', '.'].includes(e.data)) {
      e.preventDefault();
      return;
    }

    if ([',', '.'].includes(e.data)) {
      if (
        !currTargetValue ||
        (currTargetValue && currTargetValue.includes('.'))
      ) {
        e.preventDefault();
        return;
      }
    }
    // see another regex
    const regex = `^[0-9]{1,7}([,.][0-9]{1,${PRECISION_USD}})?$`;
    const splittedValue =
      currTargetValue.substring(0, e.currentTarget.selectionStart) +
      e.data +
      currTargetValue.substring(e.currentTarget.selectionStart);
    if (
      currTargetValue &&
      ![',', '.'].includes(e.data) &&
      !splittedValue.match(regex)
    ) {
      e.preventDefault();
      return;
    }
    if (e.data.length > 1 && !splittedValue.match(regex)) {
      e.preventDefault();
      return;
    }
  };

  const handlerClickSubmit = async () => {
    const curErrors = await validateForm();
    const curErrorsKeys = Object.keys(curErrors);
    if (curErrorsKeys.length) {
      const el = document.getElementById(curErrorsKeys[0]);
      if (el) el.focus();
    }
  };

  useEffect(() => {
    const submitting = !!values.amount && values.bitcoinAdress.length > 0;
    setDissabled(!submitting);
  }, [values.amount, values.bitcoinAdress]);

  return (
    <CustomForm noValidate onSubmit={handleSubmit}>
      <FlexContainer
        flexDirection="column"
        height="100%"
        justifyContent="space-between"
      >
        <FlexContainer flexDirection="column">
          <FlexContainer
            flexDirection="column"
            width="100%"
            marginBottom="12px"
          >
            <InputWrap
              flexDirection="column"
              width="100%"
              backgroundColor="rgba(42, 45, 56, 0.5)"
              padding="12px 16px"
              position="relative"
              marginBottom="4px"
              hasError={!!(touched.amount && errors.amount)}
            >
              <FlexContainer
                position="absolute"
                top="0"
                bottom="0"
                left="16px"
                margin="auto"
                alignItems="center"
              >
                <PrimaryTextSpan color="#ffffff" fontSize="16px" lineHeight="1">
                  {t('Amount')}
                </PrimaryTextSpan>
              </FlexContainer>

              <Input
                name="amount"
                id="amount"
                type="text"
                inputMode="decimal"
                onBeforeInput={amountOnBeforeInputHandler}
                onChange={handleChangeAmount}
              />
            </InputWrap>

            <FlexContainer marginBottom="12px" padding="0 16px">
              {touched.amount && errors.amount ? (
                <PrimaryTextSpan fontSize="11px" color={Colors.RED}>
                  {errors.amount}
                </PrimaryTextSpan>
              ) : (
                <Observer>
                  {() => (
                    <PrimaryTextSpan
                      fontSize="11px"
                      color="rgba(196, 196, 196, 0.5)"
                    >
                      {t('Available')}&nbsp;
                      {mainAppStore.accounts.find((acc) => acc.isLive)?.symbol}
                      {mainAppStore.accounts
                        .find((acc) => acc.isLive)
                        ?.balance.toFixed(2)}
                    </PrimaryTextSpan>
                  )}
                </Observer>
              )}
            </FlexContainer>
          </FlexContainer>

          <FlexContainer>
            <InputField
              name="bitcoinAdress"
              id="bitcoinAdress"
              onChange={handleChange}
              value={values.bitcoinAdress}
              type="text"
              placeholder={t('Bitcoin Address')}
              hasError={!!(touched.bitcoinAdress && errors.bitcoinAdress)}
              errorText={errors.bitcoinAdress}
            />
          </FlexContainer>
        </FlexContainer>

        <FlexContainer padding="16px" width="100%">
          <PrimaryButton type="submit" onClick={handlerClickSubmit} width="100%">
            {t('Next')}
          </PrimaryButton>
        </FlexContainer>
      </FlexContainer>
    </CustomForm>
  );
};

export default WithdrawBitcoinForm;

const CustomForm = styled.form`
  height: 100%;
  width: 100%;
  margin: 0;
`;

const InputWrap = styled(FlexContainer)`
  border-bottom: 2px solid
    ${(props) => (props.hasError ? Colors.RED : 'transparent')};
  ${(props) =>
    props.hasError &&
    css`
      input {
        color: ${Colors.RED};
      }
    `};
`;

const Input = styled.input<{ autocomplete?: string }>`
  background-color: transparent;
  outline: none;
  border: none;
  font-size: 16px;
  color: #fffccc;
  font-weight: 500;
  line-height: 22px;
  text-align: right;
  appearance: none;
  -moz-appearance: textfield;
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:valid,
  &:-webkit-autofill:active {
    transition: border 0.2s ease, background-color 50000s ease-in-out 0s;
    -webkit-text-fill-color: #fffccc !important;
    font-size: 16px;
  }
`;

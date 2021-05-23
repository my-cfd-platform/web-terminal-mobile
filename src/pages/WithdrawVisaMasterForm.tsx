import styled from '@emotion/styled';
import React, { useCallback } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { useTranslation } from 'react-i18next';
import { useStores } from '../hooks/useStores';
import { css } from '@emotion/core';
import Colors from '../constants/Colors';
import withdrawalResponseMessages from '../constants/withdrawalResponseMessages';
import { WithdrawalHistoryResponseStatus } from '../enums/WithdrawalHistoryResponseStatus';
import { WithdrawalTabsEnum } from '../enums/WithdrawalTabsEnum';
import { WithdrawalTypesEnum } from '../enums/WithdrawalTypesEnum';
import API from '../helpers/API';
import { CreateWithdrawalParams } from '../types/WithdrawalTypes';
import { Observer } from 'mobx-react-lite';
import InputField from '../components/InputField';
import { PrimaryButton } from '../styles/Buttons';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import mixapanelProps from '../constants/mixpanelProps';
import Page from '../constants/Pages';
import { useHistory } from 'react-router-dom';
import WithdrawContainer from '../containers/WithdrawContainer';
import { moneyFormatPart } from '../helpers/moneyFormat';
import InformationPopup from '../components/InformationPopup';

interface RequestValues {
  amount: number;
  details: string;
}

const PRECISION_USD = 2;

const WithdrawVisaMasterForm = () => {
  const initialValues: RequestValues = {
    amount: 0,
    details: '',
  };
  const { t } = useTranslation();
  const { push } = useHistory();
  const { mainAppStore, withdrawalStore, notificationStore } = useStores();

  const validationSchema = useCallback(
    () =>
      yup.object().shape<RequestValues>({
        amount: yup
          .number()
          .min(10, `${t('min')}: $10`)
          .max(
            mainAppStore.activeAccount?.balance || 0,
            `${t('max')}: ${mainAppStore.accounts
              .find((item) => item.isLive)
              ?.balance.toFixed(2)}`
          ),
        details: yup
          .string()
          .max(2000, t('The field should be less or equal to 2000 characters')),
      }),
    [mainAppStore.accounts]
  );

  const handleSubmitForm = async () => {
    try {
      const dataParam = {
        details: values.details,
      };

      const accountInfo = mainAppStore.accounts.find((item) => item.isLive);

      const data: CreateWithdrawalParams = {
        accountId: accountInfo?.id || '',
        currency: accountInfo?.currency || '',
        amount: +values.amount,
        withdrawalType: WithdrawalTypesEnum.BankTransfer,
        data: JSON.stringify(dataParam),
      };

      const result = await API.createWithdrawal(
        data,
        mainAppStore.initModel.tradingUrl
      );
      if (result.status === WithdrawalHistoryResponseStatus.Successful) {
        notificationStore.isSuccessfull = true;
        push(Page.WITHDRAW_SUCCESS);
        withdrawalStore.setPendingPopup();

        mixpanel.track(mixpanelEvents.WITHDRAW_REQUEST, {
          [mixapanelProps.AMOUNT]: +values.amount,
          [mixapanelProps.WITHDRAWAL_METHOD]: 'Bankwire',
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
    setFieldValue,
    validateForm,
    handleChange,
    handleSubmit,
    errors,
    touched,
    isValid,
    dirty,
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
        (currTargetValue && currTargetValue.includes('.')) ||
        (currTargetValue && currTargetValue.includes(','))
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

  const textOnBeforeInputHandler = () => {};

  const handlerClickSubmit = async () => {
    const curErrors = await validateForm();
    const curErrorsKeys = Object.keys(curErrors);
    if (curErrorsKeys.length) {
      const el = document.getElementById(curErrorsKeys[0]);
      if (el) el.focus();
    }
  };

  return (
    <WithdrawContainer backBtn={Page.WITHDRAW_LIST}>
      <CustomForm noValidate onSubmit={handleSubmit}>
        <FlexContainer
          flexDirection="column"
          height="100%"
          justifyContent="space-between"
        >
          <FlexContainer flexDirection="column">
            <FlexContainer flexDirection="column" width="100%">
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
                  <PrimaryTextSpan
                    color="#ffffff"
                    fontSize="16px"
                    lineHeight="1"
                  >
                    {t('Amount')}
                  </PrimaryTextSpan>
                </FlexContainer>

                <Input
                  name="amount"
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  value={values.amount || ''}
                  onBeforeInput={amountOnBeforeInputHandler}
                  onBlur={handleBlurAmount}
                  onChange={handleChangeAmount}
                />
              </InputWrap>

              {touched.amount && errors.amount && (
                <FlexContainer marginBottom="12px" padding="0 16px">
                  <PrimaryTextSpan fontSize="11px" color={Colors.RED}>
                    {errors.amount}
                  </PrimaryTextSpan>
                </FlexContainer>
              )}
            </FlexContainer>

            <FlexContainer>
              <InputField
                name="details"
                id="details"
                onBeforeInput={textOnBeforeInputHandler}
                onChange={handleChange}
                value={values.details}
                type="text"
                placeholder={t('Details')}
                hasError={!!(touched.details && errors.details)}
                errorText={errors.details}
              />
            </FlexContainer>

            <FlexContainer padding="16px" justifyContent="space-between">
              <PrimaryTextSpan fontSize="14px" color="rgba(196, 196, 196, 0.5)">
                {t('Available')}
              </PrimaryTextSpan>
              <Observer>
                {() => (
                  <PrimaryTextSpan
                    fontSize="14px"
                    color="rgba(255, 255, 255, 0.4)"
                  >
                    {mainAppStore.accounts.find((acc) => acc.isLive)?.symbol}
                    {
                      moneyFormatPart(
                        mainAppStore.accounts.find((acc) => acc.isLive)
                          ?.balance || 0
                      ).int
                    }
                    .
                    <PrimaryTextSpan
                      fontSize="10px"
                      color="rgba(255, 255, 255, 0.4)"
                    >
                      {
                        moneyFormatPart(
                          mainAppStore.accounts.find((acc) => acc.isLive)
                            ?.balance || 0
                        ).decimal
                      }
                    </PrimaryTextSpan>
                  </PrimaryTextSpan>
                )}
              </Observer>
            </FlexContainer>

            <Observer>
              {() => (
                <>
                  {mainAppStore.accounts.find((acc) => acc.isLive)?.bonus && (
                    <FlexContainer
                      padding="16px"
                      justifyContent="space-between"
                    >
                      <FlexContainer>
                        <PrimaryTextSpan
                          fontSize="14px"
                          color="rgba(196, 196, 196, 0.5)"
                          marginRight="8px"
                        >
                          {t('Bonus')}
                        </PrimaryTextSpan>
                        <InformationPopup
                          infoText={t(
                            'There is no possibility of withdrawing bonus. But this is an extra amount on your account and when you make a profit with them, this is something you can withdraw.'
                          )}
                        />
                      </FlexContainer>
                      <PrimaryTextSpan
                        fontSize="14px"
                        color="rgba(255, 255, 255, 0.4)"
                      >
                        {
                          mainAppStore.accounts.find((acc) => acc.isLive)
                            ?.symbol
                        }
                        {
                          moneyFormatPart(
                            mainAppStore.accounts.find((acc) => acc.isLive)
                              ?.bonus || 0
                          ).int
                        }
                        .
                        <PrimaryTextSpan
                          fontSize="10px"
                          color="rgba(255, 255, 255, 0.4)"
                        >
                          {
                            moneyFormatPart(
                              mainAppStore.accounts.find((acc) => acc.isLive)
                                ?.bonus || 0
                            ).decimal
                          }
                        </PrimaryTextSpan>
                      </PrimaryTextSpan>
                    </FlexContainer>
                  )}
                </>
              )}
            </Observer>
          </FlexContainer>

          <FlexContainer padding="16px" width="100%">
            <PrimaryButton
              type="submit"
              onClick={handlerClickSubmit}
              width="100%"
              disabled={
                !(values.amount > 0 && values.amount.toString().length > 0)
              }
            >
              {t('Next')}
            </PrimaryButton>
          </FlexContainer>
        </FlexContainer>
      </CustomForm>
    </WithdrawContainer>
  );
};

export default WithdrawVisaMasterForm;

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

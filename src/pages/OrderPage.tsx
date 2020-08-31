import React, { useCallback, useEffect, ChangeEvent, useState } from 'react';
import * as yup from 'yup';
import { useFormik, FormikHelpers } from 'formik';
import BackFlowLayout from '../components/BackFlowLayout';
import { useParams, useHistory } from 'react-router-dom';
import { FlexContainer } from '../styles/FlexContainer';
import { useStores } from '../hooks/useStores';
import ActiveInstrumentItem from '../components/OrderPanel/ActiveInstrumentItem';
import { getProcessId } from '../helpers/getProcessId';
import Fields from '../constants/fields';
import { AskBidEnum } from '../enums/AskBid';
import { TpSlTypeEnum } from '../enums/TpSlTypeEnum';
import { useTranslation } from 'react-i18next';
import { PrimaryTextSpan } from '../styles/TextsElements';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import ConfirmationPopup from '../components/ConfirmationPopup';
import Colors from '../constants/Colors';
import { Observer } from 'mobx-react-lite';
import { css } from '@emotion/core';
import API from '../helpers/API';
import { OpenPositionModelFormik } from '../types/Positions';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import apiResponseCodeMessages from '../constants/apiResponseCodeMessages';
import Page from '../constants/Pages';

const PRECISION_USD = 2;
const DEFAULT_INVEST_AMOUNT = 10;
const MAX_INPUT_VALUE = 9999999.99;

const OrderPage = () => {
  const { type } = useParams();
  const { t } = useTranslation();
  const {
    mainAppStore,
    instrumentsStore,
    quotesStore,
    activePositionNotificationStore,
    notificationStore,
  } = useStores();
  const { push } = useHistory();

  // TODO: Refactor
  const instrument = useCallback(() => {
    return (
      instrumentsStore.activeInstrument?.instrumentItem ||
      instrumentsStore.instruments[0].instrumentItem
    );
  }, [instrumentsStore.activeInstrument]);

  const initialValues = useCallback(
    () => ({
      processId: getProcessId(),
      accountId: mainAppStore.activeAccount?.id || '',
      instrumentId: instrument().id,
      operation: null,
      multiplier: instrument().multiplier[0],
      investmentAmount: DEFAULT_INVEST_AMOUNT,
      tp: null,
      sl: null,
      slType: null,
      tpType: null,
    }),
    [instrument, mainAppStore.activeAccount?.id]
  );

  const currentPriceAsk = useCallback(
    () => quotesStore.quotes[instrument().id].ask.c,
    [quotesStore.quotes[instrument().id].ask.c]
  );
  const currentPriceBid = useCallback(
    () => quotesStore.quotes[instrument().id].bid.c,
    [quotesStore.quotes[instrument().id].bid.c]
  );

  const validationSchema: any = useCallback(
    () =>
      yup.object().shape({
        investmentAmount: yup
          .number()
          .min(
            +instrument().minOperationVolume / +values.multiplier,
            `${t('Minimum trade volume')} $${+instrument()
              .minOperationVolume}. ${t(
              'Please increase your trade amount or multiplier'
            )}.`
          )
          .max(
            +instrument().maxOperationVolume / +values.multiplier,
            `${t('Maximum trade volume')} $${+instrument()
              .maxOperationVolume}. ${t(
              'Please decrease your trade amount or multiplier'
            )}.`
          )
          .test(
            Fields.AMOUNT,
            `${t('Insufficient funds to open a position. You have only')} $${
              mainAppStore.activeAccount?.balance
            }`,
            (value) => {
              if (value) {
                return value < (mainAppStore.activeAccount?.balance || 0);
              }
              return true;
            }
          )
          .required(t('Please fill Invest amount')),
        multiplier: yup.number().required(t('Required amount')),
        tp: yup
          .number()
          .nullable()
          .when([Fields.OPERATION, Fields.TAKE_PROFIT_TYPE], {
            is: (operation, tpType) =>
              operation === AskBidEnum.Buy && tpType === TpSlTypeEnum.Price,
            then: yup
              .number()
              .nullable()
              .test(
                Fields.TAKE_PROFIT,
                `${t('Error message')}: ${t(
                  'This level is higher or lower than the one currently allowed'
                )}`,
                (value) => value > currentPriceAsk()
              ),
          })
          .when([Fields.OPERATION, Fields.TAKE_PROFIT_TYPE], {
            is: (operation, tpType) =>
              operation === AskBidEnum.Sell && tpType === TpSlTypeEnum.Price,
            then: yup
              .number()
              .nullable()
              .test(
                Fields.TAKE_PROFIT,
                `${t('Error message')}: ${t(
                  'This level is higher or lower than the one currently allowed'
                )}`,
                (value) => value < currentPriceBid()
              ),
          }),
        sl: yup
          .number()
          .nullable()
          .when([Fields.OPERATION, Fields.STOP_LOSS_TYPE], {
            is: (operation, slType) =>
              operation === AskBidEnum.Buy && slType === TpSlTypeEnum.Price,
            then: yup
              .number()
              .nullable()
              .test(
                Fields.STOP_LOSS,
                `${t('Error message')}: ${t(
                  'This level is higher or lower than the one currently allowed'
                )}`,
                (value) => value < currentPriceAsk()
              ),
          })
          .when([Fields.OPERATION, Fields.STOP_LOSS_TYPE], {
            is: (operation, slType) =>
              operation === AskBidEnum.Sell && slType === TpSlTypeEnum.Price,
            then: yup
              .number()
              .nullable()
              .test(
                Fields.STOP_LOSS,
                `${t('Error message')}: ${t(
                  'This level is higher or lower than the one currently allowed'
                )}`,
                (value) => value > currentPriceBid()
              ),
          })
          .when([Fields.STOP_LOSS_TYPE], {
            is: (slType) => slType === TpSlTypeEnum.Currency,
            then: yup
              .number()
              .nullable()
              .test(
                Fields.STOP_LOSS,
                t('Stop loss level can not be lower than the Invest amount'),
                function (value) {
                  return value < this.parent[Fields.AMOUNT];
                }
              ),
          }),
        openPrice: yup.number().nullable(),
        tpType: yup.number().nullable(),
        slType: yup.number().nullable(),
      }),
    [instrument, currentPriceBid, currentPriceAsk, initialValues]
  );

  const onSubmit = async (
    values: OpenPositionModelFormik,
    formikHelpers: FormikHelpers<OpenPositionModelFormik>
  ) => {
    formikHelpers.setSubmitting(true);
    const { operation, ...otherValues } = values;

    let availableBalance = mainAppStore.activeAccount?.balance || 0;

    const modelToSubmit = {
      ...otherValues,
      operation: type === 'buy' ? AskBidEnum.Buy : AskBidEnum.Sell,
      investmentAmount: +otherValues.investmentAmount,
    };
    try {
      const response = await API.openPosition(modelToSubmit);
      if (response.result === OperationApiResponseCodes.Ok) {
        const instrumentItem = instrumentsStore.instruments.find(
          (item) => item.instrumentItem.id === instrument().id
        )?.instrumentItem;

        if (instrumentItem) {
          activePositionNotificationStore.notificationMessageData = {
            equity: 0,
            instrumentName: instrumentItem.name,
            instrumentGroup:
              instrumentsStore.instrumentGroups.find(
                (item) => item.id === instrumentItem.id
              )?.name || '',
            instrumentId: instrumentItem.id,
            type: 'open',
          };
          activePositionNotificationStore.isSuccessfull = true;
          activePositionNotificationStore.openNotification();
        }
        push(Page.DASHBOARD);
      } else {
        notificationStore.notificationMessage = t(
          apiResponseCodeMessages[response.result]
        );
        notificationStore.isSuccessfull = false;
        notificationStore.openNotification();
      }

      resetForm();
    } catch (error) {}
  };

  const handleChangeInputAmount = (increase: boolean) => () => {
    const newValue = increase
      ? Number(+values.investmentAmount + 1).toFixed(PRECISION_USD)
      : values.investmentAmount < 1
      ? 0
      : Number(+values.investmentAmount - 1).toFixed(PRECISION_USD);

    if (newValue <= MAX_INPUT_VALUE) {
      setFieldValue(Fields.AMOUNT, newValue);
    }
  };
  // TODO: make one helper for all inputs (autoclose, price at)
  const investOnBeforeInputHandler = (e: any) => {
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

  const investOnChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let filteredValue: any = e.target.value.replace(',', '.');
    setFieldValue(Fields.AMOUNT, filteredValue);
  };

  const {
    values,
    setFieldError,
    setFieldValue,
    resetForm,
    handleSubmit,
    getFieldProps,
    validateForm,
    errors,
    touched,
    isSubmitting,
  } = useFormik({
    initialValues: initialValues(),
    onSubmit,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    // enableReinitialize: true,
  });

  useEffect(() => {
    resetForm();
    setFieldValue(Fields.INSTRUMNENT_ID, instrument().id);
    setFieldValue(Fields.MULTIPLIER, instrument().multiplier[0]);
  }, [instrument]);

  useEffect(() => {
    resetForm();
    setFieldValue(Fields.ACCOUNT_ID, mainAppStore.activeAccount?.id);
  }, [mainAppStore.activeAccount]);

  return (
    <BackFlowLayout pageTitle={type}>
      <FlexContainer flexDirection="column" width="100%" position="relative">
        <ActiveInstrumentItem type={type} />
        <CustomForm autoComplete="off" onSubmit={handleSubmit}>
          <InputWrap
            flexDirection="column"
            width="100%"
            backgroundColor="rgba(42, 45, 56, 0.5)"
            padding="14px 16px"
            position="relative"
            marginBottom="4px"
            hasError={!!(touched.investmentAmount && errors.investmentAmount)}
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
                {t('Invest')}
              </PrimaryTextSpan>
            </FlexContainer>

            <Input
              {...getFieldProps(Fields.AMOUNT)}
              onBeforeInput={investOnBeforeInputHandler}
              onChange={investOnChangeHandler}
              pattern="[0-9]*"
            />
          </InputWrap>

          <FlexContainer marginBottom="12px" padding="0 16px">
            {touched.investmentAmount && errors.investmentAmount ? (
              <PrimaryTextSpan fontSize="11px" color={Colors.RED}>
                {errors.investmentAmount}
              </PrimaryTextSpan>
            ) : (
              <Observer>
                {() => (
                  <PrimaryTextSpan
                    fontSize="11px"
                    color="rgba(196, 196, 196, 0.5)"
                  >
                    {t('Available')}&nbsp;
                    {mainAppStore.activeAccount?.symbol}
                    {mainAppStore.activeAccount?.balance.toFixed(2)}
                  </PrimaryTextSpan>
                )}
              </Observer>
            )}
          </FlexContainer>

          <FlexContainer
            flexDirection="column"
            width="100%"
            backgroundColor="rgba(42, 45, 56, 0.5)"
            padding="14px 16px"
            position="relative"
            alignItems="flex-end"
            marginBottom="12px"
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
                {t('Leverage')}
              </PrimaryTextSpan>
            </FlexContainer>

            <MultiplierSelect dir="rtl" {...getFieldProps(Fields.MULTIPLIER)}>
              {instrument()
                .multiplier.slice()
                .sort((a, b) => b - a)
                .map((multiplier) => (
                  <MultiplierSelectValue value={multiplier} key={multiplier}>
                    x{multiplier}
                  </MultiplierSelectValue>
                ))}
            </MultiplierSelect>
          </FlexContainer>

          <ConfirmButton type="submit" actionType={type}>
            {t('Confirm')} {mainAppStore.activeAccount?.symbol}
            {values.investmentAmount}
          </ConfirmButton>
        </CustomForm>
      </FlexContainer>
    </BackFlowLayout>
  );
};

export default OrderPage;

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

const ConfirmButton = styled(ButtonWithoutStyles)<{ actionType?: string }>`
  background-color: ${(props) =>
    props.actionType === 'buy' ? Colors.ACCENT_BLUE : Colors.RED};
  color: ${(props) => (props.actionType === 'buy' ? '#252636' : '#ffffff')};
  height: 56px;
  border-radius: 8px;
  font-size: 16px;
  line-height: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  position: fixed;
  bottom: 16px;
  left: 16px;
  right: 16px;
  width: 100%;
  max-width: calc(100% - 32px);
  z-index: 1;
`;

const CustomForm = styled.form`
  margin: 0;
`;

const MultiplierSelect = styled.select`
  background-color: transparent;
  outline: none;
  border: none;
  font-size: 16px;
  color: #fffccc;
  font-weight: 500;
  line-height: 22px;
  text-align: right;
  appearance: none;
  width: 100%;
  text-align-last: right;
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
const MultiplierSelectValue = styled.option``;

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

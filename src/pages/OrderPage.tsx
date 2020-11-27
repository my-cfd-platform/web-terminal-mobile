import React, { useCallback, useEffect, ChangeEvent } from 'react';
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
import Colors from '../constants/Colors';
import { observer, Observer } from 'mobx-react-lite';
import { css } from '@emotion/core';
import API from '../helpers/API';
import { OpenPositionModelFormik } from '../types/Positions';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import apiResponseCodeMessages from '../constants/apiResponseCodeMessages';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import mixapanelProps from '../constants/mixpanelProps';
import Page from '../constants/Pages';
import mixpanelValues from '../constants/mixpanelValues';

const PRECISION_USD = 2;
const DEFAULT_INVEST_AMOUNT = 50;

const OrderPage = observer(() => {
  const { type } = useParams<{ type: string }>();
  const { t } = useTranslation();
  const {
    mainAppStore,
    instrumentsStore,
    quotesStore,
    activePositionNotificationStore,
    notificationStore,
    markersOnChartStore,
  } = useStores();
  const { push } = useHistory();

  const getActiveAccountBalance = useCallback(
    () => mainAppStore.activeAccount?.balance,
    [mainAppStore.activeAccount]
  );

  if (!instrumentsStore.activeInstrument) {
    push(Page.DASHBOARD);
    return null;
  }

  const initialValues = useCallback(
    () => ({
      processId: getProcessId(),
      accountId: mainAppStore.activeAccount?.id || '',
      instrumentId: instrumentsStore.activeInstrument!.instrumentItem.id,
      operation: null,
      multiplier: instrumentsStore.activeInstrument!.instrumentItem
        .multiplier[0],
      investmentAmount: DEFAULT_INVEST_AMOUNT,
      tp: null,
      sl: null,
      slType: null,
      tpType: null,
    }),
    [instrumentsStore.activeInstrument, mainAppStore.activeAccount?.id]
  );

  const currentPriceAsk = useCallback(
    () =>
      quotesStore.quotes[instrumentsStore.activeInstrument!.instrumentItem.id]
        .ask.c,
    [
      quotesStore.quotes[instrumentsStore.activeInstrument!.instrumentItem.id]
        .ask.c,
    ]
  );
  const currentPriceBid = useCallback(
    () =>
      quotesStore.quotes[instrumentsStore.activeInstrument!.instrumentItem.id]
        .bid.c,
    [
      quotesStore.quotes[instrumentsStore.activeInstrument!.instrumentItem.id]
        .bid.c,
    ]
  );

  const validationSchema: any = useCallback(
    () =>
      yup.object().shape({
        investmentAmount: yup
          .number()
          .test(
            Fields.AMOUNT,
            `${t('Minimum trade volume')} $${
              instrumentsStore.activeInstrument?.instrumentItem
                .minOperationVolume
            }. ${t('Please increase your trade amount or multiplier')}.`,
            function (value) {
              if (value) {
                return (
                  value >=
                  instrumentsStore.activeInstrument!.instrumentItem
                    .minOperationVolume /
                    +this.parent[Fields.MULTIPLIER]
                );
              }
              return true;
            }
          )
          .test(
            Fields.AMOUNT,
            `${t('Maximum trade volume')} $${
              instrumentsStore.activeInstrument?.instrumentItem
                .maxOperationVolume
            }. ${t('Please decrease your trade amount or multiplier')}.`,
            function (value) {
              if (value) {
                return (
                  value <=
                  instrumentsStore.activeInstrument!.instrumentItem
                    .maxOperationVolume /
                    +this.parent[Fields.MULTIPLIER]
                );
              }
              return true;
            }
          )
          .test(
            Fields.AMOUNT,
            `${t('Insufficient funds to open a position. You have only')} $${
              mainAppStore.activeAccount?.balance
            }`,
            (value) => {
              if (value) {
                return value <= (mainAppStore.activeAccount?.balance || 0);
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
    [
      instrumentsStore.activeInstrument,
      currentPriceBid,
      currentPriceAsk,
      initialValues,
    ]
  );

  const onSubmit = async (
    values: OpenPositionModelFormik,
    formikHelpers: FormikHelpers<OpenPositionModelFormik>
  ) => {
    formikHelpers.setSubmitting(true);
    const { operation, ...otherValues } = values;

    const modelToSubmit = {
      ...otherValues,
      operation: type === 'buy' ? AskBidEnum.Buy : AskBidEnum.Sell,
      investmentAmount: +otherValues.investmentAmount,
    };
    try {
      const balanceBeforeOrder = getActiveAccountBalance();
      const response = await API.openPosition(modelToSubmit);
      if (response.result === OperationApiResponseCodes.Ok) {
        markersOnChartStore.addNewMarker(response.position);

        if (instrumentsStore.activeInstrument) {
          activePositionNotificationStore.notificationMessageData = {
            equity: 0,
            instrumentName:
              instrumentsStore.activeInstrument.instrumentItem.name,
            instrumentGroup:
              instrumentsStore.instrumentGroups.find(
                (item) =>
                  item.id ===
                  instrumentsStore.activeInstrument?.instrumentItem.id
              )?.name || '',
            instrumentId: instrumentsStore.activeInstrument.instrumentItem.id,
            type: 'open',
          };
          activePositionNotificationStore.isSuccessfull = true;
          activePositionNotificationStore.openNotification();
        }
        mixpanel.track(mixpanelEvents.MARKET_ORDER, {
          [mixapanelProps.AMOUNT]: response.position.investmentAmount,
          [mixapanelProps.ACCOUNT_CURRENCY]:
            mainAppStore.activeAccount?.currency || '',
          [mixapanelProps.INSTRUMENT_ID]: response.position.instrument,
          [mixapanelProps.MULTIPLIER]: response.position.multiplier,
          [mixapanelProps.TREND]:
            response.position.operation === AskBidEnum.Buy ? 'buy' : 'sell',
          [mixapanelProps.SL_TYPE]:
            response.position.slType !== null
              ? mixpanelValues[response.position.slType]
              : null,
          [mixapanelProps.TP_TYPE]:
            response.position.tpType !== null
              ? mixpanelValues[response.position.tpType]
              : null,
          [mixapanelProps.SL_VALUE]:
            response.position.sl !== null
              ? Math.abs(response.position.sl)
              : null,
          [mixapanelProps.TP_VALUE]: response.position.tp,
          [mixapanelProps.AVAILABLE_BALANCE]: balanceBeforeOrder,
          [mixapanelProps.ACCOUNT_ID]: mainAppStore.activeAccount?.id || '',
          [mixapanelProps.ACCOUNT_TYPE]: mainAppStore.activeAccount?.isLive
            ? 'real'
            : 'demo',
          [mixapanelProps.EVENT_REF]: mixpanelValues.PORTFOLIO,
          [mixapanelProps.POSITION_ID]: response.position.id,
        });
        resetForm();
        push(Page.DASHBOARD);
      } else {
        mixpanel.track(mixpanelEvents.MARKET_ORDER_FAILED, {
          [mixapanelProps.AMOUNT]: modelToSubmit.investmentAmount,
          [mixapanelProps.ACCOUNT_CURRENCY]:
            mainAppStore.activeAccount?.currency || '',
          [mixapanelProps.INSTRUMENT_ID]: modelToSubmit.instrumentId,
          [mixapanelProps.MULTIPLIER]: modelToSubmit.multiplier,
          [mixapanelProps.TREND]:
            modelToSubmit.operation === AskBidEnum.Buy ? 'buy' : 'sell',
          [mixapanelProps.SL_TYPE]:
            modelToSubmit.slType !== null
              ? mixpanelValues[modelToSubmit.slType]
              : null,
          [mixapanelProps.TP_TYPE]:
            modelToSubmit.tpType !== null
              ? mixpanelValues[modelToSubmit.tpType]
              : null,
          [mixapanelProps.SL_VALUE]:
            modelToSubmit.sl !== null ? Math.abs(modelToSubmit.sl) : null,
          [mixapanelProps.TP_VALUE]: modelToSubmit.tp,
          [mixapanelProps.AVAILABLE_BALANCE]: balanceBeforeOrder,
          [mixapanelProps.ACCOUNT_ID]: mainAppStore.activeAccount?.id || '',
          [mixapanelProps.ACCOUNT_TYPE]: mainAppStore.activeAccount?.isLive
            ? 'real'
            : 'demo',
          [mixapanelProps.ERROR_TEXT]: apiResponseCodeMessages[response.result],
          [mixapanelProps.EVENT_REF]: mixpanelValues.PORTFOLIO,
        });

        notificationStore.notificationMessage = t(
          apiResponseCodeMessages[response.result]
        );
        notificationStore.isSuccessfull = false;
        notificationStore.openNotification();
        resetForm();
      }
    } catch (error) {}
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
    setFieldError(Fields.AMOUNT, '');
  };

  const {
    values,
    setFieldError,
    setFieldValue,
    resetForm,
    handleSubmit,
    getFieldProps,
    isSubmitting,
    errors,
    touched,
  } = useFormik({
    initialValues: initialValues(),
    onSubmit,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
  });

  useEffect(() => {
    resetForm();
    setFieldValue(
      Fields.INSTRUMNENT_ID,
      instrumentsStore.activeInstrument!.instrumentItem.id
    );
    setFieldValue(
      Fields.MULTIPLIER,
      instrumentsStore.activeInstrument!.instrumentItem.multiplier[0]
    );
  }, [instrumentsStore.activeInstrument]);

  useEffect(() => {
    resetForm();
    setFieldValue(Fields.ACCOUNT_ID, mainAppStore.activeAccount?.id);
  }, [mainAppStore.activeAccount]);

  return (
    <BackFlowLayout pageTitle={t(type)}>
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
              type="text"
              inputMode="decimal"
              onBeforeInput={investOnBeforeInputHandler}
              onChange={investOnChangeHandler}
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
              {instrumentsStore
                .activeInstrument!.instrumentItem.multiplier.slice()
                .sort((a, b) => b - a)
                .map((multiplier) => (
                  <MultiplierSelectValue value={multiplier} key={multiplier}>
                    x{multiplier}
                  </MultiplierSelectValue>
                ))}
            </MultiplierSelect>
          </FlexContainer>

          <ConfirmButton
            type="submit"
            actionType={type}
            disabled={isSubmitting}
          >
            {t('Confirm')} {mainAppStore.activeAccount?.symbol}
            {values.investmentAmount}
          </ConfirmButton>
        </CustomForm>
      </FlexContainer>
    </BackFlowLayout>
  );
});

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

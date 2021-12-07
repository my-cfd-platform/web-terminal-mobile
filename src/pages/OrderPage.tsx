import React, {
  useCallback,
  useEffect,
  ChangeEvent,
  FocusEvent,
  useRef,
  useState,
} from 'react';
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
import AutosizeInput from 'react-input-autosize';
import KeysInApi from '../constants/keysInApi';
import LoaderForComponents from '../components/LoaderForComponents';
import useInstrument from '../hooks/useInstrument';

const PRECISION_USD = 2;
const DEFAULT_INVEST_AMOUNT_LIVE = 50;
const DEFAULT_INVEST_AMOUNT_DEMO = 1000;

const OrderPage = observer(() => {
  const { type } = useParams<{ type: string }>();
  const { t } = useTranslation();
  const { getPressision } = useInstrument();
  const purchaseField = useRef<HTMLInputElement | null>(null);
  const orderWrapper = useRef<HTMLDivElement>(document.createElement('div'));
  const [isKeyboard, setIsKeyboard] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {
    mainAppStore,
    instrumentsStore,
    quotesStore,
    activePositionNotificationStore,
    notificationStore,
    markersOnChartStore,
    SLTPStore,
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
      investmentAmount: mainAppStore.activeAccount?.isLive
        ? DEFAULT_INVEST_AMOUNT_LIVE
        : DEFAULT_INVEST_AMOUNT_DEMO,
      tp: null,
      sl: null,
      slType: null,
      tpType: null,
      isToppingUpActive: false,
    }),
    [instrumentsStore.activeInstrument, mainAppStore.activeAccount?.id]
  );

  const ucFirst = (str: string) => {
    if (!str) return str;
    return str[0].toUpperCase() + str.slice(1);
  };

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

  const getPlaceholderOpenPrice = () =>
    type.toLowerCase() === 'buy'
      ? currentPriceAsk().toFixed(
          instrumentsStore.activeInstrument!.instrumentItem.digits
        )
      : currentPriceBid().toFixed(
          instrumentsStore.activeInstrument!.instrumentItem.digits
        );

  const validationSchema: any = useCallback(
    () =>
      yup.object().shape({
        investmentAmount: yup
          .number()
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
            `${t('Minimum trade volume')} $${
              instrumentsStore.activeInstrument?.instrumentItem
                .minOperationVolume
            }. ${t('Please increase your trade amount or multiplier')}.`,
            function (value) {
              if (value !== null) {
                return value !== 0;
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

          .required(t('Please fill Invest amount')),
        multiplier: yup.number().required(t('Required amount')),
        openPrice: yup
          .number()
          .test(
            Fields.PURCHASE_AT,
            t('Open price can not be zero'),
            (value) => {
              return value !== 0;
            }
          ),
        tpType: yup.number().nullable(),
        slType: yup.number().nullable(),
      }),
    [
      instrumentsStore.activeInstrument,
      currentPriceBid,
      currentPriceAsk,
      initialValues,
      quotesStore.quotes[instrumentsStore.activeInstrument!.instrumentItem.id],
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
    if (!!otherValues.openPrice) {
      try {
        const modelToPendingOrder = {
          processId: otherValues.processId,
          accountId: otherValues.accountId,
          investmentAmount: +otherValues.investmentAmount,
          instrumentId: otherValues.instrumentId,
          operation: type === 'buy' ? AskBidEnum.Buy : AskBidEnum.Sell,
          multiplier: otherValues.multiplier,
          openPrice: +otherValues.openPrice,
          sl: otherValues.sl,
          tp: otherValues.tp,
          slType: otherValues.slType,
          tpType: otherValues.tpType,
          isToppingUpActive: otherValues.isToppingUpActive,
        };
        const balanceBeforeOrder = getActiveAccountBalance();
        const response = await API.openPendingOrder(modelToPendingOrder);
        notificationStore.notificationMessage = t(
          apiResponseCodeMessages[response.result]
        );
        notificationStore.isSuccessfull =
          response.result === OperationApiResponseCodes.Ok;
        notificationStore.openNotification();
        if (response.result === OperationApiResponseCodes.Ok) {
          API.setKeyValue(
            {
              key: mainAppStore.activeAccount?.isLive
                ? KeysInApi.DEFAULT_INVEST_AMOUNT_REAL
                : KeysInApi.DEFAULT_INVEST_AMOUNT_DEMO,
              value: `${response.order.investmentAmount}`,
            },
            mainAppStore.initModel.tradingUrl
          );
          if (instrumentsStore.activeInstrument) {
            API.setKeyValue(
              {
                key: `mult_${instrumentsStore.activeInstrument.instrumentItem.id
                  .trim()
                  .toLowerCase()}`,
                value: `${
                  response.order?.multiplier || modelToSubmit.multiplier
                }`,
              },
              mainAppStore.initModel.tradingUrl
            );
          }
          mixpanel.track(mixpanelEvents.LIMIT_ORDER, {
            [mixapanelProps.AMOUNT]: response.order.investmentAmount,
            [mixapanelProps.ACCOUNT_CURRENCY]:
              mainAppStore.activeAccount?.currency || '',
            [mixapanelProps.INSTRUMENT_ID]: response.order.instrument,
            [mixapanelProps.MULTIPLIER]:
              response.order?.multiplier || modelToPendingOrder.multiplier,
            [mixapanelProps.TREND]:
              response.order.operation === AskBidEnum.Buy ? 'buy' : 'sell',
            [mixapanelProps.SL_TYPE]:
              response.order.slType !== null
                ? mixpanelValues[response.order.slType]
                : null,
            [mixapanelProps.TP_TYPE]:
              response.order.tpType !== null
                ? mixpanelValues[response.order.tpType]
                : null,
            [mixapanelProps.SL_VALUE]:
              response.order.sl !== null ? Math.abs(response.order.sl) : null,
            [mixapanelProps.TP_VALUE]: response.order.tp,
            [mixapanelProps.SAVE_POSITION]: `false`,
            [mixapanelProps.AVAILABLE_BALANCE]: balanceBeforeOrder,
            [mixapanelProps.ACCOUNT_ID]: mainAppStore.activeAccount?.id || '',
            [mixapanelProps.ACCOUNT_TYPE]: mainAppStore.activeAccount?.isLive
              ? 'real'
              : 'demo',
            [mixapanelProps.EVENT_REF]: mixpanelValues.PORTFOLIO,
            [mixapanelProps.POSITION_ID]: response.order.id,
          });
          push(Page.DASHBOARD);
        } else {
          mixpanel.track(mixpanelEvents.LIMIT_ORDER_FAILED, {
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
            [mixapanelProps.SAVE_POSITION]: `false`,
            [mixapanelProps.AVAILABLE_BALANCE]: balanceBeforeOrder,
            [mixapanelProps.ACCOUNT_ID]: mainAppStore.activeAccount?.id || '',
            [mixapanelProps.ACCOUNT_TYPE]: mainAppStore.activeAccount?.isLive
              ? 'real'
              : 'demo',
            [mixapanelProps.ERROR_TEXT]:
              apiResponseCodeMessages[response.result],
            [mixapanelProps.EVENT_REF]: mixpanelValues.PORTFOLIO,
          });
        }
      } catch (error) {}
    } else {
      try {
        const balanceBeforeOrder = getActiveAccountBalance();
        const response = await API.openPosition(modelToSubmit);
        if (response.result === OperationApiResponseCodes.Ok) {
          markersOnChartStore.addNewMarker(response.position);
          API.setKeyValue(
            {
              key: mainAppStore.activeAccount?.isLive
                ? KeysInApi.DEFAULT_INVEST_AMOUNT_REAL
                : KeysInApi.DEFAULT_INVEST_AMOUNT_DEMO,
              value: `${response.position.investmentAmount}`,
            },
            mainAppStore.initModel.tradingUrl
          );
          if (instrumentsStore.activeInstrument) {
            API.setKeyValue(
              {
                key: `mult_${instrumentsStore.activeInstrument.instrumentItem.id
                  .trim()
                  .toLowerCase()}`,
                value: `${
                  response.position?.multiplier || modelToSubmit.multiplier
                }`,
              },
              mainAppStore.initModel.tradingUrl
            );
          }
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
              positionId: response.position?.id,
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
            [mixapanelProps.MULTIPLIER]: values.multiplier,
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
            [mixapanelProps.SAVE_POSITION]: `false`,
            [mixapanelProps.AVAILABLE_BALANCE]: balanceBeforeOrder,
            [mixapanelProps.ACCOUNT_ID]: mainAppStore.activeAccount?.id || '',
            [mixapanelProps.ACCOUNT_TYPE]: mainAppStore.activeAccount?.isLive
              ? 'real'
              : 'demo',
            [mixapanelProps.EVENT_REF]: mixpanelValues.PORTFOLIO,
            [mixapanelProps.POSITION_ID]: response.position.id,
          });
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
            [mixapanelProps.SAVE_POSITION]: `false`,
            [mixapanelProps.AVAILABLE_BALANCE]: balanceBeforeOrder,
            [mixapanelProps.ACCOUNT_ID]: mainAppStore.activeAccount?.id || '',
            [mixapanelProps.ACCOUNT_TYPE]: mainAppStore.activeAccount?.isLive
              ? 'real'
              : 'demo',
            [mixapanelProps.ERROR_TEXT]:
              apiResponseCodeMessages[response.result],
            [mixapanelProps.EVENT_REF]: mixpanelValues.PORTFOLIO,
          });

          notificationStore.notificationMessage = t(
            apiResponseCodeMessages[response.result]
          );
          notificationStore.isSuccessfull = false;
          notificationStore.openNotification();
        }
      } catch (error) {}
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

  const openPriceOnBeforeInputHandler = (e: any) => {
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
    const regex = `^[0-9]{1,7}([,.][0-9]{1,${
      instrumentsStore.activeInstrument!.instrumentItem.digits
    }})?$`;
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

  const openPriceOnChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let filteredValue: any = e.target.value.replace(',', '.');
    setFieldValue(Fields.PURCHASE_AT, filteredValue);
    setFieldError(Fields.PURCHASE_AT, '');
  };

  const checkEmpty = (e: FocusEvent<HTMLInputElement>) => {
    const checkedValue: any = e.target.value;
    if (!checkedValue.length) {
      setFieldValue(
        Fields.AMOUNT,
        mainAppStore.activeAccount?.isLive
          ? DEFAULT_INVEST_AMOUNT_LIVE
          : DEFAULT_INVEST_AMOUNT_DEMO
      );
      setFieldError(Fields.AMOUNT, '');
    }
  };

  const handleFocusAtPurchase = () => {
    if (purchaseField !== null) {
      setTimeout(() => {
        orderWrapper.current.scrollTop = 1000;
        // @ts-ignore
        purchaseField.current.scrollIntoView();
      }, 300);
      setIsKeyboard(true);
    }
  };

  const handleBlurAtPurchase = () => {
    setIsKeyboard(false);
  };

  const handleSLTPClick = (isSL: boolean) => () => {
    SLTPStore.setIsSLTPMode(true);
    setTimeout(() => {
      const { operation, ...otherValues } = values;
      const modelToSubmit = {
        ...otherValues,
        operation: type === 'buy' ? AskBidEnum.Buy : AskBidEnum.Sell,
        investmentAmount: +otherValues.investmentAmount,
      };
      SLTPStore.setCreatingPosition(modelToSubmit);
      if (isSL) {
        push(Page.SL_CREATE_MAIN);
      } else {
        push(Page.TP_CREATE_MAIN);
      }
    }, 0);
  };

  useEffect(() => {
    setIsLoading(true);
    async function fetchDefaultInvestAmount() {
      try {
        const response: string = await API.getKeyValue(
          mainAppStore.activeAccount?.isLive
            ? KeysInApi.DEFAULT_INVEST_AMOUNT_REAL
            : KeysInApi.DEFAULT_INVEST_AMOUNT_DEMO,
          mainAppStore.initModel.tradingUrl
        );
        if (response.length > 0) {
          setFieldValue(Fields.AMOUNT, parseFloat(response));
        }
        setTimeout(() => {
          setIsLoading(false);
        }, 0);
      } catch (error) {}
    }
    async function fetchMultiplier() {
      if (instrumentsStore.activeInstrument) {
        try {
          const response = await API.getKeyValue(
            `mult_${instrumentsStore.activeInstrument.instrumentItem.id
              .trim()
              .toLowerCase()}`,
            mainAppStore.initModel.tradingUrl
          );
          if (response.length > 0) {
            setFieldValue(Fields.MULTIPLIER, parseInt(response));
          }
          fetchDefaultInvestAmount();
        } catch (error) {
          fetchDefaultInvestAmount();
        }
      }
    }
    fetchMultiplier();
  }, [
    mainAppStore.activeAccount,
    instrumentsStore.activeInstrument,
    mainAppStore.initModel,
  ]);

  useEffect(() => {
    setTimeout(() => {
      if (SLTPStore.creatingPosition && !SLTPStore.isSLTPMode) {
        setFieldValue(Fields.OPERATION, SLTPStore.creatingPosition.operation);
        setFieldValue(Fields.MULTIPLIER, SLTPStore.creatingPosition.multiplier);
        setFieldValue(Fields.AMOUNT, SLTPStore.creatingPosition.investmentAmount);
        setFieldValue(Fields.STOP_LOSS, SLTPStore.creatingPosition.sl);
        setFieldValue(Fields.TAKE_PROFIT, SLTPStore.creatingPosition.tp);
        setFieldValue(Fields.STOP_LOSS_TYPE, SLTPStore.creatingPosition.slType);
        setFieldValue(Fields.TAKE_PROFIT_TYPE, SLTPStore.creatingPosition.tpType);
        setFieldValue(Fields.IS_TOPPING_UP_ACTIVE, SLTPStore.creatingPosition.isToppingUpActive);
        if (SLTPStore.creatingPosition?.openPrice) {
          setFieldValue(Fields.PURCHASE_AT, SLTPStore.creatingPosition.openPrice);
        }
        SLTPStore.setCreatingPosition(null);
      }
    }, 500);
  }, [
    SLTPStore.creatingPosition,
    SLTPStore.isSLTPMode,
  ]);

  useEffect(() => {
    SLTPStore.setIsSLTPMode(false);
    return () => {
      if (!SLTPStore.isSLTPMode) {
        SLTPStore.setCreatingPosition(null);
      }
    }
  }, []);

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
    <BackFlowLayout pageTitle={t(ucFirst(type))}>
      {isLoading ? (
        <LoaderForComponents isLoading={isLoading} />
      ) : (
        <OrderWrapper
          flexDirection="column"
          width="100%"
          position="relative"
          ref={orderWrapper}
        >
          <ActiveInstrumentItem type={type} />
          <CustomForm autoComplete="off" onSubmit={handleSubmit}>
            <FlexContainer flexDirection="column">
              <InputWrap
                flexDirection="column"
                width="100%"
                backgroundColor="rgba(42, 45, 56, 0.5)"
                padding="14px 16px"
                position="relative"
                marginBottom="4px"
                hasError={
                  !!(touched.investmentAmount && errors.investmentAmount)
                }
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
                    {t('Invest')}
                  </PrimaryTextSpan>
                </FlexContainer>
                <FlexContainer justifyContent="flex-end" alignItems="center">
                  {values.investmentAmount && (
                    <PrimaryTextSpan
                      color="#fffccc"
                      fontSize="16px"
                      lineHeight="1"
                    >
                      $
                    </PrimaryTextSpan>
                  )}

                  <InputAutosize
                    inputStyle={{
                      backgroundColor: 'transparent',
                      outline: 'none',
                      border: 'none',
                      fontSize: '16px',
                      color: '#fffccc',
                      fontWeight: 500,
                      lineHeight: '22px',
                      textAlign: 'right',
                      appearance: 'none',
                      padding: 0,
                    }}
                    {...getFieldProps(Fields.AMOUNT)}
                    type="text"
                    inputMode="decimal"
                    onBeforeInput={investOnBeforeInputHandler}
                    onChange={investOnChangeHandler}
                    onBlur={checkEmpty}
                  />
                </FlexContainer>
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
                marginBottom="2px"
                height="52px"
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
                    {t('Multiplier')}
                  </PrimaryTextSpan>
                </FlexContainer>
                <FlexContainer
                  position="absolute"
                  top="0"
                  bottom="0"
                  right="16px"
                  margin="auto"
                  alignItems="center"
                >
                  {/* TODO think about another realization */}
                  <PrimaryTextSpan
                    color="#fffccc"
                    fontSize="16px"
                    lineHeight="1"
                  >
                    x{values.multiplier}
                  </PrimaryTextSpan>
                </FlexContainer>
                <Observer>
                  {() => (
                    <MultiplierSelect
                      dir="rtl"
                      {...getFieldProps(Fields.MULTIPLIER)}
                    >
                      {instrumentsStore
                        .activeInstrument!.instrumentItem.multiplier.slice()
                        .sort((a, b) => b - a)
                        .map((multiplier) => (
                          <MultiplierSelectValue
                            value={multiplier}
                            key={multiplier}
                          >
                            x{multiplier}
                          </MultiplierSelectValue>
                        ))}
                    </MultiplierSelect>
                  )}
                </Observer>
              </FlexContainer>

              <InputWrap
                flexDirection="column"
                width="100%"
                backgroundColor="rgba(42, 45, 56, 0.5)"
                padding="14px 16px"
                position="relative"
                marginBottom="2px"
                hasError={!!(touched.openPrice && errors.openPrice)}
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
                    {t('Purchase at')}
                  </PrimaryTextSpan>
                </FlexContainer>
                <Observer>
                  {() => (
                    <Input
                      {...getFieldProps(Fields.PURCHASE_AT)}
                      type="text"
                      inputMode="decimal"
                      placeholder={`${
                        quotesStore.quotes[
                          instrumentsStore.activeInstrument!.instrumentItem.id
                        ]
                          ? getPlaceholderOpenPrice()
                          : ''
                      }`}
                      onBeforeInput={openPriceOnBeforeInputHandler}
                      onChange={openPriceOnChangeHandler}
                      ref={purchaseField}
                      onFocus={handleFocusAtPurchase}
                      onBlur={handleBlurAtPurchase}
                    />
                  )}
                </Observer>
              </InputWrap>
              {/*<FlexContainer*/}
              {/*  backgroundColor="rgba(42, 45, 56, 0.5)"*/}
              {/*  height="50px"*/}
              {/*  justifyContent="space-between"*/}
              {/*  alignItems="center"*/}
              {/*  padding="0 16px"*/}
              {/*  marginBottom="2px"*/}
              {/*>*/}
              {/*  <PrimaryTextSpan color="#ffffff" fontSize="16px">*/}
              {/*    {t('Stop Loss')}*/}
              {/*  </PrimaryTextSpan>*/}

              {/*  <FlexContainer onClick={handleSLTPClick(true)}>*/}
              {/*    <PrimaryTextSpan*/}
              {/*      color={*/}
              {/*        values.sl !== null*/}
              {/*          ? '#fffccc'*/}
              {/*          : 'rgba(196, 196, 196, 0.5)'*/}
              {/*      }*/}
              {/*      fontSize="16px"*/}
              {/*    >*/}
              {/*      {values.sl !== null ? (*/}
              {/*        <>*/}
              {/*          {values.slType !== TpSlTypeEnum.Price &&*/}
              {/*          '-'}*/}
              {/*          {values.slType !== TpSlTypeEnum.Price &&*/}
              {/*          mainAppStore.activeAccount?.symbol}*/}
              {/*          {values.slType === TpSlTypeEnum.Price*/}
              {/*            ? Math.abs(values.sl).toFixed(*/}
              {/*              getPressision(values.instrumentId)*/}
              {/*            )*/}
              {/*            : Math.abs(values.sl).toFixed(2)}*/}
              {/*        </>*/}
              {/*      ) : (*/}
              {/*        t('Add')*/}
              {/*      )}*/}
              {/*    </PrimaryTextSpan>*/}
              {/*  </FlexContainer>*/}
              {/*</FlexContainer>*/}

              {/*<FlexContainer*/}
              {/*  backgroundColor="rgba(42, 45, 56, 0.5)"*/}
              {/*  height="50px"*/}
              {/*  justifyContent="space-between"*/}
              {/*  alignItems="center"*/}
              {/*  padding="0 16px"*/}
              {/*  marginBottom={*/}
              {/*    touched.openPrice && errors.openPrice ? '4px' : '12px'*/}
              {/*  }*/}
              {/*>*/}
              {/*  <PrimaryTextSpan color="#ffffff" fontSize="16px">*/}
              {/*    {t('Take Profit')}*/}
              {/*  </PrimaryTextSpan>*/}
              {/*  <FlexContainer onClick={handleSLTPClick(false)}>*/}
              {/*    <PrimaryTextSpan*/}
              {/*      color={*/}
              {/*        values.tp !== null*/}
              {/*          ? '#fffccc'*/}
              {/*          : 'rgba(196, 196, 196, 0.5)'*/}
              {/*      }*/}
              {/*      fontSize="16px"*/}
              {/*    >*/}
              {/*      {values.tp !== null ? (*/}
              {/*        <>*/}
              {/*          {values.tpType !== TpSlTypeEnum.Price &&*/}
              {/*          values.tp < 0 &&*/}
              {/*          '-'}*/}
              {/*          {values.tpType !== TpSlTypeEnum.Price &&*/}
              {/*          mainAppStore.activeAccount?.symbol}*/}
              {/*          {values.tpType === TpSlTypeEnum.Price*/}
              {/*            ? Math.abs(values.tp).toFixed(*/}
              {/*              getPressision(values.instrumentId)*/}
              {/*            )*/}
              {/*            : Math.abs(values.tp).toFixed(2)}*/}
              {/*        </>*/}
              {/*      ) : (*/}
              {/*        t('Add')*/}
              {/*      )}*/}
              {/*    </PrimaryTextSpan>*/}
              {/*  </FlexContainer>*/}
              {/*</FlexContainer>*/}
              {touched.openPrice && errors.openPrice && (
                <FlexContainer marginBottom="12px" padding="0 16px">
                  <PrimaryTextSpan fontSize="11px" color={Colors.RED}>
                    {errors.openPrice}
                  </PrimaryTextSpan>
                </FlexContainer>
              )}

              <FlexContainer
                width="100%"
                padding="14px 16px 0"
                justifyContent="space-between"
                alignItems="center"
                marginBottom="4px"
              >
                <PrimaryTextSpan color="#ffffff" fontSize="16px" lineHeight="1">
                  {t('Spread')}
                </PrimaryTextSpan>
                <PrimaryTextSpan color="#FFFCCC" fontSize="16px" lineHeight="1">
                  {quotesStore.quotes[
                    instrumentsStore.activeInstrument!.instrumentItem.id
                  ] &&
                    (currentPriceAsk() - currentPriceBid()).toFixed(
                      instrumentsStore.activeInstrument!.instrumentItem.digits
                    )}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer
                width="100%"
                padding="14px 16px"
                justifyContent="space-between"
                alignItems="center"
                marginBottom="4px"
              >
                <PrimaryTextSpan color="#ffffff" fontSize="16px" lineHeight="1">
                  {t('Commission')}
                </PrimaryTextSpan>
                <PrimaryTextSpan color="#FFFCCC" fontSize="16px" lineHeight="1">
                  $0.00
                </PrimaryTextSpan>
              </FlexContainer>
            </FlexContainer>
            <ConfirmButton
              type="submit"
              actionType={type}
              disabled={isSubmitting}
              hide={isKeyboard}
            >
              {t('Confirm')} {mainAppStore.activeAccount?.symbol}
              {values.investmentAmount}
            </ConfirmButton>
          </CustomForm>
        </OrderWrapper>
      )}
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

const OrderWrapper = styled(FlexContainer)`
  overflow-y: auto;
`;

const ConfirmButton = styled(ButtonWithoutStyles)<{
  actionType?: string;
  hide?: boolean;
}>`
  background-color: ${(props) =>
    props.actionType === 'buy' ? Colors.ACCENT_BLUE : Colors.RED};
  color: ${(props) => (props.actionType === 'buy' ? '#252636' : '#ffffff')};
  min-height: 56px;
  border-radius: 8px;
  font-size: 16px;
  line-height: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  position: ${(props) => (props.hide ? 'static' : 'sticky')};
  margin: 16px auto;
  bottom: 16px;
  left: 16px;
  right: 16px;
  width: 100%;
  max-width: calc(100% - 32px);
  z-index: 1;
`;

const CustomForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  margin: 0;
`;

const MultiplierSelect = styled.select`
  background: #000;
  outline: none;
  appearance: none;
  opacity: 0;
  font-size: 16px;
  position: absolute;
  width: 100%;
  z-index: 2;
`;
const MultiplierSelectValue = styled.option``;

const Input = styled.input<{ autocomplete?: string }>`
  background-color: transparent;
  margin: 0;
  padding: 0;
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

const InputAutosize = styled(AutosizeInput)``;

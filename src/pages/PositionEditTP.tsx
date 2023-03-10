import styled from '@emotion/styled';
import * as yup from 'yup';
import { useFormik } from 'formik';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import BackFlowLayout from '../components/BackFlowLayout';
import LoaderForComponents from '../components/LoaderForComponents';
import SlideCheckbox from '../components/SlideCheckbox';
import Colors from '../constants/Colors';
import { AskBidEnum } from '../enums/AskBid';
import { TpSlTypeEnum } from '../enums/TpSlTypeEnum';
import { getProcessId } from '../helpers/getProcessId';
import { useStores } from '../hooks/useStores';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { InstrumentModelWSDTO } from '../types/InstrumentsTypes';
import { PositionModelWSDTO, UpdateSLTP } from '../types/Positions';
import { observer } from 'mobx-react-lite';
import API from '../helpers/API';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import apiResponseCodeMessages from '../constants/apiResponseCodeMessages';
import calculateFloatingProfitAndLoss from '../helpers/calculateFloatingProfitAndLoss';
import Page from '../constants/Pages';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import mixapanelProps from '../constants/mixpanelProps';
import mixpanelValues from '../constants/mixpanelValues';

const PositionEditTP = observer(() => {
  const { id } = useParams<{ id: string }>();
  const positionId = +id;
  const { t } = useTranslation();
  const { goBack, push } = useHistory();

  const {
    mainAppStore,
    quotesStore,
    instrumentsStore,
    notificationStore,
  } = useStores();

  const [position, setPosition] = useState<PositionModelWSDTO>();
  const [instrument, setInstrument] = useState<InstrumentModelWSDTO>();
  const [activeSL, setActiveSL] = useState(true);
  const [loading, setLoading] = useState(false);

  const initialValues = useCallback(() => {
    let value: UpdateSLTP['tp'] = null;
    let price: UpdateSLTP['tp'] = null;

    if (position?.tpType === TpSlTypeEnum.Currency) {
      value = position.tp !== null ? +Math.abs(position.tp).toFixed(2) : null;
    }

    if (position?.tpType === TpSlTypeEnum.Price) {
      price =
        position.tp !== null
          ? +position.tp.toFixed(instrument?.digits || 2)
          : null;
    }

    const valueSL = (position && Math.abs(position.sl || 0)) || null;

    return {
      toggle: true,
      value,
      price,
      valueSL,
      operation: position?.operation,
    };
  }, [position]);

  const currentPriceAsk = useCallback(() => {
    if (instrument && quotesStore.quotes[instrument.id]) {
      return quotesStore.quotes[instrument.id].ask.c;
    }
    return 0;
  }, [instrument, position, quotesStore.quotes]);

  const currentPriceBid = useCallback(() => {
    if (instrument && quotesStore.quotes[instrument.id]) {
      return quotesStore.quotes[instrument.id].bid.c;
    }
    return 0;
  }, [instrument, position, quotesStore.quotes]);

  const PnL = useCallback(() => {
    if (position) {
      return calculateFloatingProfitAndLoss({
        investment: position.investmentAmount,
        multiplier: position.multiplier,
        costs: position.swap + position.commission,
        side: position.operation === AskBidEnum.Buy ? 1 : -1,
        currentPrice:
          position.operation === AskBidEnum.Buy
            ? currentPriceBid()
            : currentPriceAsk(),
        openPrice: position.openPrice,
      });
    }
    return 0;
  }, [currentPriceBid, currentPriceAsk, position]);

  const validationSchema = useCallback(
    () =>
      yup.object().shape({
        value: yup
          .number()
          .nullable()
          .test('value', t('Take Profit can not be zero'), (value) => {
            return value === null || value !== 0;
          })
          .test(
            'value',
            t('Take profit level should be higher than the current P/L'),
            (value) => value === null || value > PnL()
          ),
        price: yup
          .number()
          .nullable()
          .test('price', t('Take Profit can not be zero'), (value) => {
            return value !== 0;
          })
          .when(['operation', 'value'], {
            is: (operation, value) =>
              operation === AskBidEnum.Buy && value === null,
            then: yup
              .number()
              .nullable()
              .test(
                'price',
                `${t(
                  'This level is higher or lower than the one currently allowed'
                )}`,
                (value) => value === null || value > currentPriceBid()
              ),
          })
          .when(['operation', 'value'], {
            is: (operation, value) =>
              operation === AskBidEnum.Sell && value === null,
            then: yup
              .number()
              .nullable()
              .test(
                'price',
                `${t(
                  'This level is higher or lower than the one currently allowed'
                )}`,
                (value) => value === null || value < currentPriceAsk()
              ),
          }),
      }),
    [position]
  );

  const handleSubmitForm = async () => {
    const valuesToSubmit: UpdateSLTP = {
      processId: getProcessId(),
      accountId: mainAppStore.activeAccount?.id || '',
      positionId: positionId,

      tp: values.value !== null ? values.value : values.price,
      tpType:
        values.value === null && values.price === null
          ? null
          : values.value !== null
          ? TpSlTypeEnum.Currency
          : TpSlTypeEnum.Price,

      sl: values.valueSL,
      slType: position?.sl ? position.slType : null,
    };

    setLoading(true);
    try {
      const response = await API.updateSLTP(valuesToSubmit);
      if (response.result === OperationApiResponseCodes.Ok) {
        mixpanel.track(mixpanelEvents.EDIT_SLTP, {
          [mixapanelProps.AMOUNT]: response.position.investmentAmount,
          [mixapanelProps.ACCOUNT_CURRENCY]:
            mainAppStore.activeAccount?.currency || '',
          [mixapanelProps.INSTRUMENT_ID]: response.position.instrument,
          [mixapanelProps.MULTIPLIER]: position?.multiplier,
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
          [mixapanelProps.SAVE_POSITION]: `${position?.isToppingUpActive || false}`,
          [mixapanelProps.AVAILABLE_BALANCE]:
            mainAppStore.activeAccount?.balance || 0,
          [mixapanelProps.ACCOUNT_ID]: mainAppStore.activeAccount?.id || '',
          [mixapanelProps.ACCOUNT_TYPE]: mainAppStore.activeAccount?.isLive
            ? 'real'
            : 'demo',
          [mixapanelProps.EVENT_REF]: mixpanelValues.PORTFOLIO,
          [mixapanelProps.POSITION_ID]: response.position.id,
        });
        goBack();
      } else {
        mixpanel.track(mixpanelEvents.EDIT_SLTP_FAILED, {
          [mixapanelProps.AMOUNT]: position?.investmentAmount,
          [mixapanelProps.ACCOUNT_CURRENCY]:
            mainAppStore.activeAccount?.currency || '',
          [mixapanelProps.INSTRUMENT_ID]: position?.instrument,
          [mixapanelProps.MULTIPLIER]: position?.multiplier,
          [mixapanelProps.TREND]:
            position?.operation === AskBidEnum.Buy ? 'buy' : 'sell',
          [mixapanelProps.SL_TYPE]:
            valuesToSubmit.slType !== null
              ? mixpanelValues[valuesToSubmit.slType]
              : null,
          [mixapanelProps.TP_TYPE]:
            valuesToSubmit.tpType !== null
              ? mixpanelValues[valuesToSubmit.tpType]
              : null,
          [mixapanelProps.SL_VALUE]:
            valuesToSubmit.sl !== null ? Math.abs(valuesToSubmit.sl) : null,
          [mixapanelProps.TP_VALUE]: valuesToSubmit.tp,
          [mixapanelProps.AVAILABLE_BALANCE]:
            mainAppStore.activeAccount?.balance || 0,
          [mixapanelProps.ACCOUNT_ID]: mainAppStore.activeAccount?.id || '',
          [mixapanelProps.ACCOUNT_TYPE]: mainAppStore.activeAccount?.isLive
            ? 'real'
            : 'demo',
          [mixapanelProps.EVENT_REF]: mixpanelValues.PORTFOLIO,
        });
        setLoading(false);
        notificationStore.notificationMessage = t(
          apiResponseCodeMessages[response.result]
        );
        notificationStore.isSuccessfull = false;
        notificationStore.openNotification();
      }


    } catch (error) {
      setLoading(false);
    }
  };

  const {
    values,
    setFieldValue,
    setFieldError,
    handleSubmit,
    touched,
    errors,
    dirty,
    setTouched,
    isValid
  } = useFormik({
    initialValues: initialValues(),
    enableReinitialize: true,
    onSubmit: handleSubmitForm,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
  });

  const handleToggleSlideSLTP = (on: boolean) => {
    setActiveSL(on);
    if (!on) {
      setFieldValue('value', null);
      setFieldValue('price', null);
    }
    setTouched({ toggle: true });
  };

  const handleBeforeInput = (fieldType: TpSlTypeEnum | null) => (e: any) => {
    let PRECISION = 2;

    switch (fieldType) {
      case TpSlTypeEnum.Currency:
        PRECISION = 2;
        break;
      case TpSlTypeEnum.Price:
        PRECISION = instrument?.digits || 2;
        break;
      default:
        break;
    }

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
    const regex = `^[0-9]{1,7}([,.][0-9]{1,${PRECISION}})?$`;
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

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldError('value', '');
    setFieldError('price', '');
    setFieldValue(e.target.name, e.target.value.replace(',', '.') || null);

    switch (e.target.name) {
      case 'value':
        setFieldValue('price', null);
        break;

      case 'price':
        setFieldValue('value', null);
        break;

      default:
        break;
    }
  };

  const handleBlurInput = (e: ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case 'value':
        setFieldValue(
          'value',
          e.target.value ? +(+e.target.value).toFixed(2) : null
        );
        break;

      case 'price':
        setFieldValue(
          'price',
          e.target.value
            ? Number(e.target.value).toFixed(instrument?.digits || 2)
            : null
        );
        break;
    }
  };

  const valueWithPrecision = () => {
    switch (position?.tpType) {
      case TpSlTypeEnum.Currency:
        setFieldValue('value', position?.tp !== null
          ? Math.abs(position.tp).toFixed(2)
          : position?.tp);
        break;

      case TpSlTypeEnum.Price:
        setFieldValue(
          'price',
          position?.tp !== null
            ? Math.abs(position.tp).toFixed(instrument?.digits || 2)
            : position?.tp
        );
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    valueWithPrecision();
  }, [position, instrument]);

  useEffect(() => {
    const pos = quotesStore.activePositions.find(
      (pos) => pos.id === positionId
    );
    if (pos) {
      setPosition(pos);
      const instr = instrumentsStore.instruments.find(
        (inst) => inst.instrumentItem.id === pos.instrument
      )?.instrumentItem;
      setInstrument(instr);
    }
    if (quotesStore.activePositions && !pos) {
      push(Page.PORTFOLIO_MAIN);
    }
  }, [quotesStore.activePositions]);

  useEffect(() => {
    if (!isValid) {
      const valuesToSubmit: UpdateSLTP = {
        processId: getProcessId(),
        accountId: mainAppStore.activeAccount?.id || '',
        positionId: positionId,
        tp: values.value !== null ? values.value : values.price,
        tpType:
          values.value === null && values.price === null
            ? null
            : values.value !== null
            ? TpSlTypeEnum.Currency
            : TpSlTypeEnum.Price,

        sl: values.valueSL,
        slType: position?.sl ? position.slType : null,
      };
      mixpanel.track(mixpanelEvents.EDIT_SLTP_FAILED, {
        [mixapanelProps.AMOUNT]: position?.investmentAmount,
        [mixapanelProps.ACCOUNT_CURRENCY]:
        mainAppStore.activeAccount?.currency || '',
        [mixapanelProps.INSTRUMENT_ID]: position?.instrument,
        [mixapanelProps.MULTIPLIER]: position?.multiplier,
        [mixapanelProps.TREND]:
          position?.operation === AskBidEnum.Buy ? 'buy' : 'sell',
        [mixapanelProps.SL_TYPE]:
          valuesToSubmit.slType !== null
            ? mixpanelValues[valuesToSubmit.slType]
            : null,
        [mixapanelProps.TP_TYPE]:
          valuesToSubmit.tpType !== null
            ? mixpanelValues[valuesToSubmit.tpType]
            : null,
        [mixapanelProps.SL_VALUE]:
          valuesToSubmit.sl !== null ? Math.abs(valuesToSubmit.sl) : null,
        [mixapanelProps.TP_VALUE]: valuesToSubmit.tp,
        [mixapanelProps.AVAILABLE_BALANCE]:
        mainAppStore.activeAccount?.balance || 0,
        [mixapanelProps.ACCOUNT_ID]: mainAppStore.activeAccount?.id || '',
        [mixapanelProps.ACCOUNT_TYPE]: mainAppStore.activeAccount?.isLive
          ? 'real'
          : 'demo',
        [mixapanelProps.EVENT_REF]: mixpanelValues.PORTFOLIO,
      });
    }
  }, [isValid]);

  if (!mainAppStore.activeAccount || !position || loading) {
    return <LoaderForComponents isLoading={true} />;
  }

  return (
    <BackFlowLayout pageTitle={t('Take Profit')}>
      <LoaderForComponents isLoading={loading} />
      <CustomForm noValidate onSubmit={handleSubmit}>
        {((dirty && touched.toggle && !activeSL) ||
          (dirty && values.value !== null && values.price !== null) ||
          (dirty && (values.value !== null || values.price !== null))) && (
          <FlexContainer
            position="absolute"
            right="16px"
            top="16px"
            zIndex="300"
          >
            <ButtonWithoutStyles type="submit">
              <PrimaryTextSpan fontSize="16px" color="#ffffff">
                {t('Save')}
              </PrimaryTextSpan>
            </ButtonWithoutStyles>
          </FlexContainer>
        )}
        <FlexContainer width="100%" flexDirection="column">
          <FlexContainer
            backgroundColor="rgba(42, 45, 56, 0.5)"
            height="50px"
            justifyContent="space-between"
            alignItems="center"
            padding="0 16px"
            marginBottom="1px"
          >
            <PrimaryTextSpan color="#ffffff" fontSize="16px">
              {t('Take Profit')}
            </PrimaryTextSpan>

            <SlideCheckbox
              isActive={activeSL}
              handleClick={handleToggleSlideSLTP}
            />
          </FlexContainer>

          <FlexContainer flexDirection="column" width="100%">
            <InputWrap
              flexDirection="column"
              width="100%"
              backgroundColor="rgba(42, 45, 56, 0.5)"
              padding="12px 16px"
              position="relative"
              marginBottom="1px"
              hasError={!!(touched.value && errors.value)}
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
                  {t('Value')}, $
                </PrimaryTextSpan>
              </FlexContainer>
              <Input
                autoFocus
                name="value"
                id="value"
                type="text"
                inputMode="decimal"
                placeholder="30.00"
                readOnly={!activeSL}
                onBeforeInput={handleBeforeInput(TpSlTypeEnum.Currency)}
                value={values.value || ''}
                onBlur={handleBlurInput}
                onChange={handleChangeInput}
              />
            </InputWrap>
            {touched.value && errors.value && (
              <FlexContainer padding="12px 16px">
                <PrimaryTextSpan fontSize="11px" color={Colors.RED}>
                  {errors.value}
                </PrimaryTextSpan>
              </FlexContainer>
            )}
          </FlexContainer>

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
              marginBottom="1px"
              hasError={!!(touched.price && errors.price)}
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
                  {t('Price')}
                </PrimaryTextSpan>
              </FlexContainer>
              <Input
                name="price"
                id="price"
                type="text"
                inputMode="decimal"
                onBlur={handleBlurInput}
                placeholder={
                  position.operation === AskBidEnum.Buy
                    ? currentPriceBid().toFixed(instrument?.digits)
                    : currentPriceAsk().toFixed(instrument?.digits)
                }
                readOnly={!activeSL}
                value={values.price || ''}
                onBeforeInput={handleBeforeInput(TpSlTypeEnum.Price)}
                onChange={handleChangeInput}
              />
            </InputWrap>

            <FlexContainer padding="12px 16px">
              {touched.price && errors.price ? (
                <PrimaryTextSpan fontSize="11px" color={Colors.RED}>
                  {errors.price}
                </PrimaryTextSpan>
              ) : (
                <PrimaryTextSpan
                  fontSize="11px"
                  color="rgba(196, 196, 196, 0.5)"
                >
                  {t('Current price')}&nbsp;
                  {position.operation === AskBidEnum.Buy
                    ? currentPriceBid().toFixed(instrument?.digits)
                    : currentPriceAsk().toFixed(instrument?.digits)}
                </PrimaryTextSpan>
              )}
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      </CustomForm>
    </BackFlowLayout>
  );
});

export default PositionEditTP;

const CustomForm = styled.form`
  margin: 0;
  width: 100%;
  height: 100%;
`;

const InputWrap = styled(FlexContainer)`
  border-bottom: 2px solid
    ${(props) => (props.hasError ? Colors.RED : 'transparent')};

  input {
    color: ${(props) => props.hasError && Colors.RED};
  }
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

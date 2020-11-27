import styled from '@emotion/styled';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { observer } from 'mobx-react-lite';
import React, {
  ChangeEvent,
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import BackFlowLayout from '../components/BackFlowLayout';
import SlideCheckbox from '../components/SlideCheckbox';
import Colors from '../constants/Colors';
import { useStores } from '../hooks/useStores';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { useHistory, useParams } from 'react-router-dom';
import { PositionModelWSDTO, UpdateSLTP } from '../types/Positions';
import LoaderForComponents from '../components/LoaderForComponents';
import { InstrumentModelWSDTO } from '../types/InstrumentsTypes';
import { AskBidEnum } from '../enums/AskBid';
import { TpSlTypeEnum } from '../enums/TpSlTypeEnum';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { getProcessId } from '../helpers/getProcessId';
import API from '../helpers/API';
import InputMaskedField from '../components/InputMaskedField';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import apiResponseCodeMessages from '../constants/apiResponseCodeMessages';
import calculateFloatingProfitAndLoss from '../helpers/calculateFloatingProfitAndLoss';
import Page from '../constants/Pages';

const PositionEditSL = observer(() => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const valueInput = useRef<HTMLInputElement>(null);

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
    let value: UpdateSLTP['sl'] = null;
    let price: UpdateSLTP['sl'] = null;

    if (position?.slType === TpSlTypeEnum.Currency) {
      value = position.sl !== null ? +Math.abs(position.sl).toFixed(2) : null;
    }

    if (position?.slType === TpSlTypeEnum.Price) {
      price =
        position.sl !== null
          ? +position.sl.toFixed(instrument?.digits || 2)
          : null;
    }

    const valueTp = position?.tp || null;

    return {
      toggle: true,
      value,
      price,
      valueTp,
      slType: position?.slType,
      operation: position?.operation,
    };
  }, [position, instrument]);

  const currentPriceAsk = useCallback(() => {
    if (instrument) {
      return quotesStore.quotes[instrument.id].ask.c;
    }
    return 0;
  }, [instrument, quotesStore.quotes]);

  const currentPriceBid = useCallback(() => {
    if (instrument) {
      return quotesStore.quotes[instrument.id].bid.c;
    }
    return 0;
  }, [instrument, quotesStore.quotes]);

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
          .test('value', t('Stop Loss can not be zero'), (value) => {
            return value !== 0;
          })
          .test(
            'value',
            t('Stop loss level should be lower than the current P/L'),
            (value) => value === null || -1 * Math.abs(value) < PnL()
          )
          .test(
            'value',
            t('Stop loss level can not be higher than the Invest amount'),
            (value) => {
              if (position) {
                return (
                  value === null ||
                  Math.abs(value) <= +position.investmentAmount
                );
              }
              return false;
            }
          ),

        price: yup
          .number()
          .nullable()
          .test('price', t('Stop Loss can not be zero'), (value) => {
            return value !== 0 || value === null;
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
                (value) => value === null || value < currentPriceBid()
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
                (value) => value === null || value > currentPriceAsk()
              ),
          }),
      }),
    [position]
  );

  const handleSubmitForm = async () => {
    const valuesToSubmit: UpdateSLTP = {
      processId: getProcessId(),
      accountId: mainAppStore.activeAccount?.id || '',
      positionId: +id || 0,
      sl: values.value !== null ? Math.abs(values.value) : values.price,
      tp: values.valueTp,
      slType:
        values.value === null && values.price === null
          ? null
          : values.value !== null
          ? TpSlTypeEnum.Currency
          : TpSlTypeEnum.Price,

      tpType: position?.tp ? position.tpType : null,
    };

    setLoading(true);
    try {
      const response = await API.updateSLTP(valuesToSubmit);
      if (response.result === OperationApiResponseCodes.Ok) {
        goBack();
      } else {
        notificationStore.notificationMessage = t(
          apiResponseCodeMessages[response.result]
        );
        notificationStore.isSuccessfull = false;
        notificationStore.openNotification();
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const {
    values,
    setFieldValue,
    handleSubmit,
    touched,
    getFieldProps,
    errors,
    dirty,
    setTouched,
  } = useFormik({
    initialValues: initialValues(),
    enableReinitialize: true,
    onSubmit: handleSubmitForm,
    validationSchema,
    validateOnBlur: true,
    validateOnChange: true,
  });

  const handleToggleSlideSLTP = (on: boolean) => {
    setActiveSL(on);
    if (!on) {
      setFieldValue('value', null);
      setFieldValue('price', null);
    } else {
      valueInput.current?.focus();
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

    const currTargetValue = e.currentTarget.value.replace('- ', '');
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
    const newValue =
      +e.target.value === 0
        ? e.target.value
        : e.target.value.replace('- ', '').replace(',', '.') || null;
    setFieldValue(e.target.name, newValue);

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
    const value = +e.target.value.replace('- ', '');
    switch (e.target.name) {
      case 'value':
        setFieldValue(
          'value',
          +value === 0 ? value : value ? value.toFixed(2) : null
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

  const renderNegativeValue = useCallback(() => {
    if (values.value !== null && +values.value === 0) {
      return values.value;
    }
    if (values.value && values.value !== null) {
      return `- ${values.value}`;
    } else {
      return '';
    }
  }, [values.value]);

  useEffect(() => {
    const pos = quotesStore.activePositions.find((pos) => pos.id === +id);
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

  if (!mainAppStore.activeAccount || !position) {
    return <LoaderForComponents isLoading={true} />;
  }

  return (
    <BackFlowLayout pageTitle={'Stop Loss'}>
      <LoaderForComponents isLoading={loading} />
      <CustomForm noValidate onSubmit={handleSubmit}>
        {((touched.toggle && !activeSL) ||
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
              {t('Stop Loss')}
            </PrimaryTextSpan>

            <SlideCheckbox
              isActive={activeSL}
              handleClick={handleToggleSlideSLTP}
            />
          </FlexContainer>

          <FlexContainer flexDirection="column" width="100%">
            <InputWrap
              width="100%"
              backgroundColor="rgba(42, 45, 56, 0.5)"
              padding="12px 16px"
              position="relative"
              marginBottom="1px"
              hasError={!!(touched.value && errors.value)}
              justifyContent="space-between"
              alignItems="center"
            >
              <PrimaryTextSpan color="#ffffff" fontSize="16px" lineHeight="1">
                {t('Value')}, $
              </PrimaryTextSpan>
              <FlexContainer justifyContent="flex-end" alignItems="center">
                {/* {values.value !== null && (
                  <ExtraMinus
                    color={
                      touched.value && errors.value ? Colors.RED : '#ffffff'
                    }
                    fontSize="16px"
                    lineHeight="1"
                  >
                    -
                  </ExtraMinus>
                )} */}
                <Input
                  ref={valueInput}
                  customWidth={'auto'}
                  name="value"
                  id="value"
                  type="text"
                  inputMode="decimal"
                  placeholder="-30.00"
                  readOnly={!activeSL}
                  onBeforeInput={handleBeforeInput(TpSlTypeEnum.Currency)}
                  value={renderNegativeValue()}
                  onBlur={handleBlurInput}
                  onChange={handleChangeInput}
                />
              </FlexContainer>
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

export default PositionEditSL;

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

const Input = styled.input<{ autocomplete?: string; customWidth?: string }>`
  background-color: transparent;
  outline: none;
  border: none;
  font-size: 16px;
  color: #fffccc;
  text-align: center;
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
  width: ${(props) => props.customWidth};
`;

const ExtraMinus = styled(PrimaryTextSpan)``;

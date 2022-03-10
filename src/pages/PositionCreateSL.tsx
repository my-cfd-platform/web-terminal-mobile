import styled from '@emotion/styled';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { observer } from 'mobx-react-lite';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
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
import { OpenPositionModelFormik, UpdateSLTP } from '../types/Positions';
import LoaderForComponents from '../components/LoaderForComponents';
import { InstrumentModelWSDTO } from '../types/InstrumentsTypes';
import { AskBidEnum } from '../enums/AskBid';
import { TpSlTypeEnum } from '../enums/TpSlTypeEnum';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import SvgIcon from '../components/SvgIcon';
import IconToppingUpActive from '../assets/svg_no_compress/topping-up/icon-topping-up-active.svg';
import IconToppingUpInUse from '../assets/svg_no_compress/topping-up/icon-topping-up-active-in-use.svg';

const PositionCreateSL = observer(() => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { goBack, push } = useHistory();

  const {
    mainAppStore,
    quotesStore,
    instrumentsStore,
    notificationStore,
    SLTPStore,
  } = useStores();

  const [position, setPosition] = useState<OpenPositionModelFormik>();
  const [instrument, setInstrument] = useState<InstrumentModelWSDTO>();
  const [activeSL, setActiveSL] = useState(true);
  const [loading, setLoading] = useState(false);

  const initialValues = useCallback(() => {
    let value: UpdateSLTP['sl'] = null;
    let price: UpdateSLTP['sl'] = null;

    switch (position?.slType) {
      case TpSlTypeEnum.Currency:
        value = position.sl !== null ? +Math.abs(position.sl).toFixed(2) : null;
        break;

      case TpSlTypeEnum.Price:
        price =
          position?.sl !== null
            ? +Math.abs(position.sl).toFixed(instrument?.digits || 2)
            : null;
        break;

      default:
        break;
    }

    const valueTp = position?.tp || null;

    return {
      toggle: true,
      value,
      price,
      valueTp,
      slType: position?.slType,
      operation: position?.operation,
      isToppingUpActive: position?.isToppingUpActive || false,
    };
  }, [position, instrument]);

  const currentPriceAsk = useCallback(() => {
    if (instrument && quotesStore.quotes[instrument.id]) {
      return quotesStore.quotes[instrument.id].ask.c;
    }
    return 0;
  }, [instrument, quotesStore.quotes]);

  const currentPriceBid = useCallback(() => {
    if (instrument && quotesStore.quotes[instrument.id]) {
      return quotesStore.quotes[instrument.id].bid.c;
    }
    return 0;
  }, [instrument, quotesStore.quotes]);

  const positionStopOutPriceByValue = (stopLoss: number) => {
    // SL Rate = Current Price + ($SL - Comission) * Сurrent Price /Invest amount *direction*multiplier
    if (position) {
      const isBuy = position.operation === AskBidEnum.Buy;
      const currentPrice = isBuy ? currentPriceAsk() : currentPriceBid();
      const direction = isBuy ? 1 : -1;

      // = Current Price + ($SL - Comission) * Сurrent Price /Invest amount *direction*multiplier
      const posPriceByValue =
        currentPrice +
        ((stopLoss) * currentPrice) /
        (position.investmentAmount * direction * position.multiplier);
    }
  };

  const postitionStopOut = useCallback(() => {
    const invest = position?.investmentAmount || 0;
    const instrumentPercentSL = (instrument?.stopOutPercent || 95) / 100;
    return +Number(invest * instrumentPercentSL).toFixed(2);
  }, [position, instrument]);

  /**
   * SL from price = (Price / Opened Price - 1) * Investment * Multiplier * Direction + Commissions
   */
  const positionStopOutByPrice = useCallback(
    (slPrice: number) => {
      if (position) {
        let currentPrice, so_level, so_percent, direction, isBuy;
        isBuy = position.operation === AskBidEnum.Buy;
        currentPrice =  isBuy ? currentPriceAsk() : currentPriceBid();
        so_level = -1 * postitionStopOut();
        so_percent = (instrument?.stopOutPercent || 0) / 100;
        direction = isBuy ? 1 : -1;

        const result =
          (slPrice / currentPrice - 1) *
          position.investmentAmount *
          position.multiplier *
          direction;
        return +Number(result).toFixed(2);
      }
      return 0;
    },
    [currentPriceAsk, currentPriceBid, position]
  );

  const validationSchema = useCallback(
    () =>
      yup.object().shape({
        value: yup
          .number()
          .nullable()
          .test('value', t('Stop Loss can not be zero'), (value) => {
            return value !== 0;
          }),
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
                (value) => value === null || value < currentPriceAsk()
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
                (value) => value === null || value > currentPriceBid()
              ),
          }),
      }),
    [position, mainAppStore.activeAccount]
  );

  const handleSubmitForm = async () => {
    setLoading(true);
    if (SLTPStore.creatingPosition) {
      const newPosition = {
        ...SLTPStore.creatingPosition,
        slType:
          values.value === null && values.price === null
            ? null
            : values.value !== null
            ? TpSlTypeEnum.Currency
            : TpSlTypeEnum.Price,
        sl: values.value !== null ? Math.abs(values.value) : values.price,
        isToppingUpActive: values.isToppingUpActive
      }
      SLTPStore.setCreatingPosition(newPosition);
    }
    goBack();
  };

  const {
    values,
    setFieldValue,
    handleSubmit,
    touched,
    setFieldError,
    errors,
    dirty,
    setTouched,
  } = useFormik({
    initialValues: initialValues(),
    enableReinitialize: true,
    onSubmit: handleSubmitForm,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
  });

  const valueWithPrecision = () => {
    switch (position?.slType) {
      case TpSlTypeEnum.Currency:
        setFieldValue('value', position?.sl !== null
          ? Math.abs(position.sl).toFixed(2)
          : position?.sl);
        break;

      case TpSlTypeEnum.Price:
        setFieldValue(
          'price',
          position?.sl !== null
            ? Math.abs(position.sl).toFixed(instrument?.digits || 2)
            : position?.sl
        );
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    valueWithPrecision();
  }, [position, instrument]);

  const handleToggleSlideSLTP = (on: boolean) => {
    setActiveSL(on);
    if (!on) {
      setFieldValue('value', null);
      setFieldValue('price', null);
      setFieldValue('isToppingUpActive', false);
    }
    setTouched({ toggle: true });
  };

  const handleToggleToppingUp = (on: boolean) => {
    // when off usebalance
    if (!on) {
      // check price
      if (values.price !== null) {
        const soValue: number = positionStopOutByPrice(values.price);
        if (soValue <= 0 && Math.abs(soValue) > postitionStopOut()) {
          setFieldValue('price', null);
        }
      }
      // check value
      if (values.value !== null) {
        if (values.value >= postitionStopOut()) {
          setFieldValue('value', null);
        }
      }

      if (activeSL) {
        setFieldValue('value', postitionStopOut());
      }
    } else {
      setFieldValue('value', null);
      setFieldValue('price', null);
    }

    setFieldValue('isToppingUpActive', on);
    setTouched({
      isToppingUpActive: true,
    });
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
    setFieldError('value', '');
    setFieldError('price', '');
    const newValue =
      e.target.value === ''
        ? null
        : +e.target.value === 0
          ? e.target.value
          : e.target.value.replace('- ', '').replace(',', '.') || null;

    setFieldValue(e.target.name, newValue);

    switch (e.target.name) {
      case 'value':
        positionStopOutPriceByValue(newValue === null ? 0 : +newValue);
        if (newValue && +newValue > postitionStopOut()) {
          setFieldValue('isToppingUpActive', true);
        } else {
          setFieldValue('isToppingUpActive', false);
        }
        setFieldValue('price', null);
        break;

      case 'price':
        setFieldValue('value', null);
        const soValue = positionStopOutByPrice(
          newValue !== null ? +newValue : 0
        );
        if (
          newValue &&
          soValue <= 0 &&
          Math.abs(soValue) > postitionStopOut()
        ) {
          setFieldValue('isToppingUpActive', true);
        } else {
          setFieldValue('isToppingUpActive', false);
        }
        break;

      default:
        break;
    }
  };

  const handleBlurInput = (e: ChangeEvent<HTMLInputElement>) => {
    const int_value = parseFloat(e.target.value.replace('- ', ''));
    const value = isNaN(int_value) ? null : int_value;

    switch (e.target.name) {
      case 'value':
        setFieldValue('value', value !== null ? value.toFixed(2) : value);
        break;

      case 'price':
        setFieldValue(
          'price',
          value !== null ? value.toFixed(instrument?.digits || 2) : value
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

  const handleClickSubmit = async () => {
    handleSubmit();
  };

  useEffect(() => {
    const pos = SLTPStore.creatingPosition;
    if (pos) {
      setPosition(pos);
      const instr = instrumentsStore.instruments.find(
        (inst) => inst.instrumentItem.id === pos.instrumentId
      )?.instrumentItem;
      setInstrument(instr);
    } else {
      goBack();
    }
  }, [SLTPStore.creatingPosition]);

  if (!mainAppStore.activeAccount || !position || loading) {
    return <LoaderForComponents isLoading={true} />;
  }

  return (
    <BackFlowLayout pageTitle={'Stop Loss'}>
      <LoaderForComponents isLoading={loading} />
      <CustomForm noValidate>
        {((dirty && touched.toggle && !activeSL) ||
          (dirty && values.value !== null && values.price !== null) ||
          (dirty && (values.value !== null || values.price !== null)) ||
          (dirty && touched.isToppingUpActive) ||
          (dirty &&
            values.value !== null &&
            values.price !== null &&
            values.isToppingUpActive !== position.isToppingUpActive)) && (
            <FlexContainer
              position="absolute"
              right="16px"
              top="16px"
              zIndex="300"
            >
              <ButtonWithoutStyles type="button" onClick={handleClickSubmit}>
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
                <Input
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
            marginBottom="40px"
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
                    ? currentPriceAsk().toFixed(instrument?.digits)
                    : currentPriceBid().toFixed(instrument?.digits)
                }
                readOnly={!activeSL}
                value={values.price || ''}
                onBeforeInput={handleBeforeInput(TpSlTypeEnum.Price)}
                onChange={handleChangeInput}
              />
            </InputWrap>

            <FlexContainer padding="12px 16px">
              {touched.price && errors.price ? (
                <PrimaryTextSpan fontSize="13px" color={Colors.RED}>
                  {errors.price}
                </PrimaryTextSpan>
              ) : (
                <PrimaryTextSpan
                  fontSize="13px"
                  color="rgba(196, 196, 196, 0.5)"
                >
                  {t('Current price')}&nbsp;
                  {position.operation === AskBidEnum.Buy
                    ? currentPriceAsk().toFixed(instrument?.digits)
                    : currentPriceBid().toFixed(instrument?.digits)}
                </PrimaryTextSpan>
              )}
            </FlexContainer>
          </FlexContainer>

          <FlexContainer
            backgroundColor="rgba(42, 45, 56, 0.5)"
            height="50px"
            justifyContent="space-between"
            alignItems="center"
            padding="0 16px"
            marginBottom="1px"
          >
            <FlexContainer padding="0 12px 0 0">
              <PrimaryTextSpan color="#ffffff" fontSize="16px">
                {t('Save position from market noise')}
              </PrimaryTextSpan>
            </FlexContainer>

            <SlideCheckbox
              isActive={values.isToppingUpActive}
              handleClick={handleToggleToppingUp}
            />
          </FlexContainer>
          <FlexContainer padding="12px 16px">
            <PrimaryTextSpan
              fontSize="13px"
              color="rgba(196, 196, 196, 0.5)"
              lineHeight="1.4"
            >
              {`${t('If the loss for a position reaches')} ${instrument?.stopOutPercent
                }%, ${t(
                  'an additional 20% of the original investment amount will be reserved from your balance to save your position from closing. If the position takes a further loss, your available balance is reduced by 20% again and again. Once the position rises to at least'
                )} ${instrument?.stopOutPercent}%, ${t(
                  'all previously reserved funds are returned to your balance.'
                )}`}
            </PrimaryTextSpan>
          </FlexContainer>

          <FlexContainer padding="0 16px 12px">
            <PrimaryTextSpan
              fontSize="13px"
              color="rgba(196, 196, 196, 0.5)"
              lineHeight="1.4"
            >
              {t(
                'You can limit the additional funds reserved on your balance by specifying a level of loss that is acceptable to you for this position.'
              )}
            </PrimaryTextSpan>
          </FlexContainer>

          <FlexContainer padding="0 16px 12px" flexDirection="column">
            <FlexContainer alignItems="center">
              <SvgIcon {...IconToppingUpActive} />
              <PrimaryTextSpan
                fontSize="13px"
                color="rgba(196, 196, 196, 0.5)"
                lineHeight="1.4"
              >
                {` - ${t('save position is active')}`}
              </PrimaryTextSpan>
            </FlexContainer>

            <FlexContainer alignItems="flex-start">
              <FlexContainer margin="1px 0 0">
                <SvgIcon {...IconToppingUpInUse} />
              </FlexContainer>
              <PrimaryTextSpan
                fontSize="13px"
                color="rgba(196, 196, 196, 0.5)"
                lineHeight="1.4"
              >
                {` - ${t('save position is active and use available funds')}`}
              </PrimaryTextSpan>
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      </CustomForm>
    </BackFlowLayout>
  );
});

export default PositionCreateSL;

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

import { css } from '@emotion/core';
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
import { useParams } from 'react-router-dom';
import { PositionModelWSDTO, UpdateSLTP } from '../types/Positions';
import LoaderForComponents from '../components/LoaderForComponents';
import { InstrumentModelWSDTO } from '../types/InstrumentsTypes';
import { AskBidEnum } from '../enums/AskBid';
import { TpSlTypeEnum } from '../enums/TpSlTypeEnum';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { getProcessId } from '../helpers/getProcessId';
import API from '../helpers/API';


const PositionEditSL = observer(() => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const {
    mainAppStore,
    quotesStore,
    instrumentsStore,
  } = useStores();

  const [position, setPosition] = useState<PositionModelWSDTO>();
  const [instrument, setInstrument] = useState<InstrumentModelWSDTO>();
  const [activeSL, setActiveSL] = useState(true);

  const initialValues = useCallback(
    () => ({
      value:
        position?.slType === TpSlTypeEnum.Currency
          ? position.sl?.toFixed(2)
          : null,
      price:
        position?.slType === TpSlTypeEnum.Price
          ? position.sl?.toFixed(instrument?.digits || 2)
          : null,
      operation: position?.operation,
    }),
    [position]
  );

  const currentPriceAsk = useCallback(() => {
    if (instrument) {
      return quotesStore.quotes[instrument.id].ask.c;
    }
    return 0;
  }, [instrument, position, quotesStore.quotes]);

  const currentPriceBid = useCallback(() => {
    if (instrument) {
      return quotesStore.quotes[instrument.id].bid.c;
    }
    return 0;
  }, [instrument, position, quotesStore.quotes]);


  const validationSchema = useCallback(
    () =>
      yup.object().shape({
        value: yup
          .number()
          .nullable()
          .test(
            'value',
            t('Stop loss level can not be lower than the Invest amount'),
            function (value) {
              if (position) {
                console.log(value < +position?.investmentAmount);
                return value < +position?.investmentAmount;
              }
              return false;
            }
          ),

        price: yup
          .number()
          .nullable()
          .when(['operation'], {
            is: (operation) => operation === AskBidEnum.Buy,
            then: yup
              .number()
              .nullable()
              .test(
                'price',
                `${t('Error message')}: ${t(
                  'This level is higher or lower than the one currently allowed'
                )}`,
                (value) => value < currentPriceAsk()
              ),
          })
          .when(['operation'], {
            is: (operation) => operation === AskBidEnum.Sell,
            then: yup
              .number()
              .nullable()
              .test(
                'price',
                `${t('Error message')}: ${t(
                  'This level is higher or lower than the one currently allowed'
                )}`,
                (value) => value > currentPriceBid()
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
      sl: values.value?.length
        ? values.value
          ? +values.value
          : null
        : values.price
        ? +values.price
        : null,
      tp: position?.tp || null,
      slType: values.value ? TpSlTypeEnum.Currency : TpSlTypeEnum.Price,
      tpType: position?.tpType || null,
    };

    console.log(valuesToSubmit);

    try {
      const response = await API.updateSLTP(valuesToSubmit);
    } catch (error) {
      console.log(error);
    }
  };

  const {
    values,
    setFieldValue,
    handleSubmit,
    touched,
    errors,
    dirty,
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
    }
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
    setFieldValue(e.target.name, e.target.value.replace(',', '.'));

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
        setFieldValue('value', Number(e.target.value || 0).toFixed(2));
        break;

      default:
        setFieldValue(
          'price',
          Number(e.target.value || 0).toFixed(instrument?.digits || 2)
        );
        break;
    }
  };

  useEffect(() => {
    console.log('useEffect set Position');
    const pos = quotesStore.activePositions.find((pos) => pos.id === +id);
    if (pos) {
      setPosition(pos);

      const instr = instrumentsStore.instruments.find(
        (inst) => inst.instrumentItem.id === pos.instrument
      )?.instrumentItem;
      setInstrument(instr);
    }
  }, [quotesStore.activePositions]);

  if (!mainAppStore.activeAccount || !position) {
    return <LoaderForComponents isLoading={true} />;
  }

  return (
    <BackFlowLayout pageTitle={'Stop Loss'}>
      <CustomForm noValidate onSubmit={handleSubmit}>
        {dirty && (
          <FlexContainer
            position="absolute"
            right="16px"
            top="16px"
            zIndex="300"
          >
            <ButtonWithoutStyles onClick={handleSubmitForm} type="submit">
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
                name="value"
                id="value"
                type="text"
                inputMode="decimal"
                placeholder="-30.00"
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

export default PositionEditSL;

const CustomForm = styled.form`
  margin: 0;
  width: 100%;
  height: 100%;
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

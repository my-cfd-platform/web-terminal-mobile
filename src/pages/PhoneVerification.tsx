import React, { useState, useEffect, FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { useFormik } from 'formik';
import Fields from '../constants/fields';
import AutoCompleteDropdown from '../components/PhoneVerification/AutoCompleteDropdown';
import { PrimaryButton } from '../styles/Buttons';
import styled from '@emotion/styled';
import { PhoneVerificationFormParams } from '../types/PersonalDataTypes';
import { Country } from '../types/CountriesTypes';
import API from '../helpers/API';
import { CountriesEnum } from '../enums/CountriesEnum';
import * as yup from 'yup';
import { useStores } from '../hooks/useStores';
import Page from '../constants/Pages';
import { useHistory } from 'react-router-dom';
import { getProcessId } from '../helpers/getProcessId';
import { useTranslation } from 'react-i18next';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import { Observer } from 'mobx-react-lite';
import Logo from '../components/Logo';
import LogoMonfex from '../assets/images/logo.png';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import mixapanelProps from '../constants/mixpanelProps';
import parsePhoneNumber, { getExampleNumber } from 'libphonenumber-js/max';
import InputMaskedField from '../components/InputMaskedField';
import { fromAlpha3ToAlpha2Code } from '../helpers/fromAlpha3ToAlpha2Code';
import examples from 'libphonenumber-js/examples.mobile.json';

const PhoneVerification: FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [dialMask, setDialMask] = useState('');
  const { t } = useTranslation();
  const validationSchema = yup.object().shape<PhoneVerificationFormParams>({
    phone: yup
      .string()
      .required()
      .test(Fields.PHONE, `${t('Phone number is incorrect')}`, function (
        value
      ) {
        try {
          const checkPhone = parsePhoneNumber(value);
          return !!checkPhone?.isValid();
        } catch (error) {
          return false;
        }
      }),
    customCountryCode: yup.string(),
  });

  const { push } = useHistory();
  const { mainAppStore } = useStores();

  const initialValues = {
    customCountryCode: '',
    phone: '',
  };

  const handleChangeCountry = (setFieldValue: any) => (country: Country) => {
    setFieldValue(Fields.PHONE, country.dial);
    const phoneNumber = getExampleNumber(
      fromAlpha3ToAlpha2Code(country.id),
      examples
    );
    const mask = phoneNumber?.nationalNumber.replace(/\d/g, '9');
    if (mask) {
      setDialMask(`+\\${country.dial.split('').join('\\')}${mask}`);
    } else {
      setDialMask(`+\\${country.dial.split('').join('\\')}99999999999999`);
    }
  };
  const handleSubmitForm = async ({ phone }: PhoneVerificationFormParams) => {
    try {
      const response = await API.postPersonalData(
        {
          processId: getProcessId(),
          phone: `${dialMask}${phone.trim()}`,
        },
        mainAppStore.initModel.authUrl
      );
      if (response.result === OperationApiResponseCodes.Ok) {
        mixpanel.track(mixpanelEvents.PHONE_FIELD, {
          [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandName.toLowerCase(),
        });
      }
      push(Page.DASHBOARD);
    } catch (error) {}
  };

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await API.getCountries(
          CountriesEnum.EN,
          mainAppStore.initModel.authUrl
        );
        setCountries(response);
      } catch (error) {}
    }
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchGeoLocationInfo = async () => {
      try {
        const response = await API.getGeolocationInfo(
          mainAppStore.initModel.authUrl
        );
        const country = countries.find((item) => item.id === response.country);
        if (country) {
          setFieldValue(Fields.CUSTOM_COUNTRY, country.name);
        }
        if (response.dial) {
          setFieldValue(Fields.PHONE, response.dial);
          const phoneNumber = getExampleNumber(
            fromAlpha3ToAlpha2Code(response.country),
            examples
          );
          const mask = phoneNumber?.nationalNumber.replace(/\d/g, '9');
          if (mask) {
            setDialMask(`+\\${response.dial.split('').join('\\')}${mask}`);
          } else {
            setDialMask(
              `+\\${response.dial.split('').join('\\')}99999999999999`
            );
          }
        }
      } catch (error) {}
    };

    if (countries.length) {
      fetchGeoLocationInfo();
    }
  }, [countries]);

  useEffect(() => {
    mixpanel.track(mixpanelEvents.PHONE_FIELD_VIEW, {
      [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandName.toLowerCase(),
    });
  }, []);

  const {
    setFieldValue,
    validateForm,
    handleSubmit,
    errors,
    touched,
    getFieldProps,
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
        <FlexContainer
          justifyContent="center"
          alignItems="center"
          padding="30px 0 54px"
          minHeight="100px"
        >
          <FlexContainer width="230px">
            <Observer>
              {() => <Logo src={mainAppStore.initModel.logo || LogoMonfex} />}
            </Observer>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer flexDirection="column" height="100%">
          <CustomForm onSubmit={handleSubmit} noValidate>
            <FlexContainer flexDirection="column">
              <FlexContainer width="100%">
                <FlexContainer flexDirection="column" width="100%">
                  <AutoCompleteDropdown
                    labelText={t('Country')}
                    {...getFieldProps(Fields.CUSTOM_COUNTRY)}
                    id={Fields.CUSTOM_COUNTRY}
                    hasError={
                      !!(touched.customCountryCode && errors.customCountryCode)
                    }
                    dropdownItemsList={countries}
                    setFieldValue={setFieldValue}
                    handleChange={handleChangeCountry(setFieldValue)}
                  ></AutoCompleteDropdown>
                </FlexContainer>
              </FlexContainer>
              <FlexContainer width="100%">
                <PhoneInputWrapper width="100%" flexDirection="column">
                  <Label>{t('Phone')}</Label>
                  <InputMaskedField
                    mask={dialMask}
                    {...getFieldProps(Fields.PHONE)}
                    id={Fields.PHONE}
                    hasError={!!(touched.phone && errors.phone)}
                    errorText={errors.phone}
                  />
                </PhoneInputWrapper>
              </FlexContainer>
            </FlexContainer>
            <FlexContainer padding={'0 16px 40px'}>
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
                  {t('Confirm')}
                </PrimaryTextSpan>
              </PrimaryButton>
            </FlexContainer>
          </CustomForm>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default PhoneVerification;

const CustomForm = styled.form`
  margin: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const PhoneInputWrapper = styled(FlexContainer)`
  position: relative;
  input {
    text-align: right;
  }
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

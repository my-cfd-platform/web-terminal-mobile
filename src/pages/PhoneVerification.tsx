import React, { useState, useEffect, FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextParagraph, PrimaryTextSpan } from '../styles/TextsElements';
import { useFormik } from 'formik';
import Fields from '../constants/fields';
import AutoCompleteDropdown from '../components/PhoneVerification/AutoCompleteDropdown';
import { PrimaryButton } from '../styles/Buttons';
import styled from '@emotion/styled';
import {
  PhoneVerificationFormParams,
  PersonalDataParams,
} from '../types/PersonalDataTypes';
import { Country, CountryCode } from '../types/CountriesTypes';
import API from '../helpers/API';
import { CountriesEnum } from '../enums/CountriesEnum';
import * as yup from 'yup';
import KeysInApi from '../constants/keysInApi';
import { useStores } from '../hooks/useStores';
import { KYCstepsEnum } from '../enums/KYCsteps';
import Page from '../constants/Pages';
import { useHistory } from 'react-router-dom';
import { getProcessId } from '../helpers/getProcessId';
import { SexEnum } from '../enums/Sex';
import validationInputTexts from '../constants/validationInputTexts';
import { useTranslation } from 'react-i18next';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import InputField from '../components/InputField';
import { Observer } from 'mobx-react-lite';
import Logo from '../components/Logo';
import LogoMonfex from '../assets/images/logo.png';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import mixapanelProps from '../constants/mixpanelProps';
import parsePhoneNumber from 'libphonenumber-js/max';
import {AskBidEnum} from "../enums/AskBid";
import Colors from "../constants/Colors";

const PhoneVerification: FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [dialMask, setDialMask] = useState('');
  const [phoneLength, setPhoneLength] = useState(0);
  const countriesNames = countries.map((item) => item.name);
  const { t } = useTranslation();
  const validationSchema = yup.object().shape<PhoneVerificationFormParams>({
    phone: yup
      .string()
      .required()
      .test(Fields.PHONE, `${t('Phone number is incorrect')}`, function (value) {
        const checkPhone = parsePhoneNumber(`${dialMask}${value}`);
        return !!checkPhone?.isValid();
      }),
    customCountryCode: yup
      .mixed()
      .oneOf(countriesNames, t('No matches'))
      .required(t(validationInputTexts.REQUIRED_FIELD)),
  });

  const { push } = useHistory();
  const { kycStore, mainAppStore } = useStores();

  const [initialValues, setInitialValuesForm] = useState<
    PhoneVerificationFormParams
  >({
    customCountryCode: '',
    phone: '',
  });

  const [initialValuesPeronalData, setValuesPeronalData] = useState<
    PersonalDataParams
  >({
    city: '',
    countryOfCitizenship: '',
    countryOfResidence: '',
    dateOfBirth: 0,
    firstName: '',
    lastName: '',
    postalCode: '',
    processId: getProcessId(),
    sex: SexEnum.Unknown,
    address: '',
    uSCitizen: false,
    phone: '',
  });

  const handleChangeCountry = (setFieldValue: any) => (country: Country) => {
    setPhoneLength(0);
    setFieldValue(Fields.PHONE, '');
    setDialMask(`+${country.dial}`);
  };

  const handleSubmitForm = async ({ phone }: PhoneVerificationFormParams) => {
    try {
      const response = await API.postPersonalData(
        {
          ...initialValuesPeronalData,
          phone,
        },
        mainAppStore.initModel.authUrl
      );
      if (response.result === OperationApiResponseCodes.Ok) {
        mixpanel.track(mixpanelEvents.PHONE_FIELD, {
          [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandName.toLowerCase(),
        });
      }
      kycStore.filledStep = KYCstepsEnum.PersonalData;
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
    mixpanel.track(mixpanelEvents.PHONE_FIELD_VIEW, {
      [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandName.toLowerCase(),
    });
  }, []);

  useEffect(() => {
    async function fetchCurrentStep() {
      try {
        const response = await API.getKeyValue(KeysInApi.PERSONAL_DATA);
        if (response) {
          const parsed: PersonalDataParams = JSON.parse(response);
          if (parsed instanceof Object) {
            setValuesPeronalData(parsed);
            const { phone, countryOfCitizenship } = parsed;
            setInitialValuesForm({
              phone:
                mainAppStore.profilePhone ||
                phone ||
                countries.find((item) => item.name === countryOfCitizenship)
                  ?.dial ||
                '',
              customCountryCode: countryOfCitizenship,
            });
            setDialMask(
              `+${
                countries.find((item) => item.name === countryOfCitizenship)
                  ?.dial
              }` || ''
            );
            kycStore.filledStep = KYCstepsEnum.PhoneVerification;
          }
        }
      } catch (error) {}
    }
    if (countries.length) {
      fetchCurrentStep();
    }
  }, [countries]);

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

  const handleChangePhone = (setFieldValue: any, e: any) => {
    setPhoneLength(e.target.value.length);
    setFieldValue(Fields.PHONE, e.target.value);
  };

  const phoneOnBeforeInputHandler = (e: any) => {
    if (!e.data.match(/^[+0-9]*$/g)) {
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

  return (
    <FlexContainer
      width="100%"
      height="100%"
      flexDirection="column"
      alignItems="center"
      backgroundColor="#252636"
    >
      <FlexContainer
        width="100%"
        height="100%"
        flexDirection="column"
        justifyContent="space-between"
        padding="40px 0"
      >
        <FlexContainer
          justifyContent="center"
          alignItems="center"
          padding="30px 0"
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
                  <MaskText right={phoneLength}>{dialMask}</MaskText>
                  <InputField
                    placeholder={''}
                    {...getFieldProps(Fields.PHONE)}
                    id={Fields.PHONE}
                    inputMode={'decimal'}
                    hasError={!!(touched.phone && errors.phone)}
                    errorText={errors.phone}
                    onBeforeInput={phoneOnBeforeInputHandler}
                    onChange={e => handleChangePhone(setFieldValue, e)}
                  />
                </PhoneInputWrapper>
              </FlexContainer>
            </FlexContainer>
            <FlexContainer padding={'0 16px'}>
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

const MaskText = styled(PrimaryTextSpan)<{ right: number }>`
  right: ${(props) => props.right * 10 + 17}px;
  position: absolute;
  top: 19px;
  transform: translateY(-4px);
  transition: transform 0.2s ease, font-size 0.2s ease, color 0.2s ease;
  font-size: 16px;
  color: #fffccc;
`;
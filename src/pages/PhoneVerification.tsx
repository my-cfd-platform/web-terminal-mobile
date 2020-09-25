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
import {Observer} from 'mobx-react-lite';
import Logo from '../components/Logo';
import LogoMonfex from '../assets/images/logo.png';
import {OperationApiResponseCodes} from '../enums/OperationApiResponseCodes';
import mixapanelProps from '../constants/mixpanelProps';
import parsePhoneNumber from 'libphonenumber-js/max';

const PhoneVerification: FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [dialMask, setDialMask] = useState('');
  const countriesNames = countries.map(item => item.name);
  const { t } = useTranslation();
  const validationSchema = yup.object().shape<PhoneVerificationFormParams>({
    phone: yup
      .string()
      .required()
      .test(
        Fields.PHONE,
        `${t('Phone number is invalid')}`,
        function(value) {
          const checkPhone = parsePhoneNumber(`+${value}`);
          return !!checkPhone?.isValid();
        }
      ),
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
    setFieldValue(Fields.PHONE, country.dial);
    setDialMask(`+${country.dial}`);
  };

  const handleSubmitForm = async ({ phone }: PhoneVerificationFormParams) => {
    try {
      const response = await API.postPersonalData({
        ...initialValuesPeronalData,
        phone,
      });
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
        const response = await API.getCountries(CountriesEnum.EN);
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
                countries.find(item => item.name === countryOfCitizenship)
                  ?.dial ||
                '',
              customCountryCode: countryOfCitizenship,
            });
            setDialMask(
              `+${countries.find(item => item.name === countryOfCitizenship)
                ?.dial}` || ''
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
          padding="40px 10px"
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
              <FlexContainer width="100%" margin="0 0 28px 0">
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
              <FlexContainer width="100%" margin="0 0 28px 0">
                <FlexContainer width="100%" flexDirection="column">
                  <InputField
                      placeholder={t('Phone')}
                      {...getFieldProps(Fields.PHONE)}
                      id={Fields.PHONE}
                      hasError={!!(touched.phone && errors.phone)}
                      errorText={errors.phone}
                  />
                </FlexContainer>
              </FlexContainer>
            </FlexContainer>
            <FlexContainer>
              <PrimaryButton
                  type="submit"
                  onClick={handlerClickSubmit}
                  padding="8px 32px"
                  width="100%"
              >
                <PrimaryTextSpan
                    color="#003A38"
                    fontWeight="bold"
                    fontSize="14px"
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

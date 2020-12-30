import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './src/locales/en/Web_English.json';
import pl from './src/locales/pl/Web_app_Polish.json';
import { initReactI18next } from 'react-i18next';
import { CountriesEnum } from './src/enums/CountriesEnum';

const resources = {
  [CountriesEnum.EN]: {
    translation: en,
  },
  [CountriesEnum.PL]: {
    translation: pl,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: CountriesEnum.EN,
    keySeparator: false, // we do not use keys in form messages.welcome
    nsSeparator: false,
    appendNamespaceToMissingKey: false,
    supportedLngs: [CountriesEnum.EN, CountriesEnum.PL],
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;

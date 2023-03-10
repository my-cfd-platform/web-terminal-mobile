import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { CountriesEnum } from './src/enums/CountriesEnum';
import en from './src/locales/en/Web_English.json';
import pl from './src/locales/pl/Web_app_Polish.json';
import de from './src/locales/de/Web_app_German.json';
import es from './src/locales/es/Web_app_Spanish.json';
import ru from './src/locales/ru/Web_app_Russian.json';
// import pt from './src/locales/pt/Mobile_Web_app_Portuguese_BR.json';

const resources = {
  [CountriesEnum.EN]: {
    translation: en,
  },
  [CountriesEnum.PL]: {
    translation: pl,
  },
  [CountriesEnum.ES]: {
    translation: es,
  },
  // [CountriesEnum.DE]: {
  //   translation: de,
  // },
  // [CountriesEnum.RU]: {
  //   translation: ru,
  // },
  // [CountriesEnum.PT]: {
  //   translation: pt,
  // },
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
    supportedLngs: [
      CountriesEnum.EN,
      CountriesEnum.PL,
      //CountriesEnum.DE,
      CountriesEnum.ES,
      //CountriesEnum.RU,
      //CountriesEnum.PT,
    ],
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;

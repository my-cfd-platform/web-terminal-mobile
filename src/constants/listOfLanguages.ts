import { CountriesEnum } from '../enums/CountriesEnum';

export const ListForEN = {
  [CountriesEnum.EN]: {
    name: 'English',
    originName: 'English',
    shortName: 'EN',
  },
  [CountriesEnum.PL]: {
    name: 'Polish',
    originName: 'Polski',
    shortName: 'PL',
  },
  [CountriesEnum.ES]: {
    name: 'Spanish',
    originName: 'Español',
    shortName: 'ES',
  },
  [CountriesEnum.DE]: {
    name: 'German',
    originName: 'Deutsch',
    shortName: 'DE',
  },
};

export const ListForPL = {
  [CountriesEnum.EN]: {
    name: 'Angielski',
    originName: 'English',
    shortName: 'EN',
  },
  [CountriesEnum.PL]: {
    name: 'Polski',
    originName: 'Polski',
    shortName: 'PL',
  },
  [CountriesEnum.ES]: {
    name: 'Hiszpański',
    originName: 'Español',
    shortName: 'ES',
  },
  [CountriesEnum.DE]: {
    name: 'Niemiecki',
    originName: 'Deutsch',
    shortName: 'DE',
  },
};

export const ListForES = {
  [CountriesEnum.EN]: {
    name: 'Inglés',
    originName: 'English',
    shortName: 'EN',
  },
  [CountriesEnum.PL]: {
    name: 'Polaco',
    originName: 'Polski',
    shortName: 'PL',
  },
  [CountriesEnum.ES]: {
    name: 'Español',
    originName: 'Español',
    shortName: 'ES',
  },
  [CountriesEnum.DE]: {
    name: 'Alemán',
    originName: 'Deutsch',
    shortName: 'DE',
  },
};


export const ListForDE = {
  [CountriesEnum.EN]: {
    name: 'Inglés',
    originName: 'English',
    shortName: 'EN',
  },
  [CountriesEnum.PL]: {
    name: 'Polski',
    originName: 'Polieren',
    shortName: 'PL',
  },
  [CountriesEnum.ES]: {
    name: 'Español',
    originName: 'Español',
    shortName: 'ES',
  },
  [CountriesEnum.DE]: {
    name: 'Deutsch',
    originName: 'Deutsch',
    shortName: 'DE',
  },
};

export type ListOfCountriesType = typeof ListForEN;

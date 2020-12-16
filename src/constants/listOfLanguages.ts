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
};

export type ListOfCountriesType = typeof ListForEN;

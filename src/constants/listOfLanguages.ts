import { CountriesEnum } from '../enums/CountriesEnum';

export const ListForEN = {
  [CountriesEnum.EN]: {
    name: 'English',
    originName: 'English',
    shortName: 'EN',
  },
  [CountriesEnum.PL]: {
    name: 'Polish',
    originName: 'Polskie',
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
    name: 'Polskie',
    originName: 'Polskie',
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
    originName: 'Polskie',
    shortName: 'PL',
  },
};

export type ListOfCountriesType = typeof ListForEN;

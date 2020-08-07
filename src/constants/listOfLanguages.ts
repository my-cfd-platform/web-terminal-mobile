import { CountriesEnum } from '../enums/CountriesEnum';

export const ListForEN = {
  [CountriesEnum.EN]: {
    name: 'English',
    originName: 'English',
  },
  [CountriesEnum.PL]: {
    name: 'Polish',
    originName: 'Polskie',
  },
  // [CountriesEnum.ES]: {
  //   name: 'Spanish',
  //   originName: 'Español',
  // },
};

export const ListForPL = {
  [CountriesEnum.EN]: {
    name: 'Angielski',
    originName: 'English',
  },
  [CountriesEnum.PL]: {
    name: 'Polskie',
    originName: 'Polskie',
  },
  // [CountriesEnum.ES]: {
  //   name: 'Hiszpański',
  //   originName: 'Español',
  // },
};

export const ListForES = {
  [CountriesEnum.EN]: {
    name: 'Inglés',
    originName: 'English',
  },
  [CountriesEnum.PL]: {
    name: 'Polaco',
    originName: 'Polskie',
  },
  [CountriesEnum.ES]: {
    name: 'Español',
    originName: 'Español',
  },
};

export type ListOfCountriesType = typeof ListForEN;
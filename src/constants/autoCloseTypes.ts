import { TpSlTypeEnum } from '../enums/TpSlTypeEnum';

const autoCloseTypes = {
  [TpSlTypeEnum.Percent]: {
    name: 'Percent',
    symbol: '%',
  },
  [TpSlTypeEnum.Price]: {
    name: 'Price',
    symbol: '=',
  },
  [TpSlTypeEnum.Currency]: {
    name: 'Profit',
    symbol: '$',
  },
};

Object.freeze(autoCloseTypes);

export default autoCloseTypes;

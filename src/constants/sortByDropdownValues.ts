import { SortByProfitEnum } from '../enums/SortByProfitEnum';
import { SortByMarketsEnum } from '../enums/SortByMarketsEnum';
import { SortByPendingOrdersEnum } from '../enums/SortByPendingOrdersEnum';

export const sortByDropdownProfitLabels = {
  [SortByProfitEnum.NewFirstAsc]: 'New first',
  [SortByProfitEnum.NewFirstDesc]: 'Old first',
  [SortByProfitEnum.InvestmentAsc]: 'Investment: Large to Small',
  [SortByProfitEnum.InvestmentDesc]: 'Investment: Small to Large',
  [SortByProfitEnum.ProfitAsc]: 'Profit: Small to Large',
  [SortByProfitEnum.ProfitDesc]: 'Profit: Large to Small',
};

export const sortByPendingOrdersLabels = {
  [SortByPendingOrdersEnum.NewFirstAsc]: 'New first',
  [SortByPendingOrdersEnum.NewFirstDesc]: 'Old first',
  [SortByPendingOrdersEnum.InvestmentAsc]: 'Investment: Large to Small',
  [SortByPendingOrdersEnum.InvestmentDesc]: 'Investment: Small to Large',
};

export const sortByMarketsLabels = {
  [SortByMarketsEnum.Popularity]: 'By popularity',
  [SortByMarketsEnum.PriceChangeAsc]: 'By price change 24h High Low',
  [SortByMarketsEnum.PriceChangeDesc]: 'By price change 24h Low High',
  [SortByMarketsEnum.NameAsc]: 'By asset name A-Z',
  [SortByMarketsEnum.NameDesc]: 'By asset name Z-A',
};

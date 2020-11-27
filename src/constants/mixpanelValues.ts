import { TpSlTypeEnum } from '../enums/TpSlTypeEnum';

const mixpanelValues = {
  MOBILE_CHART: 'mobile chart',
  PORTFOLIO: 'portfolio',
  CHART: 'chart',
  [TpSlTypeEnum.Currency]: 'currency',
  [TpSlTypeEnum.Percent]: 'percent',
  [TpSlTypeEnum.Price]: 'price',
};
Object.freeze(mixpanelValues);

export default mixpanelValues;

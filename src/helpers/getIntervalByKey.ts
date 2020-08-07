import {
  SupportedIntervalsType,
  supportedInterval,
} from '../constants/supportedTimeScales';
import moment from 'moment';

export const getIntervalByKey = (interval: SupportedIntervalsType) => {
  let from = moment();
  switch (interval) {
    case supportedInterval['1D']:
      from = moment().subtract(1, 'd');
      break;

    case supportedInterval['5D']:
      from = moment().subtract(5, 'd');
      break;

    case supportedInterval['1M']:
      from = moment().subtract(1, 'M');
      break;

    case supportedInterval['YTD']:
      from = moment().subtract(new Date().getUTCMonth(), 'M');
      break;

    case supportedInterval['1Y']:
      from = moment().subtract(1, 'year');
      break;

    case supportedInterval['3Y']:
      from = moment().subtract(1, 'y');
      break;

    case supportedInterval['All']:
      from = moment().subtract(1, 'y');
      break;
  }

  return from.valueOf();
};

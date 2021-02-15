import { SupportedIntervalsType } from '../constants/supportedTimeScales';
import moment from 'moment';

export const getIntervalByKey = (interval: SupportedIntervalsType) => {
  let from = moment();
  switch (interval) {
    case '15m':
      from = moment().subtract(15, 'minutes');
      break;

    case '1h':
      from = moment().subtract(1, 'hours');
      break;

    case '4h':
      from = moment().subtract(4, 'hours');
      break;

    case '1d':
      from = moment().subtract(1, 'days');
      break;

    case '1W':
      from = moment().subtract(1, 'weeks');
      break;

    case '1M':
      from = moment().subtract(1, 'months');
      break;
  }

  return from.valueOf();
};

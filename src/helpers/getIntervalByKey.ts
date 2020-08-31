import {
  SupportedIntervalsType,
  supportedInterval,
} from '../constants/supportedTimeScales';
import moment from 'moment';

export const getIntervalByKey = (interval: SupportedIntervalsType) => {
  let from = moment();
  switch (interval) {
    case supportedInterval['15m']:
      from = moment().subtract(15, 'minutes');
      break;

    case supportedInterval['1h']:
      from = moment().subtract(1, 'hours');
      break;

    case supportedInterval['4h']:
      from = moment().subtract(4, 'hours');
      break;

    case supportedInterval['1d']:
      from = moment().subtract(1, 'days');
      break;

    case supportedInterval['1W']:
      from = moment().subtract(1, 'weeks');
      break;

    case supportedInterval['1M']:
      from = moment().subtract(1, 'months');
      break;
  }

  return from.valueOf();
};

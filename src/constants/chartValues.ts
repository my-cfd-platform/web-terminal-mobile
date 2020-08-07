import {
  supportedInterval,
  SupportedResolutionsType,
} from './supportedTimeScales';
import { SeriesStyle } from '../vendor/charting_library/charting_library.min';
import IconAreaChart from '../assets/svg/icon-chart-area.svg';
import IconLineChart from '../assets/svg/icon-chart-line-style.svg';
import IconCandleChart from '../assets/svg/icon-chart-candle.svg';
import IconBarChart from '../assets/svg/icon-chart-bars.svg';

export const BASIC_RESOLUTION_KEY: SupportedResolutionsType = '1 minute';
export const BASIC_INTERVAL = supportedInterval['1D'];

export const getChartIconByType = (chartType: SeriesStyle) => {
  switch (chartType) {
    case SeriesStyle.Area:
      return IconAreaChart;

    case SeriesStyle.Line:
      return IconLineChart;

    case SeriesStyle.Candles:
      return IconCandleChart;

    case SeriesStyle.Bars:
      return IconBarChart;

    default:
      return;
  }
};

export const getChartLabelByType = (chartType: SeriesStyle) => {
  switch (chartType) {
    case SeriesStyle.Area:
      return 'Area chart';

    case SeriesStyle.Line:
      return 'Line chart';

    case SeriesStyle.Candles:
      return 'Candle chart';

    case SeriesStyle.Bars:
      return 'Bars chart';

    default:
      return '';
  }
};

export const availableChartTypes = [
  SeriesStyle.Candles,
  SeriesStyle.Line,
  SeriesStyle.Area,
];

import {
  ResolutionString,
  Bar,
} from '../vendor/charting_library/charting_library';
import API from '../helpers/API';
import { CandleTypeEnum } from '../enums/CandleType';
import {
  HistoryCandlesDTOType,
  HistoryCandlesType,
} from '../types/HistoryTypes';
import { AskBidEnum } from '../enums/AskBid';
import { supportedResolutions } from '../constants/supportedTimeScales';

interface HistoryObj {
  [key: string]: any;
}

const history: HistoryObj = {};

export default {
  history,
  getBars: async function (
    resolution: ResolutionString,
    rangeStartDate: number,
    rangeEndDate: number,
    instrumentId: string
  ): Promise<Bar[]> {
    let resolutionEnum = CandleTypeEnum.Min;
    // https://monfex.atlassian.net/wiki/spaces/PROD/pages/163938392/Settings
    switch (resolution) {
      case supportedResolutions['1m']:
        resolutionEnum = CandleTypeEnum.Min;
        break;

      case supportedResolutions['1h']:
        resolutionEnum = CandleTypeEnum.Hour;
        break;

      case supportedResolutions['1d']:
        resolutionEnum = CandleTypeEnum.Day;
        break;

      case supportedResolutions['1M']:
        resolutionEnum = CandleTypeEnum.Month;
        break;

      default:
        break;
    }

    const params: HistoryCandlesType = {
      CandleType: resolutionEnum,
      BidOrAsk: AskBidEnum.Buy,
      From: rangeStartDate,
      To: rangeEndDate,
      InstrumentId: instrumentId,
    };

    return API.getPriceHistory(params);
  },
};

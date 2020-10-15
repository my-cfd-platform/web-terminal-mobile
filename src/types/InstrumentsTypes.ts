import { SeriesStyle } from '../vendor/charting_library/charting_library.min';
import {
  SupportedResolutionsType,
  SupportedIntervalsType,
} from '../constants/supportedTimeScales';

export interface InstrumentModelWSDTO {
  id: string;
  name: string;
  digits: number;
  base: string;
  quote: string;
  dayOff: DayOff[];
  minOperationVolume: number;
  maxOperationVolume: number;
  amountStepSize: number;
  maxPositionVolume: number;
  multiplier: number[];
  bid?: number;
  ask?: number;
  tickSize?: number;
  groupId: string;
  weight: number;
  avatar: string;
}

interface DayOff {
  dowFrom: number;
  timeFrom: string;
  dowTo: number;
  timeTo: string;
}

export interface InstrumentGroupWSDTO {
  id: string;
  name: string;
}

export interface PriceChangeWSDTO {
  id: string;
  chng: number;
}

export interface IActiveInstrument {
  instrumentItem: InstrumentModelWSDTO;
  chartType: SeriesStyle;
  interval: SupportedIntervalsType | null;
  resolution: SupportedResolutionsType;
}

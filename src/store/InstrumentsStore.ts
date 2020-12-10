import { observable, computed, action } from 'mobx';
import {
  InstrumentModelWSDTO,
  InstrumentGroupWSDTO,
  PriceChangeWSDTO,
  IActiveInstrument,
} from '../types/InstrumentsTypes';
import { RootStore } from './RootStore';
import { SortByMarketsEnum } from '../enums/SortByMarketsEnum';
import {
  ResolutionString,
  SeriesStyle,
} from '../vendor/charting_library/charting_library';
import {
  supportedResolutions,
  supportedInterval,
} from '../constants/supportedTimeScales';
import { getIntervalByKey } from '../helpers/getIntervalByKey';
import moment from 'moment';
import { AccountTypeEnum } from '../enums/AccountTypeEnum';
import API from '../helpers/API';
import { LOCAL_CHART_TYPE } from '../constants/global';
import { getChartTypeByLabel } from '../constants/chartValues';

interface IPriceChange {
  [key: string]: number;
}

interface ContextProps {
  rootStore: RootStore;
  instruments: IActiveInstrument[];
  activeInstrumentsIds: string[];
  favouriteInstrumentsIds: string[];
  pricesChange: IPriceChange;
  activeInstrument?: IActiveInstrument;
  instrumentGroups: InstrumentGroupWSDTO[];
  activeInstrumentGroupId?: InstrumentGroupWSDTO['id'];
  sortByField: string | null;
  searchValue: string;
}

export class InstrumentsStore implements ContextProps {
  rootStore: RootStore;
  @observable instruments: IActiveInstrument[] = [];
  @observable activeInstrumentsIds: string[] = [];
  @observable favouriteInstrumentsIds: string[] = [];

  @observable activeInstrument?: IActiveInstrument;
  // @observable filteredInstrumentsSearch: InstrumentModelWSDTO[] = [];
  @observable instrumentGroups: InstrumentGroupWSDTO[] = [];
  @observable activeInstrumentGroupId?: InstrumentGroupWSDTO['id'];

  @observable sortByField: string | null = null;
  @observable manualChange: boolean = false;

  @observable pricesChange: IPriceChange = {};
  @observable searchValue: string = '';

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @computed get activeInstruments() {
    const filteredActiveInstruments = this.instruments
      .filter((item) =>
        this.activeInstrumentsIds.includes(item.instrumentItem.id)
      )
      .slice()
      .sort(
        (a, b) =>
          this.activeInstrumentsIds.indexOf(b.instrumentItem.id) -
          this.activeInstrumentsIds.indexOf(a.instrumentItem.id)
      );
    // .sort((a, b) => {
    //   if (a.instrumentItem.id == this.activeInstrument?.instrumentItem.id) {
    //     return -1;
    //   }
    //   return 0;
    // });

    return filteredActiveInstruments;
  }

  @action
  setInstruments = (instruments: InstrumentModelWSDTO[]) => {
    const localType = localStorage.getItem(LOCAL_CHART_TYPE);
    const currentType = localType
      ? getChartTypeByLabel(localType)
      : SeriesStyle.Area;
    this.instruments = instruments.map(
      (item) =>
        <IActiveInstrument>{
          chartType: currentType,
          instrumentItem: item,
          interval: supportedInterval['15m'],
          resolution: '1m',
        }
    );
  };

  @action
  changeInstruments = (type: SeriesStyle) => {
    this.manualChange = true;
    this.instruments = this.instruments.map(
      (item) =>
        <IActiveInstrument>{
          chartType: type,
          instrumentItem: item.instrumentItem,
          interval: supportedInterval['15m'],
          resolution: '1m',
        }
    );
  };

  @action
  editActiveInstrument = (activeInstrument: IActiveInstrument) => {
    this.instruments = this.instruments.map((item) =>
      item.instrumentItem.id === activeInstrument.instrumentItem.id
        ? activeInstrument
        : item
    );
    this.activeInstrument = activeInstrument;
  };

  @action
  setActiveInstrumentsIds = (activeInstrumentsIds: string[]) => {
    this.activeInstrumentsIds = activeInstrumentsIds.slice(0, 7);
  };

  @action
  addActiveInstrumentId = async (activeInstrumentId: string) => {
    if (this.activeInstrumentsIds.includes(activeInstrumentId)) {
      return Promise.resolve();
    }

    if (this.activeInstrumentsIds.length > 6) {
      this.activeInstrumentsIds[6] = activeInstrumentId;
    } else {
      this.activeInstrumentsIds = [
        ...this.activeInstrumentsIds,
        activeInstrumentId,
      ];
    }
    return await API.postFavoriteInstrumets({
      accountId: this.rootStore.mainAppStore.activeAccount!.id,
      type: this.rootStore.mainAppStore.activeAccount!.isLive
        ? AccountTypeEnum.Live
        : AccountTypeEnum.Demo,
      instruments: this.activeInstrumentsIds,
    });
  };

  @computed
  get sortedInstruments() {
    let filterByFunc;

    switch (this.rootStore.sortingStore.marketsSortBy) {
      case SortByMarketsEnum.NameAsc:
        filterByFunc = this.sortByName(true);
        break;

      case SortByMarketsEnum.NameDesc:
        filterByFunc = this.sortByName(false);
        break;

      case SortByMarketsEnum.Popularity:
        filterByFunc = this.sortByPopularity;
        break;

      case SortByMarketsEnum.PriceChangeAsc:
        filterByFunc = this.sortByPriceChange(true);
        break;

      case SortByMarketsEnum.PriceChangeDesc:
        filterByFunc = this.sortByPriceChange(false);
        break;

      default:
        return this.instruments.map((item) => item.instrumentItem);
    }
    return this.instruments
      .filter(
        (item) => item.instrumentItem.groupId === this.activeInstrumentGroupId
      )
      .sort(filterByFunc)
      .map((item) => item.instrumentItem);
  }

  // TODO: refactor, too heavy
  @action
  switchInstrument = async (instrumentId: string) => {
    const newActiveInstrument = this.instruments.find(
      (item) => item.instrumentItem.id === instrumentId
    );

    if (newActiveInstrument) {
      try {
        await this.addActiveInstrumentId(instrumentId);
        this.activeInstrument = newActiveInstrument;
        if (this.rootStore.tradingViewStore.tradingWidget) {
          this.rootStore.tradingViewStore.tradingWidget
            .chart()
            .setSymbol(instrumentId, () => {
              this.rootStore.mainAppStore.isLoading = false;
              this.rootStore.tradingViewStore.tradingWidget
                ?.chart()
                .setResolution(
                  supportedResolutions[
                    newActiveInstrument.resolution
                  ] as ResolutionString,
                  () => {
                    if (newActiveInstrument.interval) {
                      const fromTo = {
                        from:
                          getIntervalByKey(newActiveInstrument.interval) / 1000,
                        to: moment.utc().valueOf() / 1000,
                      };
                      this.rootStore.tradingViewStore.tradingWidget
                        ?.chart()
                        .setVisibleRange(fromTo);
                    }
                  }
                );
              this.rootStore.tradingViewStore.tradingWidget
                ?.chart()
                .setChartType(newActiveInstrument.chartType);
            });

          this.rootStore.markersOnChartStore.renderActivePositionsMarkersOnChart();
        }
      } catch (error) {}
    } else {
      // Safari strange behaviour fix
      setTimeout(() => {
        this.switchInstrument(
          this.activeInstrumentsIds[this.activeInstrumentsIds.length - 1]
        );
      }, 0);
    }
  };

  @action
  setPricesChanges = (prices: PriceChangeWSDTO[]) => {
    this.pricesChange = prices.reduce(
      (acc, prev) => ({ ...acc, [prev.id]: prev.chng }),
      <IPriceChange>{}
    );
  };

  sortByName = (ascending: boolean) => (
    a: IActiveInstrument,
    b: IActiveInstrument
  ) => {
    if (a.instrumentItem.name < b.instrumentItem.name) {
      return ascending ? -1 : 1;
    }
    if (a.instrumentItem.name > b.instrumentItem.name) {
      return ascending ? 1 : -1;
    }
    return 0;
  };

  sortByPopularity = (a: IActiveInstrument, b: IActiveInstrument) =>
    a.instrumentItem.weight - b.instrumentItem.weight;

  sortByPriceChange = (ascending: boolean) => (
    a: IActiveInstrument,
    b: IActiveInstrument
  ) => {
    const aPriceChange = this.pricesChange[a.instrumentItem.id];
    const bPriceChange = this.pricesChange[b.instrumentItem.id];

    if (!aPriceChange || !bPriceChange) {
      return 0;
    }

    if (aPriceChange < bPriceChange) {
      return ascending ? 1 : -1;
    }
    if (aPriceChange > bPriceChange) {
      return ascending ? -1 : 1;
    }
    return 0;
  };

  @computed
  get filteredInstrumentsSearch() {
    return this.instruments
      .filter(
        (item) =>
          !this.searchValue ||
          item.instrumentItem.id.toLowerCase().includes(this.searchValue) ||
          item.instrumentItem.base.toLowerCase().includes(this.searchValue) ||
          item.instrumentItem.name.toLowerCase().includes(this.searchValue) ||
          item.instrumentItem.quote.toLowerCase().includes(this.searchValue)
      )
      .sort((a, b) => a.instrumentItem.weight - b.instrumentItem.weight)
      .map((item) => item.instrumentItem);
  }
}

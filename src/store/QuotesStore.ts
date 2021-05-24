import { observable, action, computed } from 'mobx';
import { BidAskKeyValueList, BidAskModelWSDTO } from '../types/BidAsk';
import { PositionModelWSDTO } from '../types/Positions';
import calculateFloatingProfitAndLoss from '../helpers/calculateFloatingProfitAndLoss';
import { AskBidEnum } from '../enums/AskBid';
import { PendingOrderWSDTO } from '../types/PendingOrdersTypes';
import { SortByProfitEnum } from '../enums/SortByProfitEnum';
import { RootStore } from './RootStore';
import { SortByPendingOrdersEnum } from '../enums/SortByPendingOrdersEnum';

interface IQuotesStore {
  quotes: BidAskKeyValueList;
  activePositions: PositionModelWSDTO[];
  invest: number;
  total: number;
  totalEquity: number;
  profit: number;
  pendingOrders: PendingOrderWSDTO[];
}

export class QuotesStore implements IQuotesStore {
  @observable quotes: BidAskKeyValueList = {};
  @observable activePositions: PositionModelWSDTO[] = [];
  @observable pendingOrders: PendingOrderWSDTO[] = [];
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @action
  setQuote = (quote: BidAskModelWSDTO) => {
    this.quotes[quote.id] = quote;
  };

  @action
  setActivePositions = (activePositions: PositionModelWSDTO[]) => {
    this.activePositions = activePositions;
  };

  @computed
  get profit() {
    return this.activePositions.reduce(
      (acc, prev) =>
        acc +
        calculateFloatingProfitAndLoss({
          investment: prev.investmentAmount,
          multiplier: prev.multiplier,
          costs: prev.swap + prev.commission,
          side: prev.operation === AskBidEnum.Buy ? 1 : -1,
          currentPrice: this.quotes[prev.instrument]
            ? this.quotes[prev.instrument][
                prev.operation === AskBidEnum.Buy ? 'bid' : 'ask'
              ].c
            : 0,
          openPrice: prev.openPrice,
        }),
      0
    );
  }

  @computed
  get invest() {
    return this.activePositions.reduce(
      (acc, prev) => acc + prev.investmentAmount,
      0
    );
  }
  
  @computed
  get totalReservedFoundsForToppingUp() {
    let value: number = 0;
    this.activePositions.map((pos) => value += pos.reservedFundsForToppingUp);
    console.log('topping up: ', value)
    return value;
  }
  
  @computed
  get total() {
    return (
      this.profit +
      (this.rootStore.mainAppStore.activeAccount?.balance || 0) +
      this.invest + this.totalReservedFoundsForToppingUp
    );
  }

  @computed
  get totalEquity() {
    return this.profit + this.invest;
  }

  // TODO: move to sorting store?
  @computed
  get sortedActivePositions() {
    let filterByFunc;

    switch (this.rootStore.sortingStore.activePositionsSortBy) {
      case SortByProfitEnum.NewFirstAsc:
        filterByFunc = this.sortByDateOpened(true);
        break;

      case SortByProfitEnum.NewFirstDesc:
        filterByFunc = this.sortByDateOpened(false);
        break;

      case SortByProfitEnum.ProfitAsc:
        filterByFunc = this.sortByPnLPositions(true);
        break;

      case SortByProfitEnum.ProfitDesc:
        filterByFunc = this.sortByPnLPositions(false);
        break;

      case SortByProfitEnum.InvestmentAsc:
        filterByFunc = this.sortByInvestment(true);
        break;

      case SortByProfitEnum.InvestmentDesc:
        filterByFunc = this.sortByInvestment(false);
        break;

      default:
        break;
    }
    return this.activePositions.slice().sort(filterByFunc);
  }

  @computed
  get sortedPendingOrders() {
    let filterByFunc;

    switch (this.rootStore.sortingStore.pendingOrdersSortBy) {
      case SortByPendingOrdersEnum.NewFirstAsc:
        filterByFunc = this.sortByDateOpenedPendingOrders(true);
        break;

      case SortByPendingOrdersEnum.NewFirstDesc:
        filterByFunc = this.sortByDateOpenedPendingOrders(false);
        break;

      case SortByPendingOrdersEnum.InvestmentAsc:
        filterByFunc = this.sortByInvestment(true);
        break;

      case SortByPendingOrdersEnum.InvestmentDesc:
        filterByFunc = this.sortByInvestment(false);
        break;

      default:
        break;
    }
    return this.pendingOrders.slice().sort(filterByFunc);
  }

  sortByDateOpened = (ascending: boolean) => (
    a: PositionModelWSDTO,
    b: PositionModelWSDTO
  ) => (ascending ? b.openDate - a.openDate : a.openDate - b.openDate);

  sortByDateOpenedPendingOrders = (ascending: boolean) => (
    a: PendingOrderWSDTO,
    b: PendingOrderWSDTO
  ) => (ascending ? b.created - a.created : a.created - b.created);

  sortByInvestment = (ascending: boolean) => (
    a: PositionModelWSDTO | PendingOrderWSDTO,
    b: PositionModelWSDTO | PendingOrderWSDTO
  ) =>
    ascending
      ? b.investmentAmount - a.investmentAmount
      : a.investmentAmount - b.investmentAmount;

  // TODO: think how to reduce calculations
  sortByPnLPositions = (ascending: boolean) => (
    a: PositionModelWSDTO,
    b: PositionModelWSDTO
  ) => {
    const aProfitNLoss = this.quotes[b.instrument] ? calculateFloatingProfitAndLoss({
      investment: b.investmentAmount,
      multiplier: b.multiplier,
      costs: b.swap + b.commission,
      side: b.operation === AskBidEnum.Buy ? 1 : -1,
      currentPrice:
        b.operation === AskBidEnum.Buy
          ? this.quotes[b.instrument].bid.c
          : this.quotes[b.instrument].ask.c,
      openPrice: b.openPrice,
    }) : 0;

    const bProfitNLoss = this.quotes[a.instrument] ? calculateFloatingProfitAndLoss({
      investment: a.investmentAmount,
      multiplier: a.multiplier,
      costs: a.swap + a.commission,
      side: a.operation === AskBidEnum.Buy ? 1 : -1,
      currentPrice:
        a.operation === AskBidEnum.Buy
          ? this.quotes[a.instrument].bid.c
          : this.quotes[a.instrument].ask.c,
      openPrice: a.openPrice,
    }) : 0;
    return ascending
      ? bProfitNLoss - aProfitNLoss
      : aProfitNLoss - bProfitNLoss;
  };
}

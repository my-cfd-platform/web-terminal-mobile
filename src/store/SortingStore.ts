import { RootStore } from './RootStore';
import { SortByProfitEnum } from '../enums/SortByProfitEnum';
import { observable } from 'mobx';
import { SortByMarketsEnum } from '../enums/SortByMarketsEnum';
import { SortByPendingOrdersEnum } from '../enums/SortByPendingOrdersEnum';

interface ISortingStore {
  activePositionsSortBy: SortByProfitEnum;
  pendingOrdersSortBy: SortByPendingOrdersEnum;
  marketsSortBy: SortByMarketsEnum;
}

export class SortingStore implements ISortingStore {
  rootStore: RootStore;
  @observable activePositionsSortBy: SortByProfitEnum =
    SortByProfitEnum.NewFirstAsc;
  @observable pendingOrdersSortBy: SortByPendingOrdersEnum =
    SortByPendingOrdersEnum.NewFirstAsc;

  @observable marketsSortBy: SortByMarketsEnum = SortByMarketsEnum.Popularity;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }
}

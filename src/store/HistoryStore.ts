import {
  PositionHistoryDTO,
  PositionsHistoryReport,
} from './../types/HistoryReportTypes';
import { observable, action } from 'mobx';
import { ShowDatesDropdownEnum } from '../enums/ShowDatesDropdownEnum';
import { RootStore } from './RootStore';
import API from '../helpers/API';
import moment from 'moment';

interface ContextProps {
  positionsHistoryReport: PositionsHistoryReport;
  positionsDatesRangeType: ShowDatesDropdownEnum;
  balancesDatesRangeType: ShowDatesDropdownEnum;
}

export class HistoryStore implements ContextProps {
  @observable positionsHistoryReport: PositionsHistoryReport = {
    accountId: '',
    page: 0,
    pageSize: 0,
    positionsHistory: [],
    totalEquity: 0,
    totalInvestment: 0,
    totalItems: 0,
    totalProfit: 0,
    totalProfitPercent: 0,
  };
  @observable positionsDatesRangeType: ShowDatesDropdownEnum =
    ShowDatesDropdownEnum.Week;
  @observable balancesDatesRangeType: ShowDatesDropdownEnum =
    ShowDatesDropdownEnum.Week;
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @action
  fetchPositionsHistory = async (isScrolling = false) => {
    try {
      const response = await API.getPositionsHistory({
        accountId: this.rootStore.mainAppStore.activeAccountId,
        page: isScrolling ? this.positionsHistoryReport.page + 1 : 1,
        pageSize: 20,
      });

      if (
        this.rootStore.mainAppStore.activeAccountId ===
        this.positionsHistoryReport.accountId
      ) {
        this.positionsHistoryReport = {
          ...response,
          accountId: this.rootStore.mainAppStore.activeAccountId,
          positionsHistory: isScrolling
            ? [
                ...this.positionsHistoryReport.positionsHistory,
                ...response.positionsHistory,
              ]
            : response.positionsHistory,
        };
      } else {
        this.positionsHistoryReport = {
          ...response,
          accountId: this.rootStore.mainAppStore.activeAccountId,
          positionsHistory: response.positionsHistory,
        };
      }
    } catch (error) {}
  };

  @action
  clearPositionsHistory = () => {
    this.positionsHistoryReport = {
      ...this.positionsHistoryReport,
      page: 1,
      positionsHistory: [],
    };
  };
}

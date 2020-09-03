import { PositionHistoryDTO } from './../types/HistoryReportTypes';
import { observable, action } from 'mobx';
import { PositionsHistoryReportDTO } from '../types/HistoryReportTypes';
import { ShowDatesDropdownEnum } from '../enums/ShowDatesDropdownEnum';

interface ContextProps {
  positionsHistoryReport: PositionsHistoryReportDTO;
  positionsDatesRangeType: ShowDatesDropdownEnum;
  balancesDatesRangeType: ShowDatesDropdownEnum;
  activeHistoryItem: PositionHistoryDTO | null;
}

export class HistoryStore implements ContextProps {
  @observable positionsHistoryReport: PositionsHistoryReportDTO = {
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
  @observable activeHistoryItem: PositionHistoryDTO | null = null;

  @action
  setActiveHistoryItem = (activeHistoryItem: PositionHistoryDTO) => {
    this.activeHistoryItem = activeHistoryItem;
  }
}

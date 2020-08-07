import { observable } from 'mobx';
import { PositionsHistoryReportDTO } from '../types/HistoryReportTypes';
import { ShowDatesDropdownEnum } from '../enums/ShowDatesDropdownEnum';

interface ContextProps {
  positionsHistoryReport: PositionsHistoryReportDTO;
  positionsDatesRangeType: ShowDatesDropdownEnum;
  balancesDatesRangeType: ShowDatesDropdownEnum;
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
}

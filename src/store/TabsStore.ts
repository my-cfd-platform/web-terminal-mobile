import { observable, action } from 'mobx';
import { SideBarTabType } from '../enums/SideBarTabType';
import { PortfolioTabEnum } from '../enums/PortfolioTabEnum';
import { HistoryTabEnum } from '../enums/HistoryTabEnum';

interface ContextProps {
  sideBarTabType: SideBarTabType | null;
  portfolioTab: PortfolioTabEnum;
  historyTab: HistoryTabEnum;
  closeAnyTab: () => void;
  isTabExpanded: boolean;
}

export class TabsStore implements ContextProps {
  @observable sideBarTabType: SideBarTabType | null = null;
  @observable isTabExpanded = false;
  @observable portfolioTab: PortfolioTabEnum = PortfolioTabEnum.Portfolio;
  @observable historyTab: HistoryTabEnum = HistoryTabEnum.TradingHistory;

  @action
  closeAnyTab = () => {
    this.isTabExpanded = false;
    this.sideBarTabType = null;
  };
}

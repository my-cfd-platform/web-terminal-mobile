import { observable } from 'mobx';
import { IChartingLibraryWidget } from '../vendor/charting_library/charting_library';

interface ContextProps {
  tradingWidget?: IChartingLibraryWidget;
}

export class TradingViewStore implements ContextProps {
  @observable tradingWidget?: IChartingLibraryWidget;
}

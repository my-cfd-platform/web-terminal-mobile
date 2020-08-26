import { QuotesStore } from './QuotesStore';
import { MainAppStore } from './MainAppStore';
import { SLTPStore } from './SLTPStore';
import { TradingViewStore } from './TradingViewStore';
import { InstrumentsStore } from './InstrumentsStore';
import { DateRangeStore } from './DateRangeStore';
import { HistoryStore } from './HistoryStore';
import { KYCstore } from './KYCstore';
import { NotificationStore } from './NotificationStore';
import { SortingStore } from './SortingStore';
import { BadRequestPopupStore } from './BadRequestPopupStore';
import { DepositFundsStore } from './DepositFundsStore';
import { DataRangeStoreNoCustomDates } from './DataRangeStoreNoCustomDates';
import { WithdrawalStore } from './WithdrawalStore';
import { DateRangeAccountBalanceStore } from './DateRangeAccountBalanceStore';
import { ActivePositionNotificationStore } from './ActivePositionNotificationStore';

export class RootStore {
  quotesStore: QuotesStore;
  mainAppStore: MainAppStore;
  SLTPStore: SLTPStore;
  tradingViewStore: TradingViewStore;
  instrumentsStore: InstrumentsStore;
  dateRangeStore: DateRangeStore;
  dateRangeAccountBalanceStore: DateRangeAccountBalanceStore;
  dataRangeStoreNoCustomDates: DataRangeStoreNoCustomDates;
  historyStore: HistoryStore;
  kycStore: KYCstore;
  notificationStore: NotificationStore;
  sortingStore: SortingStore;
  badRequestPopupStore: BadRequestPopupStore;
  depositFundsStore: DepositFundsStore;
  withdrawalStore: WithdrawalStore;
  activePositionNotificationStore: ActivePositionNotificationStore

  constructor() {
    this.quotesStore = new QuotesStore(this);
    this.mainAppStore = new MainAppStore(this);
    this.SLTPStore = new SLTPStore();
    this.tradingViewStore = new TradingViewStore();
    this.instrumentsStore = new InstrumentsStore(this);
    this.dateRangeStore = new DateRangeStore();
    this.dateRangeAccountBalanceStore = new DateRangeAccountBalanceStore();
    this.dataRangeStoreNoCustomDates = new DataRangeStoreNoCustomDates();
    this.historyStore = new HistoryStore();
    this.kycStore = new KYCstore();
    this.notificationStore = new NotificationStore();
    this.sortingStore = new SortingStore(this);
    this.badRequestPopupStore = new BadRequestPopupStore();
    this.depositFundsStore = new DepositFundsStore();
    this.withdrawalStore = new WithdrawalStore();
    this.activePositionNotificationStore = new ActivePositionNotificationStore();
  }
}

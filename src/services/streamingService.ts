import {
  LibrarySymbolInfo,
  ResolutionString,
  SubscribeBarsCallback,
  Bar,
} from '../vendor/charting_library/charting_library';
import historyProvider from './historyProvider';
import { HubConnection } from '@aspnet/signalr';
import Topics from '../constants/websocketTopics';
import { BidAskModelWSDTO } from '../types/BidAsk';
import { ResponseFromWebsocket } from '../types/ResponseFromWebsocket';

// keep track of subscriptions

interface Subscription {
  symbolInfo: LibrarySymbolInfo;
  resolution: ResolutionString;
  onTick: SubscribeBarsCallback;
  lastBar: Bar;
  listenerGuid: string;
}

class StreamingService {
  activeConnection: HubConnection;
  subscriptions: Subscription[] = [];
  currentBarGuid?: string;
  instrumentId: string;

  constructor(activeConnection: HubConnection, instrumentId: string) {
    this.activeConnection = activeConnection;
    this.instrumentId = instrumentId;
    this.activeConnection.on(
      Topics.BID_ASK,
      (response: ResponseFromWebsocket<BidAskModelWSDTO[]>) => {
        const tick = response.data.find(item => item.id === this.instrumentId);
        if (!tick) {
          return;
        }
        const bar: Bar = {
          close: tick.bid.c,
          high: tick.bid.h,
          low: tick.bid.l,
          open: tick.bid.o,
          time: tick.dt,
        };
        const sub = this.subscriptions.find(
          e => e.listenerGuid === this.currentBarGuid
        );
        if (sub) {
          // disregard the initial catchup snapshot of trades for already closed candles
          if (bar.time < sub.lastBar.time) {
            return;
          }

          const _lastBar = updateBar(bar, sub);
          // send the most recent bar back to TV's realtimeUpdate callback
          sub.onTick(_lastBar);
          // update our own record of lastBar
          sub.lastBar = _lastBar;
        }
      }
    );
  }
  subscribeBars = (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
    onResetCacheNeededCallback: () => void
  ) => {
    this.currentBarGuid = listenerGuid;
    this.instrumentId = symbolInfo.name;
    const currentSubscriptionBar = {
      symbolInfo,
      resolution,
      onTick,
      lastBar: historyProvider.history[`${symbolInfo.name}${resolution}`]
        ? historyProvider.history[`${symbolInfo.name}${resolution}`].lastBar
        : { time: 0 },
      listenerGuid,
    };

    this.subscriptions.push(currentSubscriptionBar);
  };

  unsubscribeBars = (uid: string) => {
    const subIndex = this.subscriptions.findIndex(e => e.listenerGuid === uid);
    console.log('unsubscribed');
    if (subIndex === -1) {
      return;
    }

    this.subscriptions.splice(subIndex, 1);
  };
}

export default StreamingService;

// Take a single trade, and subscription record, return updated bar
function updateBar(bar: Bar, { lastBar, resolution }: Subscription) {
  let resolutionNumber = +resolution;
  if (resolution.includes('D')) {
    // 1 day in minutes === 1440
    resolutionNumber = 1440;
  } else if (resolution.includes('W')) {
    // 1 week in minutes === 10080
    resolutionNumber = 10080;
  }
  const coeff = resolutionNumber * 60;

  const rounded = bar.time || Math.floor(bar.time / coeff) * coeff;
  let _lastBar = {} as Bar;
  const MINUTE = 60000;
  if (rounded > lastBar.time + MINUTE) {
    // create a new candle, use last close as open **PERSONAL CHOICE**
    _lastBar = { ...bar, time: rounded };
  } else {
    // update lastBar candle!
    if (bar.low < lastBar.low) {
      lastBar.low = bar.low;
    }

    if (bar.high > lastBar.high) {
      lastBar.high = bar.high;
    }

    lastBar.close = bar.close;

    _lastBar = { ...lastBar };
  }
  return _lastBar;
}

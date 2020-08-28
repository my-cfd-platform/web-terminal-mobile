// Time interval (x axis ticks)
export const supportedResolutions = {
  //: ResolutionString[] = 1m (1), 5m (5), 15m (15), 1h (60), 4h (240), 1D, 1M
  '1m': '1',
  '5m': '5',
  '15m': '15',
  '1h': '60',
  '4h': '240',
  '1d': '1D',
  '1M': '1M',
};

export type SupportedResolutionsType = keyof typeof supportedResolutions;

// From date to date 15m, 1h, 4h, 1d, 1W, 1M
export const supportedInterval = {
  '15m': '15',
  '1h': '60',
  '4h': '240',
  '1d': '1D',
  '1W': '1W',
  '1M': '1M',
};
export type SupportedIntervalsType = keyof typeof supportedInterval;

import { useMemo, useEffect } from 'react';
import throttle from '../helpers/throttle';

export const useThrottleFn = <T extends (...args: any) => any>(
  fn: T,
  ms = 1000
) => {
  const throttledFn = useMemo(() => {
    return throttle(fn, ms);
  }, [fn, ms]);
  useEffect(() => {
    return () => {
      throttledFn.cancel();
    };
  }, [throttledFn]);
  return throttledFn;
};

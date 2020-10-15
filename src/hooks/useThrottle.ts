import { useState } from 'react';
import { useThrottleFn } from './useThrottleFn';

export const useThrottle = <T>(value: T, ms = 1000) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const setThrottledValueThrottled = useThrottleFn(setThrottledValue, ms);
  setThrottledValueThrottled(value);
  return throttledValue;
};

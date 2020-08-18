import { useStores } from './useStores';
import { useCallback, useState, useEffect } from 'react';


const useInstrument = (instrument?: string) => {
  const { instrumentsStore } = useStores();
  const [precision, setPrecision] = useState<number>(0);

  useEffect(
    () => {
      instrument && setPrecision(instrumentsStore.instruments.find(item => item.instrumentItem.id === instrument)?.instrumentItem.digits || 0);
    }, [instrumentsStore.instruments]
  );

  const getPressision = (instrument: string) => {
    return instrumentsStore.instruments.find(item => item.instrumentItem.id === instrument)?.instrumentItem.digits || 0
  }


  return { precision, getPressision };
}
export default useInstrument;
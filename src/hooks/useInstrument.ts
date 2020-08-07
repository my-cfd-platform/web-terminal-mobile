import { useStores } from './useStores';
import { useCallback, useState, useEffect } from 'react';


const useInstrument = (instrument: string) => {
  const { instrumentsStore } = useStores();
  const [precision, setPrecision] = useState<number>(0);

  useEffect(
    () => {
      setPrecision(instrumentsStore.instruments.find(item => item.instrumentItem.id === instrument)?.instrumentItem.digits || 0);
    }, [instrumentsStore.instruments]
  );



  return { precision };
}
export default useInstrument;
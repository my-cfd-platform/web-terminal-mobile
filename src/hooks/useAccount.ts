import { autorun } from 'mobx';
import { useState, useEffect } from 'react';
import { useStores } from './useStores';

const useAccount = () => {
  const { quotesStore } = useStores();
  const [total, setTotal] = useState(quotesStore.total);

  useEffect(
    () =>
      autorun(
        () => {
          setTotal(quotesStore.total);
        },
        { delay: 1000 }
      ),
    []
  );

  return {total};
}

export default useAccount;
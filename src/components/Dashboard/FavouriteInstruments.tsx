import React, { useCallback, useEffect } from 'react';
import { AccountTypeEnum } from '../../enums/AccountTypeEnum';
import API from '../../helpers/API';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';

const FavouriteInstruments = observer(() => {
  const { instrumentsStore, badRequestPopupStore, mainAppStore } = useStores();
  const fetchFavoriteInstruments = useCallback(
    async (accountId: string, type: AccountTypeEnum) => {
      try {
        const response = await API.getFavoriteInstrumets({
          type,
          accountId,
        });
        instrumentsStore.setActiveInstrumentsIds(response);
        instrumentsStore.switchInstrument(
          response[0] || instrumentsStore.instruments[0].instrumentItem.id
        );
      } catch (error) {
        badRequestPopupStore.openModal();
        badRequestPopupStore.setMessage(error);
      }
    },
    []
  );

  useEffect(() => {
    if (mainAppStore.activeAccountId && instrumentsStore.instruments.length) {
      fetchFavoriteInstruments(
        mainAppStore.activeAccountId,
        // sh@t from backend
        mainAppStore.activeAccount?.isLive
          ? AccountTypeEnum.Live
          : AccountTypeEnum.Demo
      );
    }
  }, [instrumentsStore.instruments, mainAppStore.activeAccountId]);
  return <div></div>;
});

export default FavouriteInstruments;

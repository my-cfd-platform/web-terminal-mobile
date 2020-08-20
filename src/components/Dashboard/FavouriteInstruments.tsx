import React, { useCallback, useEffect } from 'react';
import { AccountTypeEnum } from '../../enums/AccountTypeEnum';
import API from '../../helpers/API';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { FlexContainer } from '../../styles/FlexContainer';
import SvgIcon from '../SvgIcon';
import IconAddInstruments from '../../assets/svg/icon-add-instrument.svg';
import InstrumentBadge from './InstrumentBadge';

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

  return (
    <FlexContainer alignItems="center" marginBottom="14px">
      <FlexContainer padding="16px" marginRight="8px">
        <SvgIcon
          {...IconAddInstruments}
          width={48}
          height={48}
          fillColor="#fffccc"
        />
      </FlexContainer>
      <FlexContainer flexWrap="nowrap">
        {instrumentsStore.activeInstruments.map((item) => (
          <FlexContainer marginRight="2px" key={item.instrumentItem.id}>
            <InstrumentBadge
              instrumentId={item.instrumentItem.id}
              instrumentName={item.instrumentItem.name}
              isActive={
                item.instrumentItem.id ===
                instrumentsStore.activeInstrument?.instrumentItem.id
              }
            />
          </FlexContainer>
        ))}
      </FlexContainer>
    </FlexContainer>
  );
});

export default FavouriteInstruments;

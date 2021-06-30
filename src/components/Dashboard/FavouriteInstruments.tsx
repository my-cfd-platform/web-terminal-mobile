import React from 'react';
import { AccountTypeEnum } from '../../enums/AccountTypeEnum';
import API from '../../helpers/API';
import { useStores } from '../../hooks/useStores';
import { FlexContainer } from '../../styles/FlexContainer';
import SvgIcon from '../SvgIcon';
import IconAddInstruments from '../../assets/svg/icon-add-instrument.svg';
import InstrumentBadge from './InstrumentBadge';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { useHistory } from 'react-router-dom';
import Page from '../../constants/Pages';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';

const FavouriteInstruments = observer(() => {
  const { instrumentsStore, badRequestPopupStore, mainAppStore } = useStores();
  const { push } = useHistory();

  const handleRemoveInstrument = (itemId: string) => async () => {
    const indexEl = instrumentsStore.activeInstrumentsIds.findIndex(
      (id) => id === itemId
    );
    const newActiveInstrument =
      instrumentsStore.activeInstrumentsIds[
        indexEl === 0 ? indexEl + 1 : indexEl - 1
      ];

    const newInstruments = instrumentsStore.activeInstrumentsIds.filter(
      (id) => id !== itemId
    );
    try {
      const response = await API.postFavoriteInstrumets({
        accountId:
          mainAppStore.activeAccount?.id || mainAppStore!.activeAccountId,
        type: mainAppStore.activeAccount!.isLive
          ? AccountTypeEnum.Live
          : AccountTypeEnum.Demo,
        instruments: newInstruments,
      });
      instrumentsStore.setActiveInstrumentsIds(response, true);

      instrumentsStore.switchInstrument(
        newActiveInstrument || response[response.length - 1]
      );
    } catch (error) {}
  };

  const gotoMarkets = () => {
    push(Page.MARKETS);
  };

  return (
    <FlexContainer padding="16px 0 0 0">
      <FlexContainer padding="0 16px" marginRight="8px" alignItems="flex-start">
        <ButtonWithoutStyles onClick={gotoMarkets}>
          <SvgIcon
            {...IconAddInstruments}
            width={48}
            height={48}
            fillColor="#fffccc"
          />
        </ButtonWithoutStyles>
      </FlexContainer>
      <InstrumentListWrap flexWrap="nowrap">
        {instrumentsStore.activeInstruments.map((item) => (
          <FlexContainer marginRight="8px" key={item.instrumentItem.id}>
            <InstrumentBadge
              removable={
                instrumentsStore.activeInstruments.length > 1 &&
                item.instrumentItem.id ===
                  instrumentsStore.activeInstrument?.instrumentItem.id
              }
              onRemove={handleRemoveInstrument(item.instrumentItem.id)}
              instrumentId={item.instrumentItem.id}
              instrumentName={item.instrumentItem.name}
              isActive={
                item.instrumentItem.id ===
                instrumentsStore.activeInstrument?.instrumentItem.id
              }
            />
          </FlexContainer>
        ))}
      </InstrumentListWrap>
    </FlexContainer>
  );
});

export default FavouriteInstruments;

const InstrumentListWrap = styled(FlexContainer)`
  overflow-y: hidden;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 8px;

  &:active {
    &::-webkit-scrollbar {
      width: 0px;
      height: 0px;
      opacity: 0;
    }
  }
  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
    opacity: 0;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
    height: 0px;
  }
  &::-webkit-scrollbar-thumb {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: transparent;
  }
`;

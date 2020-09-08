import React, { useCallback, useEffect } from 'react';
import { AccountTypeEnum } from '../../enums/AccountTypeEnum';
import API from '../../helpers/API';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { FlexContainer } from '../../styles/FlexContainer';
import SvgIcon from '../SvgIcon';
import IconAddInstruments from '../../assets/svg/icon-add-instrument.svg';
import InstrumentBadge from './InstrumentBadge';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { useHistory } from 'react-router-dom';
import Page from '../../constants/Pages';
import Topics from '../../constants/websocketTopics';
import { ResponseFromWebsocket } from '../../types/ResponseFromWebsocket';
import { BidAskModelWSDTO } from '../../types/BidAsk';
import styled from '@emotion/styled';

const FavouriteInstruments = observer(() => {
  const {
    instrumentsStore,
    badRequestPopupStore,
    mainAppStore,
    quotesStore,
  } = useStores();
  const { push } = useHistory();
  const fetchFavoriteInstruments = useCallback(
    async (accountId: string, type: AccountTypeEnum) => {
      try {
        const response = await API.getFavoriteInstrumets({
          type,
          accountId,
        });
        instrumentsStore.setActiveInstrumentsIds(response);
        if (!instrumentsStore.activeInstrument) {
          instrumentsStore.switchInstrument(
            response[response.length - 1] ||
              instrumentsStore.instruments[
                instrumentsStore.instruments.length - 1
              ].instrumentItem.id
          );
        }
      } catch (error) {
        badRequestPopupStore.openModal();
        badRequestPopupStore.setMessage(error);
      }
    },
    [instrumentsStore.activeInstrument, instrumentsStore.activeInstrumentsIds]
  );

  const handleRemoveInstrument = (itemId: string) => async () => {
    const newInstruments = instrumentsStore.activeInstrumentsIds.filter(
      (id) => id !== itemId
    );
    try {
      const response = await API.postFavoriteInstrumets({
        accountId: mainAppStore.activeAccount!.id,
        type: mainAppStore.activeAccount!.isLive
          ? AccountTypeEnum.Live
          : AccountTypeEnum.Demo,
        instruments: newInstruments,
      });
      instrumentsStore.setActiveInstrumentsIds(response);

      if (instrumentsStore.activeInstrument?.instrumentItem.id === itemId) {
        instrumentsStore.switchInstrument(response[response.length - 1]);
      }
    } catch (error) {
      badRequestPopupStore.openModal();
      badRequestPopupStore.setMessage(error);
    }
  };

  const gotoMarkets = () => {
    push(Page.MARKETS);
  };

  useEffect(() => {
    if (mainAppStore.activeAccountId) {
      fetchFavoriteInstruments(
        mainAppStore.activeAccountId,
        // sh@t from backend
        mainAppStore.activeAccount?.isLive
          ? AccountTypeEnum.Live
          : AccountTypeEnum.Demo
      );
    }
  }, [mainAppStore.activeAccountId]);

  useEffect(() => {
    mainAppStore.activeSession?.on(
      Topics.BID_ASK,
      (response: ResponseFromWebsocket<BidAskModelWSDTO[]>) => {
        if (!response.data.length) {
          return;
        }
        response.data.forEach((item) => {
          quotesStore.setQuote(item);
        });
      }
    );
  }, [mainAppStore.activeSession, instrumentsStore.activeInstrument]);

  return (
    <FlexContainer marginBottom="14px" padding="16px 0">
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
        {instrumentsStore.activeInstruments.map((item, index) => (
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
  &::-webkit-scrollbar {
    width: 1px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: transparent;
  }
`;

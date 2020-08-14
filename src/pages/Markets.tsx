import React, { useState, useEffect, ChangeEvent } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import DashboardLayout from '../components/DashboardLayout';
import SearchPanel from '../components/SearchPanel';
import MarketsGroupList from '../components/Markets/MarketsGroupList';
import { Observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import InstrumentMarkets from '../components/Markets/InstrumentMarkets';
import { useStores } from '../hooks/useStores';

const Markets = () => {
  const [acitveSearch, toggleSearch] = useState(false);

  const handleToggleSearch = (on: boolean) => toggleSearch(on);

  const { instrumentsStore } = useStores();

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.trim().toLowerCase();
    instrumentsStore.filteredInstrumentsSearch = instrumentsStore.instruments
      .filter(
        (item) =>
          !searchValue ||
          item.instrumentItem.id.toLowerCase().includes(searchValue) ||
          item.instrumentItem.base.toLowerCase().includes(searchValue) ||
          item.instrumentItem.name.toLowerCase().includes(searchValue) ||
          item.instrumentItem.quote.toLowerCase().includes(searchValue)
      )
      .map((item) => item.instrumentItem);
  };

  useEffect(() => {
    instrumentsStore.filteredInstrumentsSearch = instrumentsStore.instruments
      .sort((a, b) => a.instrumentItem.weight - b.instrumentItem.weight)
      .map((item) => item.instrumentItem);
  }, []);

  return (
    <DashboardLayout>
      <FlexContainer flexDirection="column" width="100vw">
        <FlexContainer padding="20px 0 32px" flexDirection="column">
          <FlexContainer
            padding="0 16px"
            alignItems="center"
            justifyContent="space-between"
            position="relative"
            width="100%"
          >
            <PrimaryTextSpan color="#ffffff" fontWeight={600} fontSize="24px">
              Markets
            </PrimaryTextSpan>
            <SearchPanel
              onChange={handleChangeSearch}
              onToggle={handleToggleSearch}
              position="absolute"
            />
          </FlexContainer>

          {acitveSearch ? (
            <FlexContainer padding="32px 16px 6px">
              <PrimaryTextSpan
                color="rgba(255, 255, 255, 0.4)"
                fontSize="13px"
                fontWeight={500}
                textTransform="uppercase"
              >
                Recent search
              </PrimaryTextSpan>
            </FlexContainer>
          ) : (
            <MarketsGroupList />
          )}
        </FlexContainer>

        <FlexContainer flexDirection="column">
          <MarketsWrapper flexDirection="column">
            {acitveSearch ? (
              <>
                <Observer>
                  {() => (
                    <>
                      {instrumentsStore.filteredInstrumentsSearch.map(
                        (instrument) => (
                          <InstrumentMarkets
                            instrument={instrument}
                            key={instrument.id}
                          ></InstrumentMarkets>
                        )
                      )}
                    </>
                  )}
                </Observer>
              </>
            ) : (
              <Observer>
                {() => (
                  <>
                    {instrumentsStore.sortedInstruments.map((item) => (
                      <InstrumentMarkets instrument={item} key={item.id} />
                    ))}
                  </>
                )}
              </Observer>
            )}
          </MarketsWrapper>
        </FlexContainer>
      </FlexContainer>
    </DashboardLayout>
  );
};

const MarketsWrapper = styled(FlexContainer)`
  overflow-y: auto;
  width: 100vw;
  max-height: calc(100vh - 264px);

  ::-webkit-scrollbar {
    width: 4px;
    border-radius: 2px;
  }
  ::-webkit-scrollbar-track-piece {
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb:vertical {
    background-color: rgba(0, 0, 0, 0.6);
  }
`;

export default Markets;

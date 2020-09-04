import React, { useState, ChangeEvent } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import SearchPanel from '../components/SearchPanel';
import MarketsGroupList from '../components/Markets/MarketsGroupList';
import { Observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import InstrumentMarkets from '../components/Markets/InstrumentMarkets';
import { useStores } from '../hooks/useStores';
import { useTranslation } from 'react-i18next';
import { FULL_VH } from '../constants/global';

const Markets = () => {
  const [acitveSearch, toggleSearch] = useState(false);

  const handleToggleSearch = (on: boolean) => toggleSearch(on);

  const { instrumentsStore } = useStores();

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.trim().toLowerCase();
    instrumentsStore.searchValue = searchValue;
  };

  const { t } = useTranslation();

  return (
    <>
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
              {t('Markets')}
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
                {t('Recent search')}
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
                        (item) => (
                          <FlexContainer
                            marginBottom="2px"
                            backgroundColor="rgba(42, 45, 56, 0.5)"
                            minHeight="80px"
                            key={item.id}
                          >
                            <InstrumentMarkets
                              instrument={item}
                            ></InstrumentMarkets>
                          </FlexContainer>
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
                      <FlexContainer
                        marginBottom="2px"
                        backgroundColor="rgba(42, 45, 56, 0.5)"
                        minHeight="80px"
                        key={item.id}
                      >
                        <InstrumentMarkets
                          instrument={item}
                        ></InstrumentMarkets>
                      </FlexContainer>
                    ))}
                  </>
                )}
              </Observer>
            )}
          </MarketsWrapper>
        </FlexContainer>
      </FlexContainer>
    </>
  );
};

const MarketsWrapper = styled(FlexContainer)`
  overflow-y: auto;
  width: 100vw;
  max-height: calc(${FULL_VH} - 264px);

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

import React, {useEffect, useRef} from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import { useStores } from '../../hooks/useStores';
import { Observer, observer } from 'mobx-react-lite';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import Colors from '../../constants/Colors';

const MarketsGroupList = observer(() => {
  const {
    instrumentsStore,
    sortingStore,
    mainAppStore
  } = useStores();

  const activeAssetRef = useRef<HTMLButtonElement>(document.createElement('button'));

  const setActiveInstrumentGroup = (groupId: string) => () => {
    instrumentsStore.activeInstrumentGroupId = groupId;
  };

  useEffect(() => {
    activeAssetRef.current.scrollIntoView();
  }, [instrumentsStore.activeInstrumentGroupId]);

  useEffect(() => {
    if (
      mainAppStore.paramsMarkets &&
      instrumentsStore.instrumentGroups.length > 0
    ) {
      const instrumentId = instrumentsStore.instrumentGroups
        .find(
          (item) => item.name === mainAppStore.paramsMarkets
        )?.id || instrumentsStore.instrumentGroups[0].id;
      instrumentsStore.setActiveInstrumentGroupId(instrumentId);
      mainAppStore.setParamsMarkets(null);
    }
  }, [
    mainAppStore.paramsMarkets,
    instrumentsStore.instrumentGroups
  ]);

  return (
    <ListWrap>
      <Observer>
        {() => (
          <>
            {instrumentsStore.instrumentGroups.map((item) => (
              <MarketButton
                key={item.id}
                isActive={instrumentsStore.activeInstrumentGroupId === item.id}
                onClick={setActiveInstrumentGroup(item.id)}
                ref={instrumentsStore.activeInstrumentGroupId === item.id
                  ? activeAssetRef
                  : null
                }
              >
                <PrimaryTextSpan
                  color={
                    instrumentsStore.activeInstrumentGroupId === item.id
                      ? Colors.ACCENT
                      : 'rgba(196, 196, 196, 0.5)'
                  }
                  fontSize="13px"
                  lineHeight="1"
                >
                  {item.name}
                </PrimaryTextSpan>
              </MarketButton>
            ))}
          </>
        )}
      </Observer>
    </ListWrap>
  );
});

export default MarketsGroupList;

const ListWrap = styled(FlexContainer)`
  padding: 24px 16px 0 0;
  overflow-x: auto;
`;

const MarketButton = styled(ButtonWithoutStyles)<{ isActive: boolean }>`
  background-color: ${(props) =>
    props.isActive ? '#494C53' : Colors.NOTIFICATION_BG};
  border-radius: 8px;
  padding: 8px 12px;
  margin-left: 16px;
  transition: all 0.4s ease;
`;

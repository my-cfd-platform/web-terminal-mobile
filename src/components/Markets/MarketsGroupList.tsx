import React, {useEffect, useRef} from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import { useStores } from '../../hooks/useStores';
import { Observer, observer } from 'mobx-react-lite';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import Colors from '../../constants/Colors';
import { autorun } from 'mobx';
import { InstrumentGroupWSDTO } from '../../types/InstrumentsTypes';
import SvgIcon from '../SvgIcon';
import groupIconById from '../../constants/groupIconById';
import IndexIcon from '../../assets/svg/groups/icon-index.svg';

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

  const getIcon = (groupId: string) => {
    // @ts-ignore
    const neededIcon = groupIconById[groupId] || IndexIcon;
    return <SvgIcon {...neededIcon} fillColor={
      instrumentsStore.activeInstrumentGroupId === groupId
        ? Colors.ACCENT
        : 'rgba(196, 196, 196, 0.5)'
    } />
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
          (item) => item.id === mainAppStore.paramsMarkets
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
                <FlexContainer marginRight="8px">
                  {getIcon(item.id)}
                </FlexContainer>
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
  
  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
    opacity: 0;
  }
`;

const MarketButton = styled(ButtonWithoutStyles)<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.isActive ? '#494C53' : Colors.NOTIFICATION_BG};
  border-radius: 8px;
  padding: 8px 16px;
  margin-left: 8px;
  transition: all 0.4s ease;
`;

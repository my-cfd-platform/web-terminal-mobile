import React from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import { useStores } from '../../hooks/useStores';
import { Observer } from 'mobx-react-lite';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import Colors from '../../constants/Colors';

const MarketsGroupList = () => {
  const { instrumentsStore, sortingStore } = useStores();

  const setActiveInstrumentGroup = (groupId: string) => () => {
    instrumentsStore.activeInstrumentGroupId = groupId;
  };

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
};

export default MarketsGroupList;

const ListWrap = styled(FlexContainer)`
  padding: 24px 0 0;
  overflow-x: auto;
  padding-right: 16px;
`;

const MarketButton = styled(ButtonWithoutStyles)<{ isActive: boolean }>`
  background-color: ${(props) =>
    props.isActive ? '#494C53' : Colors.NOTIFICATION_BG};
  border-radius: 8px;
  padding: 8px 12px;
  margin-left: 16px;
  transition: all 0.4s ease;
`;

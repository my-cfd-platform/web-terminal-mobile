import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks/useStores';
import ActivePositionItem from './ActivePositionItem';
import EmptyListText from '../EmptyListText';
import { FlexContainer } from '../../styles/FlexContainer';
import { observer } from 'mobx-react-lite';

const ActivePositions = observer(() => {
  const { t } = useTranslation();

  const { quotesStore } = useStores();

  return (
    <>
      {quotesStore.sortedActivePositions.length ? (
        quotesStore.sortedActivePositions.map((item) => (
          <FlexContainer
            key={item.id}
            marginBottom="2px"
            backgroundColor="rgba(42, 45, 56, 0.5)"
          >
            <ActivePositionItem position={item} />
          </FlexContainer>
        ))
      ) : (
        <EmptyListText text={t("You haven't opened any positions yet")} />
      )}
    </>
  );
});

export default ActivePositions;

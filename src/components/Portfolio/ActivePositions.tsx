import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks/useStores';
import ActivePositionItem from './ActivePositionItem';
import EmptyListText from '../EmptyListText';
import { FlexContainer } from '../../styles/FlexContainer';
import { observer } from 'mobx-react-lite';
import { PortfolioTabEnum } from '../../enums/PortfolioTabEnum';
import { useHistory } from 'react-router-dom';

const ActivePositions = observer(() => {
  const { t } = useTranslation();
  const { push } = useHistory();
  const positionRef = useRef<HTMLDivElement>(document.createElement('div'));

  const {
    quotesStore,
    historyStore,
    portfolioNavLinksStore,
    mainAppStore
  } = useStores();

  useEffect(() => {
    historyStore.clearPositionsHistory();
    portfolioNavLinksStore.setPortfolioNavLink(PortfolioTabEnum.ACTIVE);
  }, []);

  useEffect(() => {
    if (mainAppStore.paramsPortfolioActive && quotesStore.activePositions.length) {
      positionRef.current.scrollIntoView();
      mainAppStore.setParamsPortfolioActive(null);
    }
  }, [
    mainAppStore.paramsPortfolioActive,
    quotesStore.activePositions
  ]);

  return (
    <>
      {quotesStore.activePositions.length ? (
        quotesStore.sortedActivePositions.map((item) => (
          <FlexContainer
            key={item.id}
            marginBottom="2px"
            backgroundColor="rgba(42, 45, 56, 0.5)"
            ref={
              mainAppStore.paramsPortfolioActive !== null &&
              item.id === parseInt(mainAppStore.paramsPortfolioActive) ?
                positionRef :
                null
            }
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

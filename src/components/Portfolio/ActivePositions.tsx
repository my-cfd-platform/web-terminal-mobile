import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks/useStores';
import ActivePositionItem from './ActivePositionItem';
import EmptyListText from '../EmptyListText';
import { FlexContainer } from '../../styles/FlexContainer';
import { observer } from 'mobx-react-lite';
import { PortfolioTabEnum } from '../../enums/PortfolioTabEnum';
import { useHistory } from 'react-router-dom';
import Page from '../../constants/Pages';

const ActivePositions = observer(() => {
  const { t } = useTranslation();
  const { push } = useHistory();

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
    if (
      quotesStore.activePositions.length &&
      mainAppStore.paramsPortfolioActive
    ) {
      const positionId = parseInt(mainAppStore.paramsPortfolioActive);
      const positionById = quotesStore.activePositions.find(
        (item) => item.id === positionId
      );
      if (positionById) {
        push(`${Page.PORTFOLIO_MAIN}/active/${positionId}`);
      } else {
        mainAppStore.setParamsPortfolioActive(null);
      }
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

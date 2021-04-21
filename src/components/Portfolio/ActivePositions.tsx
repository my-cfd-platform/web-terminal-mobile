import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks/useStores';
import ActivePositionItem from './ActivePositionItem';
import EmptyListText from '../EmptyListText';
import { FlexContainer } from '../../styles/FlexContainer';
import { observer } from 'mobx-react-lite';
import { PortfolioTabEnum } from '../../enums/PortfolioTabEnum';
import Page from '../../constants/Pages';
import { useHistory } from 'react-router-dom';

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
    if (mainAppStore.paramsPortfolioActive && quotesStore.activePositions.length) {
      push(`${Page.PORTFOLIO_MAIN}/active/${mainAppStore.paramsPortfolioActive}`);
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

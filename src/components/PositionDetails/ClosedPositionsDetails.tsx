import React, { FC, useCallback, useEffect, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import useInstrument from '../../hooks/useInstrument';
import { getNumberSign } from '../../helpers/getNumberSign';
import { useStores } from '../../hooks/useStores';
import { PositionHistoryDTO } from '../../types/HistoryReportTypes';
import styled from '@emotion/styled';
import { AskBidEnum } from '../../enums/AskBid';
import Colors from '../../constants/Colors';
import closingReasonText from '../../constants/ClosingReasonText';
import ClosedPositionItem from '../Portfolio/ClosedPositionItem';
import { useHistory } from 'react-router-dom';
import Page from '../../constants/Pages';
import LoaderForComponents from '../LoaderForComponents';
import { PortfolioTabEnum } from '../../enums/PortfolioTabEnum';
import { observer } from 'mobx-react-lite';

interface Props {
  positionId: number;
}

const ClosedPositionsDetails: FC<Props> = observer(({ positionId }) => {
  const { t } = useTranslation();
  const { getPressision } = useInstrument();
  const { mainAppStore, historyStore } = useStores();
  const { push } = useHistory();

  const [position, setPosition] = useState<PositionHistoryDTO>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchPositionHistory = useCallback(async () => {
    try {
      await historyStore.fetchPositionsHistory();
      const newHistoryPosition = historyStore.positionsHistoryReport.positionsHistory.find(
        (item) => item.id === positionId
      );
      if (newHistoryPosition) {
        setIsLoading(false);
        setPosition(newHistoryPosition);
      } else {
        push(`${Page.PORTFOLIO_MAIN}/${PortfolioTabEnum.CLOSED}`);
      }
    } catch (error) {
      push(`${Page.PORTFOLIO_MAIN}/${PortfolioTabEnum.CLOSED}`);
    }
  }, [historyStore.positionsHistoryReport]);

  useEffect(() => {
    mainAppStore.setParamsPortfolioClosed(null);
    if (mainAppStore.activeAccountId) {
      const currentHistoryPosition = historyStore.positionsHistoryReport.positionsHistory.find(
        (item) => item.id === positionId
      );
      if (!currentHistoryPosition) {
        fetchPositionHistory();
      } else {
        setIsLoading(false);
        setPosition(currentHistoryPosition);
      }
      if (historyStore.positionsHistoryReport.positionsHistory && !currentHistoryPosition) {
        mainAppStore.setParamsPortfolioClosed(`${positionId}`);
        push(`${Page.PORTFOLIO_MAIN}/closed`);
      }
    }
  }, [mainAppStore.activeAccountId]);

  return (
    <>
      <LoaderForComponents isLoading={isLoading} />
      {position && (
        <FlexContainer
          flexDirection="column"
          maxHeight="100%"
          overflow="auto"
          width="100%"
        >
          <ClosedPositionItem
            currencySymbol={mainAppStore.activeAccount?.symbol || ''}
            tradingHistoryItem={position}
            isInner={true}
          />

          <FlexContainer padding="12px 16px 0" marginBottom="8px">
            <PrimaryTextSpan
              color="rgba(255, 255, 255, 0.4)"
              fontSize="13px"
              textTransform="uppercase"
            >
              {t('Info')}
            </PrimaryTextSpan>
          </FlexContainer>

          <FlexContainer
            width="100%"
            padding="8px 16px"
            justifyContent="space-between"
          >
            <PrimaryTextSpan color="#fff" fontSize="16px">
              {t('Opening Time')}
            </PrimaryTextSpan>
            <PrimaryTextSpan fontSize="16px">
              {moment(position.openDate).format('HH:mm, DD MMM YYYY')}
            </PrimaryTextSpan>
          </FlexContainer>

          <FlexContainer
            width="100%"
            padding="8px 16px"
            justifyContent="space-between"
          >
            <PrimaryTextSpan color="#fff" fontSize="16px">
              {t('Closing Time')}
            </PrimaryTextSpan>
            <PrimaryTextSpan fontSize="16px">
              {moment(position.closeDate).format('HH:mm, DD MMM YYYY')}
            </PrimaryTextSpan>
          </FlexContainer>

          <FlexContainer
            width="100%"
            padding="8px 16px"
            justifyContent="space-between"
          >
            <PrimaryTextSpan color="#fff" fontSize="16px">
              {t('Opening Price')}
            </PrimaryTextSpan>

            <FlexContainer alignItems="center">
              <QuoteTextLabel operation={position.operation} marginRight="8px">
                <PrimaryTextSpan
                  color={
                    position.operation === AskBidEnum.Buy
                      ? '#000000'
                      : '#ffffff'
                  }
                  fontSize="13px"
                  textTransform="uppercase"
                >
                  {`${position.operation === AskBidEnum.Buy ? 'Buy' : 'Sell'}`}
                </PrimaryTextSpan>
              </QuoteTextLabel>
              <PrimaryTextSpan fontSize="16px">
                {mainAppStore.activeAccount?.symbol}
                {position.openPrice.toFixed(getPressision(position.instrument))}
              </PrimaryTextSpan>
            </FlexContainer>
          </FlexContainer>

          <FlexContainer
            width="100%"
            padding="8px 16px"
            justifyContent="space-between"
          >
            <PrimaryTextSpan color="#fff" fontSize="16px">
              {t('Closing Price')}
            </PrimaryTextSpan>

            <PrimaryTextSpan fontSize="16px">
              {mainAppStore.activeAccount?.symbol}
              {position.closePrice.toFixed(getPressision(position.instrument))}
            </PrimaryTextSpan>
          </FlexContainer>

          <FlexContainer
            width="100%"
            padding="8px 16px"
            justifyContent="space-between"
          >
            <PrimaryTextSpan color="#fff" fontSize="16px">
              {t('Multiplier')}
            </PrimaryTextSpan>
            <PrimaryTextSpan fontSize="16px">
              &times;{position.leverage}
            </PrimaryTextSpan>
          </FlexContainer>

          <FlexContainer
            width="100%"
            padding="8px 16px"
            justifyContent="space-between"
          >
            <PrimaryTextSpan color="#fff" fontSize="16px">
              {t('Overnight fee')}
            </PrimaryTextSpan>
            <PrimaryTextSpan fontSize="16px">
              {getNumberSign(position.swap)}
              {mainAppStore.activeAccount?.symbol}
              {Math.abs(position.swap).toFixed(2)}
            </PrimaryTextSpan>
          </FlexContainer>

          {position.reservedFundsForToppingUp !== 0 && (
            <FlexContainer
              width="100%"
              padding="8px 16px"
              justifyContent="space-between"
            >
              <PrimaryTextSpan color="#fff" fontSize="16px">
                {t('Insurance amount')}
              </PrimaryTextSpan>
              <PrimaryTextSpan fontSize="16px">
                {mainAppStore.activeAccount?.symbol}
                {Math.abs(position.reservedFundsForToppingUp).toFixed(2)}
              </PrimaryTextSpan>
            </FlexContainer>
          )}

          <FlexContainer
            width="100%"
            padding="8px 16px"
            justifyContent="space-between"
          >
            <PrimaryTextSpan color="#fff" fontSize="16px">
              {t('Closing Reason')}
            </PrimaryTextSpan>
            <PrimaryTextSpan fontSize="16px">
              {t(closingReasonText[position.closeReason])}
            </PrimaryTextSpan>
          </FlexContainer>

          <FlexContainer
            width="100%"
            padding="8px 16px"
            justifyContent="space-between"
          >
            <PrimaryTextSpan color="#fff" fontSize="16px">
              {t('Position ID')}
            </PrimaryTextSpan>
            <PrimaryTextSpan fontSize="16px">{position.id}</PrimaryTextSpan>
          </FlexContainer>
        </FlexContainer>
      )}
    </>
  );
});

export default ClosedPositionsDetails;

const QuoteTextLabel = styled(FlexContainer)<{ operation?: number }>`
  background-color: ${(props) =>
    props.operation === AskBidEnum.Buy ? Colors.ACCENT_BLUE : Colors.RED};
  border-radius: 4px;
  padding: 4px 4px;
  font-size: 13px;
`;

import React, { useEffect, useState, FC, useCallback } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import ActivePositionItem from '../Portfolio/ActivePositionItem';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { PositionModelWSDTO } from '../../types/Positions';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import useInstrument from '../../hooks/useInstrument';
import { getNumberSign } from '../../helpers/getNumberSign';
import { useStores } from '../../hooks/useStores';
import { observer, Observer } from 'mobx-react-lite';
import Colors from '../../constants/Colors';
import ClosePositionButton from '../ClosePositionButton';
import { getProcessId } from '../../helpers/getProcessId';
import API from '../../helpers/API';
import { OperationApiResponseCodes } from '../../enums/OperationApiResponseCodes';
import { useHistory } from 'react-router-dom';
import EquityPnL from './EquityPnL';
import calculateFloatingProfitAndLoss from '../../helpers/calculateFloatingProfitAndLoss';
import { AskBidEnum } from '../../enums/AskBid';
import ImageContainer from '../ImageContainer';
import apiResponseCodeMessages from '../../constants/apiResponseCodeMessages';
import Page from '../../constants/Pages';
import { PortfolioTabEnum } from '../../enums/PortfolioTabEnum';
import { TpSlTypeEnum } from '../../enums/TpSlTypeEnum';
import styled from '@emotion/styled';

interface Props {
  positionId: number;
}
const ActivePositionsDetails: FC<Props> = observer((props) => {
  const { positionId } = props;
  const { t } = useTranslation();
  const { getPressision } = useInstrument();
  const {
    mainAppStore,
    quotesStore,
    notificationStore,
    activePositionNotificationStore,
    instrumentsStore,
  } = useStores();
  const { push } = useHistory();

  const [position, setPosition] = useState<PositionModelWSDTO>();

  const activeInstrument = useCallback(() => {
    return (
      instrumentsStore.instruments.find(
        (item) => item.instrumentItem.id === position?.instrument
      )?.instrumentItem || instrumentsStore.instruments[0].instrumentItem
    );
  }, [position]);

  const closePosition = async () => {
    if (!position) {
      return;
    }

    try {
      const isBuy = position.operation === AskBidEnum.Buy;
      const equity =
        position.investmentAmount +
        calculateFloatingProfitAndLoss({
          investment: position.investmentAmount,
          multiplier: position.multiplier,
          costs: position.swap + position.commission,
          side: isBuy ? 1 : -1,
          currentPrice: isBuy
            ? quotesStore.quotes[position.instrument].bid.c
            : quotesStore.quotes[position.instrument].ask.c,
          openPrice: position.openPrice,
        });

      const response = await API.closePosition({
        accountId: mainAppStore.activeAccount!.id,
        positionId: position.id,
        processId: getProcessId(),
      });

      if (response.result === OperationApiResponseCodes.Ok) {
        const instrumentItem = instrumentsStore.instruments.find(
          (item) => item.instrumentItem.id === position.instrument
        )?.instrumentItem;

        if (instrumentItem) {
          activePositionNotificationStore.notificationMessageData = {
            equity: equity,
            instrumentName: instrumentItem.name,
            instrumentGroup:
              instrumentsStore.instrumentGroups.find(
                (item) => item.id === instrumentItem.id
              )?.name || '',
            instrumentId: instrumentItem.id,
            type: 'close',
          };
          activePositionNotificationStore.isSuccessfull = true;
          activePositionNotificationStore.openNotification();
        }

        push(`${Page.PORTFOLIO_MAIN}/${PortfolioTabEnum.ACTIVE}`);
      } else {
        notificationStore.notificationMessage = t(
          apiResponseCodeMessages[response.result]
        );
        notificationStore.isSuccessfull = false;
        notificationStore.openNotification();
      }
    } catch (error) {}
  };

  const getCurrentPrice = useCallback(() => {
    switch (position?.operation) {
      case AskBidEnum.Sell:
        return instrumentsStore.instruments.find(
          (item) => item.instrumentItem.id === position.instrument
        )?.instrumentItem.ask;

      default:
        return instrumentsStore.instruments.find(
          (item) => item.instrumentItem.id === position?.instrument
        )?.instrumentItem.bid;
    }
  }, [position, instrumentsStore.instruments]);

  useEffect(() => {
    const positionById = quotesStore.activePositions?.find(
      (item) => item.id === +positionId
    );
    if (positionById) {
      setPosition(positionById);
    }
  }, [positionId]);

  return (
    <>
      {position && (
        <FlexContainer
          flexDirection="column"
          maxHeight="100%"
          overflow="auto"
          width="100%"
        >
          <ActivePositionItem position={position} />

          <FlexContainer flexDirection="column" marginBottom="20px">
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
                {t('Opening Price')}
              </PrimaryTextSpan>

              <FlexContainer alignItems="center">
                <QuoteTextLabel
                  operation={position.operation}
                  marginRight="8px"
                >
                  <PrimaryTextSpan
                    color={
                      position.operation === AskBidEnum.Buy
                        ? '#000000'
                        : '#ffffff'
                    }
                    fontSize="13px"
                    textTransform="uppercase"
                  >
                    {t(position.operation === AskBidEnum.Buy ? 'Buy' : 'Sell')}
                  </PrimaryTextSpan>
                </QuoteTextLabel>
                <PrimaryTextSpan fontSize="16px">
                  {position.openPrice.toFixed(
                    getPressision(position.instrument)
                  )}
                </PrimaryTextSpan>
              </FlexContainer>
            </FlexContainer>

            <FlexContainer
              width="100%"
              padding="8px 16px"
              justifyContent="space-between"
            >
              <PrimaryTextSpan color="#fff" fontSize="16px">
                {t('Current Price')}
              </PrimaryTextSpan>
              <PrimaryTextSpan fontSize="16px">
                <Observer>
                  {() => (
                    <>
                      {position.operation === AskBidEnum.Buy
                        ? quotesStore.quotes[
                            activeInstrument()?.id
                          ].bid.c.toFixed(activeInstrument()?.digits)
                        : quotesStore.quotes[
                            activeInstrument()?.id
                          ].ask.c.toFixed(activeInstrument()?.digits)}
                    </>
                  )}
                </Observer>
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
                &times;{position.multiplier}
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

          <FlexContainer flexDirection="column" marginBottom="20px">
            <FlexContainer padding="12px 16px 0" marginBottom="8px">
              <PrimaryTextSpan
                color="rgba(255, 255, 255, 0.4)"
                fontSize="13px"
                textTransform="uppercase"
              >
                {t('Settings')}
              </PrimaryTextSpan>
            </FlexContainer>

            <FlexContainer
              backgroundColor="rgba(42, 45, 56, 0.5)"
              height="50px"
              justifyContent="space-between"
              alignItems="center"
              padding="0 16px"
              marginBottom="1px"
            >
              <PrimaryTextSpan color="#ffffff" fontSize="16px">
                {t('Stop Loss')}
              </PrimaryTextSpan>

              <PrimaryTextSpan color="rgba(196, 196, 196, 0.5)" fontSize="16px">
                {position.sl !== null ? (
                  <>
                    {position.slType !== TpSlTypeEnum.Price &&
                      position.sl < 0 &&
                      '-'}
                    {position.slType !== TpSlTypeEnum.Price &&
                      mainAppStore.activeAccount?.symbol}
                    {position.slType === TpSlTypeEnum.Price
                      ? Math.abs(position.sl).toFixed(getPressision(position.instrument))
                      : Math.abs(position.sl).toFixed(2)}
                  </>
                ) : (
                  t('Add')
                )}
              </PrimaryTextSpan>
            </FlexContainer>

            <FlexContainer
              backgroundColor="rgba(42, 45, 56, 0.5)"
              height="50px"
              justifyContent="space-between"
              alignItems="center"
              padding="0 16px"
              marginBottom="1px"
            >
              <PrimaryTextSpan color="#ffffff" fontSize="16px">
                {t('Take Profit')}
              </PrimaryTextSpan>

              <PrimaryTextSpan color="rgba(196, 196, 196, 0.5)" fontSize="16px">
                {position.tp !== null ? (
                  <>
                    {position.tpType !== TpSlTypeEnum.Price &&
                      position.tp < 0 &&
                      '-'}
                    {position.tpType !== TpSlTypeEnum.Price &&
                      mainAppStore.activeAccount?.symbol}
                    {position.tpType === TpSlTypeEnum.Price
                      ? Math.abs(position.tp).toFixed(getPressision(position.instrument))
                      : Math.abs(position.tp).toFixed(2)}
                  </>
                ) : (
                  t('Add')
                )}
              </PrimaryTextSpan>
            </FlexContainer>
          </FlexContainer>

          <FlexContainer
            position="absolute"
            bottom="16px"
            left="16px"
            right="16px"
          >
            <ClosePositionButton applyHandler={closePosition}>
              Confirm closing of&nbsp;
              <PrimaryTextSpan color="#ffffff">
                {position.instrument}
              </PrimaryTextSpan>
              &nbsp; position for&nbsp;
              <PrimaryTextSpan color="#ffffff">
                <EquityPnL position={position} />
              </PrimaryTextSpan>
            </ClosePositionButton>
          </FlexContainer>
        </FlexContainer>
      )}
    </>
  );
});

export default ActivePositionsDetails;

const QuoteTextLabel = styled(FlexContainer)<{ operation?: number }>`
  background-color: ${(props) =>
    props.operation === AskBidEnum.Buy ? Colors.ACCENT_BLUE : Colors.RED};
  border-radius: 4px;
  padding: 4px 16px;
  font-size: 13px;
`;

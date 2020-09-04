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
import { PendingOrderWSDTO } from '../../types/PendingOrdersTypes';
import PendingOrderItem from '../Portfolio/PendingOrderItem';


interface Props {
  positionId: number;
}
const PendingPositionsDetails: FC<Props> = observer((props) => {
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

  const [position, setPosition] = useState<PendingOrderWSDTO>();

  const handleCloseOrder = () => {
    API.removePendingOrder({
      accountId: mainAppStore.activeAccount!.id,
      orderId: position?.id || 0,
      processId: getProcessId(),
    });
  };

  const activeInstrument = useCallback(() => {
    return (
      instrumentsStore.instruments.find(
        (item) => item.instrumentItem.id === position?.instrument
      )?.instrumentItem || instrumentsStore.instruments[0].instrumentItem
    );
  }, [position]);

  const getInstrument = useCallback(() => {
    const instrument =
      instrumentsStore.instruments.find(
        (item) => item.instrumentItem.id === position?.instrument
      )?.instrumentItem || instrumentsStore.instruments[0].instrumentItem;

    return {
      groupId: instrument.groupId,
      id: instrument.id,
      investmentAmount: position?.investmentAmount || 0,
      name: instrument.name,
    };
  }, [position]);

  useEffect(() => {
    const positionById = quotesStore.pendingOrders?.find(
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
          
          {position && <PendingOrderItem pendingOrder={position} currencySymbol={mainAppStore.activeAccount?.symbol || ''} />}

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
                {t('Creating time')}
              </PrimaryTextSpan>
              <PrimaryTextSpan fontSize="16px">
                {moment(position.created).format('HH:mm, DD MMM YYYY')}
              </PrimaryTextSpan>
            </FlexContainer>

            <FlexContainer
              width="100%"
              padding="8px 16px"
              justifyContent="space-between"
            >
              <PrimaryTextSpan color="#fff" fontSize="16px">
                {t('Open at')}
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
                      ? Math.abs(position.sl)
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
                      ? Math.abs(position.tp)
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
            <ClosePositionButton applyHandler={handleCloseOrder}>
              Confirm closing of&nbsp;
              <PrimaryTextSpan color="#ffffff">
                {position.instrument}
              </PrimaryTextSpan>
              &nbsp; position for&nbsp;
            </ClosePositionButton>
          </FlexContainer>
        </FlexContainer>
      )}
    </>
  );
});

export default PendingPositionsDetails;

const QuoteTextLabel = styled(FlexContainer)<{ operation?: number }>`
  background-color: ${(props) =>
    props.operation === AskBidEnum.Buy ? Colors.ACCENT_BLUE : Colors.RED};
  border-radius: 4px;
  padding: 4px 16px;
  font-size: 13px;
`;

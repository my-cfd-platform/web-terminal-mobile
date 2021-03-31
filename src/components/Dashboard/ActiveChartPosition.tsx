import React, {FC, useState} from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { useStores } from '../../hooks/useStores';
import { Observer, observer } from 'mobx-react-lite';
import { PositionModelWSDTO } from '../../types/Positions';
import Colors from '../../constants/Colors';
import styled from '@emotion/styled';
import calculateFloatingProfitAndLoss from '../../helpers/calculateFloatingProfitAndLoss';
import { AskBidEnum } from '../../enums/AskBid';
import { useTranslation } from 'react-i18next';
import EquityPnL from '../PositionDetails/EquityPnL';
import ConfirmationPopup from '../ConfirmationPopup';
import { calculateInPercent } from '../../helpers/calculateInPercent';
import API from '../../helpers/API';
import { getProcessId } from '../../helpers/getProcessId';
import { OperationApiResponseCodes } from '../../enums/OperationApiResponseCodes';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../../constants/mixpanelEvents';
import mixapanelProps from '../../constants/mixpanelProps';
import apiResponseCodeMessages from '../../constants/apiResponseCodeMessages';
import ActivePositionPnL from '../Portfolio/ActivePositionPnL';
import mixpanelValues from '../../constants/mixpanelValues';

interface Props {
  position: PositionModelWSDTO;
}

const ActiveChartPosition: FC<Props> = observer(({ position }) => {
  const {
    quotesStore,
    mainAppStore,
    notificationStore,
    markersOnChartStore,
    activePositionNotificationStore,
    instrumentsStore
  } = useStores();
  const { t } = useTranslation();
  const [on, toggle] = useState<boolean>(false);
  const [closeLoading, setCloseLoading] = useState(false);

  const handleToggleLoadingClosePopup = (value: number | null) => {
    setCloseLoading(value === null);
  };

  const closePosition = () => {
    if (!on) {
      toggle(true);
    }
  };

  const applyHandler = async () => {
    try {
      const isBuy = position.operation === AskBidEnum.Buy;
      const equity: number | null = quotesStore.quotes[position.instrument]
        ? calculateFloatingProfitAndLoss({
          investment: position.investmentAmount,
          multiplier: position.multiplier,
          costs: position.swap + position.commission,
          side: isBuy ? 1 : -1,
          currentPrice: isBuy
            ? quotesStore.quotes[position.instrument].bid.c
            : quotesStore.quotes[position.instrument].ask.c,
          openPrice: position.openPrice,
        })
        : null;
      const percentPL: string | null = equity
        ? calculateInPercent(position.investmentAmount, equity)
        : null;
      if (equity && percentPL) {
        const response = await API.closePosition({
          accountId: mainAppStore.activeAccount!.id,
          positionId: position.id,
          processId: getProcessId(),
        });

        if (response.result === OperationApiResponseCodes.Ok) {
          markersOnChartStore.removeMarkerByPositionId(position.id);

          const instrumentItem = instrumentsStore.instruments.find(
            (item) => item.instrumentItem.id === position.instrument
          )?.instrumentItem;

          if (instrumentItem) {
            activePositionNotificationStore.notificationMessageData = {
              equity: equity,
              percentPL: +percentPL,
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
          mixpanel.track(mixpanelEvents.CLOSE_ORDER, {
            [mixapanelProps.AMOUNT]: position.investmentAmount,
            [mixapanelProps.ACCOUNT_CURRENCY]:
            mainAppStore.activeAccount?.currency || '',
            [mixapanelProps.INSTRUMENT_ID]: position.instrument,
            [mixapanelProps.MULTIPLIER]: position.multiplier,
            [mixapanelProps.TREND]:
              position.operation === AskBidEnum.Buy ? 'buy' : 'sell',
            [mixapanelProps.SLTP]: !!(position.sl || position.tp),
            [mixapanelProps.ACCOUNT_ID]: mainAppStore.activeAccount?.id || '',
            [mixapanelProps.ACCOUNT_TYPE]: mainAppStore.activeAccount?.isLive
              ? 'real'
              : 'demo',
            [mixapanelProps.EVENT_REF]: mixpanelValues.CHART,
          });
        } else {
          mixpanel.track(mixpanelEvents.CLOSE_ORDER_FAILED, {
            [mixapanelProps.AMOUNT]: position.investmentAmount,
            [mixapanelProps.ACCOUNT_CURRENCY]:
            mainAppStore.activeAccount?.currency || '',
            [mixapanelProps.INSTRUMENT_ID]: position.instrument,
            [mixapanelProps.MULTIPLIER]: position.multiplier,
            [mixapanelProps.TREND]:
              position.operation === AskBidEnum.Buy ? 'buy' : 'sell',
            [mixapanelProps.SLTP]: !!(position.sl || position.tp),
            [mixapanelProps.ACCOUNT_ID]: mainAppStore.activeAccount?.id || '',
            [mixapanelProps.ACCOUNT_TYPE]: mainAppStore.activeAccount?.isLive
              ? 'real'
              : 'demo',
            [mixapanelProps.ERROR_TEXT]:
              apiResponseCodeMessages[response.result],
            [mixapanelProps.EVENT_REF]: mixpanelValues.CHART,
          });
          notificationStore.notificationMessage = t(
            apiResponseCodeMessages[response.result]
          );
          notificationStore.isSuccessfull = false;
          notificationStore.openNotification();
        }
      }
    } catch (error) {}
  };

  const handleConfirmAction = (confirm: boolean) => {
    if (confirm) {
      applyHandler();
      toggle(false);
    } else {
      toggle(false);
    }
  };
  
  return (
    <FlexContainer
      justifyContent="space-between"
      padding="8px 15px"
      marginBottom="2px"
      backgroundColor="rgba(42, 45, 56, 0.5)"
      alignItems="center"
    >
      <FlexContainer alignItems="center">
        <PositionBadge
          isBuy={position.operation === AskBidEnum.Buy}
        >
          <PrimaryTextSpan
            fontSize="13px"
            fontWeight={800}
            color={position.operation === AskBidEnum.Buy
              ? '#000000'
              : '#ffffff'
            }
            lineHeight="14px"
          >
            {position.operation === AskBidEnum.Buy ? 'Buy' : 'Sell'}
          </PrimaryTextSpan>
        </PositionBadge>
        <Observer>
          {() => (
            <>
              <PrimaryTextSpan
                fontSize="16px"
                fontWeight={700}
                marginRight="7px"
              >
                {mainAppStore.activeAccount?.symbol}
                {position.investmentAmount.toFixed(2)}
              </PrimaryTextSpan>
              <ActivePositionPnL fontSize="16px" position={position}/>
            </>
          )}
        </Observer>
      </FlexContainer>
      <Observer>
        {() => <FlexContainer>
          <ButtonClose onClick={closePosition}>
            <PrimaryTextSpan
              color="#fff"
              fontSize="13px"
              fontWeight={700}
            >
              {t('Close')}
            </PrimaryTextSpan>
            {on && (
              <ConfirmationPopup isLoading={closeLoading} confirmAction={handleConfirmAction}>
                {t('Confirm closing of')}&nbsp;
                <PrimaryTextSpan color="#ffffff">
                  {position.instrument}
                </PrimaryTextSpan>
                &nbsp; {t('position for')}&nbsp;
                <PrimaryTextSpan color="#ffffff">
                  <EquityPnL
                    position={position}
                    handlePnL={handleToggleLoadingClosePopup}
                  />
                </PrimaryTextSpan>
              </ConfirmationPopup>
            )}
          </ButtonClose>
        </FlexContainer>}
      </Observer>
    </FlexContainer>
  );
});

export default ActiveChartPosition;

const PositionBadge = styled(FlexContainer)<{ isBuy: boolean }>`
  background-color: ${(props) =>
  props.isBuy ? Colors.ACCENT_BLUE : Colors.RED};
  border-radius: 4px;
  padding: 3px 8px;
  text-transform: uppercase;
  line-height: 1;
  height: 24px;
  width: 50px;
  margin-right: 10px;
  justify-content: center;
  align-items: center;
`;

const ButtonClose = styled(FlexContainer)`
  background-color: rgba(196, 196, 196, 0.5);
  border-radius: 5px;
  padding: 3px 13px;
  height: 24px;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
`;
import React, {FC, useEffect, useState} from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { useStores } from '../../hooks/useStores';
import { Observer, observer } from 'mobx-react-lite';
import { PositionModelWSDTO } from '../../types/Positions';
import Colors from '../../constants/Colors';
import { getNumberSign } from '../../helpers/getNumberSign';
import styled from '@emotion/styled';
import calculateFloatingProfitAndLoss from '../../helpers/calculateFloatingProfitAndLoss';
import { AskBidEnum } from '../../enums/AskBid';
import { useTranslation } from 'react-i18next';
import BuyIcon from '../../assets/svg/icon-buy.svg';
import SellIcon from '../../assets/svg/icon-shevron-logo-down.svg';
import CloseIcon from '../../assets/svg/icon-close.svg';
import SvgIcon from '../SvgIcon';
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
import ActiveChartPosition from './ActiveChartPosition';
import mixpanelValues from '../../constants/mixpanelValues';

interface Props {
  activePositions: PositionModelWSDTO[];
}

const ActiveChartOrders: FC<Props> = observer(({ activePositions }) => {
  const {
    quotesStore,
    mainAppStore,
    notificationStore,
    markersOnChartStore,
    activePositionNotificationStore,
    instrumentsStore
  } = useStores();
  const { t } = useTranslation();
  const [profit, setProfit] = useState<number>(0);
  const [invest, setInvest] = useState<number>(0);
  const [on, toggle] = useState<boolean>(false);
  const [viewAll, toggleViewAll] = useState<boolean>(false);
  const [closeLoading, setCloseLoading] = useState<boolean>(false);

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
      const isBuy = activePositions[0].operation === AskBidEnum.Buy;
      const equity: number | null = quotesStore.quotes[activePositions[0].instrument]
        ? calculateFloatingProfitAndLoss({
          investment: activePositions[0].investmentAmount,
          multiplier: activePositions[0].multiplier,
          costs: activePositions[0].swap + activePositions[0].commission,
          side: isBuy ? 1 : -1,
          currentPrice: isBuy
            ? quotesStore.quotes[activePositions[0].instrument].bid.c
            : quotesStore.quotes[activePositions[0].instrument].ask.c,
          openPrice: activePositions[0].openPrice,
        })
        : null;
      const percentPL: string | null = equity
        ? calculateInPercent(activePositions[0].investmentAmount, equity)
        : null;
      if (equity && percentPL) {
        const response = await API.closePosition({
          accountId: mainAppStore.activeAccount!.id,
          positionId: activePositions[0].id,
          processId: getProcessId(),
        });

        if (response.result === OperationApiResponseCodes.Ok) {
          markersOnChartStore.removeMarkerByPositionId(activePositions[0].id);

          const instrumentItem = instrumentsStore.instruments.find(
            (item) => item.instrumentItem.id === activePositions[0].instrument
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
            [mixapanelProps.AMOUNT]: activePositions[0].investmentAmount,
            [mixapanelProps.ACCOUNT_CURRENCY]:
            mainAppStore.activeAccount?.currency || '',
            [mixapanelProps.INSTRUMENT_ID]: activePositions[0].instrument,
            [mixapanelProps.MULTIPLIER]: activePositions[0].multiplier,
            [mixapanelProps.TREND]:
              activePositions[0].operation === AskBidEnum.Buy ? 'buy' : 'sell',
            [mixapanelProps.SLTP]: !!(activePositions[0].sl || activePositions[0].tp),
            [mixapanelProps.ACCOUNT_ID]: mainAppStore.activeAccount?.id || '',
            [mixapanelProps.ACCOUNT_TYPE]: mainAppStore.activeAccount?.isLive
              ? 'real'
              : 'demo',
            [mixapanelProps.EVENT_REF]: mixpanelValues.CHART,
          });
        } else {
          mixpanel.track(mixpanelEvents.CLOSE_ORDER_FAILED, {
            [mixapanelProps.AMOUNT]: activePositions[0].investmentAmount,
            [mixapanelProps.ACCOUNT_CURRENCY]:
            mainAppStore.activeAccount?.currency || '',
            [mixapanelProps.INSTRUMENT_ID]: activePositions[0].instrument,
            [mixapanelProps.MULTIPLIER]: activePositions[0].multiplier,
            [mixapanelProps.TREND]:
              activePositions[0].operation === AskBidEnum.Buy ? 'buy' : 'sell',
            [mixapanelProps.SLTP]: !!(activePositions[0].sl || activePositions[0].tp),
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

  const positionsView = () => {
    mixpanel.track(mixpanelEvents.MOBILE_CHART_POSITION_VIEW, {
      [mixapanelProps.INSTRUMENT_ID]: instrumentsStore.activeInstrument?.instrumentItem.id,
      [mixapanelProps.NUMBER_OF_POSITIONS]: activePositions.length,
    });
    toggleViewAll(true);
  };

  const hideAll = () => {
    toggleViewAll(false);
  };

  useEffect(() => {
    let newInvest = 0;
    let newProfit = 0;
    activePositions.forEach((item) => {
      const isBuy = item.operation === AskBidEnum.Buy;
      newInvest += item.investmentAmount;
      newProfit += calculateFloatingProfitAndLoss({
        investment: item.investmentAmount,
        multiplier: item.multiplier,
        costs: item.swap + item.commission,
        side: isBuy ? 1 : -1,
        currentPrice: isBuy
          ? quotesStore.quotes[item.instrument].bid.c
          : quotesStore.quotes[item.instrument].ask.c,
        openPrice: item.openPrice,
      });
    });
    setInvest(newInvest);
    setProfit(newProfit);
  }, [activePositions]);
  
  return (
    <FlexContainer
      justifyContent="space-between"
      padding="10px 16px"
      marginBottom="8px"
      alignItems="center"
    >
      <FlexContainer alignItems="center">
        {activePositions.length === 1
          ? <PositionBadge
              isBuy={activePositions[0].operation === AskBidEnum.Buy}
            >
              <FlexContainer marginRight="6px">
                {activePositions[0].operation === AskBidEnum.Buy
                  ? <SvgIcon {...BuyIcon} width={12} height={12} fillColor="#1C1F26" />
                  : <SvgIcon {...SellIcon} width={12} height={12} fillColor="#ffffff" />}
              </FlexContainer>
              <PrimaryTextSpan
                fontSize="11px"
                fontWeight={800}
                color={activePositions[0].operation === AskBidEnum.Buy
                  ? '#000000'
                  : '#ffffff'
                }
                lineHeight="10px"
              >
                {activePositions[0].operation === AskBidEnum.Buy ? 'Buy' : 'Sell'}
              </PrimaryTextSpan>
            </PositionBadge>
          : <PositionsBadge>{activePositions.length}</PositionsBadge>}
        <Observer>
          {() => (
            <>
              <PrimaryTextSpan
                fontSize="16px"
                fontWeight={700}
                marginRight="7px"
              >
                {mainAppStore.activeAccount?.symbol}
                {invest.toFixed(2)}
              </PrimaryTextSpan>
              <PrimaryTextSpan
                fontSize="16px"
                fontWeight={700}
                marginRight="7px"
                color="#ffffff"
              >
                {t('P/L')}
              </PrimaryTextSpan>
              <PrimaryTextSpan
                fontSize="16px"
                fontWeight={700}
                color={profit >= 0 ? Colors.ACCENT_BLUE : Colors.RED}
              >
                {getNumberSign(profit)}
                {mainAppStore.activeAccount?.symbol}
                {Math.abs(profit).toFixed(2)}
              </PrimaryTextSpan>
            </>
          )}
        </Observer>
      </FlexContainer>
      <Observer>
        {() => <FlexContainer>
          {activePositions.length === 1
            ? <ButtonClose onClick={closePosition}>
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
                    {activePositions[0].instrument}
                  </PrimaryTextSpan>
                  &nbsp; {t('position for')}&nbsp;
                  <PrimaryTextSpan color="#ffffff">
                    <EquityPnL
                      position={activePositions[0]}
                      handlePnL={handleToggleLoadingClosePopup}
                    />
                  </PrimaryTextSpan>
                </ConfirmationPopup>
              )}
            </ButtonClose>
            : <ButtonClose onClick={positionsView}>
              <PrimaryTextSpan
                color="#fff"
                fontSize="13px"
                fontWeight={700}
              >
                {t('View all')}
              </PrimaryTextSpan>
            </ButtonClose>
          }
        </FlexContainer>}
      </Observer>
      {viewAll && <ViewAllWrapper>
        <ActivePositionsList>
          <FlexContainer
              height="50px"
              padding="10px 16px"
          >
              <SvgIcon
                {...CloseIcon}
                width={30}
                height={30}
                fillColor="rgba(196, 196, 196, 0.5)"
                hoverFillColor="#fff"
                onClick={hideAll}
              />
          </FlexContainer>
          <FlexContainer
            overflow="auto"
            flexDirection="column"
            width="100%"
            padding="0 0 50px 0"
          >
            {activePositions.map((position) =>
              <ActiveChartPosition key={position.id} position={position}></ActiveChartPosition>)}
          </FlexContainer>
        </ActivePositionsList>
      </ViewAllWrapper>}
    </FlexContainer>
  );
});

export default ActiveChartOrders;

const PositionBadge = styled(FlexContainer)<{ isBuy: boolean }>`
  background-color: ${(props) =>
  props.isBuy ? Colors.ACCENT_BLUE : Colors.RED};
  border-radius: 4px;
  padding: 3px 8px;
  text-transform: uppercase;
  line-height: 1;
  height: 24px;
  margin-right: 10px;
  justify-content: center;
  align-items: center;
`;

const PositionsBadge = styled(FlexContainer)`
  background-color: #FFFCCC;
  color: #1C1F26;
  font-size: 15px;
  font-weight: 800;
  border-radius: 12px;
  padding-bottom: 2px;
  height: 24px;
  width: 24px;
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

const ViewAllWrapper = styled(FlexContainer)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(18, 21, 28, 0.6);
  align-items: flex-end;
  z-index: 1;
`;

const ActivePositionsList = styled(FlexContainer)`
  border-radius: 25px 25px 0 0;
  background: #1C1F26;
  flex-direction: column;
  width: 100%;
  height: 250px;
  overflow: hidden;
`;
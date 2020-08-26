import React, { useEffect, useState, FC } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import ActivePositionItem from '../Portfolio/ActivePositionItem';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { PositionModelWSDTO } from '../../types/Positions';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import useInstrument from '../../hooks/useInstrument';
import { getNumberSign } from '../../helpers/getNumberSign';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';
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
                {t('Opening time')}
              </PrimaryTextSpan>
              <PrimaryTextSpan fontSize="16px">
                {moment(position.openDate).format('DD MMM, HH:mm:ss')}
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
              <PrimaryTextSpan fontSize="16px">
                {t('at')}{' '}
                {position.openPrice.toFixed(getPressision(position.instrument))}
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

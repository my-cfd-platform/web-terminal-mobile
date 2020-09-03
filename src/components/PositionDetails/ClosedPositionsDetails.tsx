import React, { useEffect, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import ActivePositionItem from '../Portfolio/ActivePositionItem';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { PositionModelWSDTO } from '../../types/Positions';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import useInstrument from '../../hooks/useInstrument';
import { getNumberSign } from '../../helpers/getNumberSign';
import { useStores } from '../../hooks/useStores';
import { Observer } from 'mobx-react-lite';
import { PositionHistoryDTO } from '../../types/HistoryReportTypes';
import InstrumentMarkets from '../Markets/InstrumentMarkets';
import styled from '@emotion/styled';
import { AskBidEnum } from '../../enums/AskBid';
import Colors from '../../constants/Colors';
import closingReasonText from '../../constants/ClosingReasonText';

interface Props {
  positionId: number;
}
const ClosedPositionsDetails = (props: Props) => {
  const { positionId } = props;
  const { t } = useTranslation();
  const { getPressision } = useInstrument();
  const {
    mainAppStore,
    instrumentsStore,
    quotesStore,
    historyStore,
  } = useStores();

  const [position, setPosition] = useState<PositionHistoryDTO>();

  useEffect(() => {
    if (positionId === historyStore.activeHistoryItem?.id) {
      setPosition(historyStore.activeHistoryItem);
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
          <Observer>
            {() => (
              <>
                {
                  <InstrumentMarkets
                    instrument={
                      instrumentsStore.instruments.find(
                        (item) => item.instrumentItem.id === position.instrument
                      )?.instrumentItem ||
                      instrumentsStore.instruments[0].instrumentItem
                    }
                  />
                }
              </>
            )}
          </Observer>

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
            {moment(position.openDate).format('HH:mm, DD MMM YYYY')}
            </PrimaryTextSpan>
          </FlexContainer>

          <FlexContainer
            width="100%"
            padding="8px 16px"
            justifyContent="space-between"
          >
            <PrimaryTextSpan color="#fff" fontSize="16px">
              {t('Closing time')}
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
                {t('Closing Price')}
              </PrimaryTextSpan>

              <PrimaryTextSpan fontSize="16px">
                  {position.closePrice.toFixed(
                    getPressision(position.instrument)
                  )}
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
              {t('Overnight Fee')}
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
              {t('Closing Reason')}
            </PrimaryTextSpan>
            <PrimaryTextSpan fontSize="16px">
              {closingReasonText[position.closeReason]}
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
};

export default ClosedPositionsDetails;


const QuoteTextLabel = styled(FlexContainer)<{ operation?: number }>`
  background-color: ${(props) =>
    props.operation === AskBidEnum.Buy ? Colors.ACCENT_BLUE : Colors.RED};
  border-radius: 4px;
  padding: 4px 16px;
  font-size: 13px;
`;
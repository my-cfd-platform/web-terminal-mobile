import React, { useEffect, useState } from 'react';
import BackFlowLayout from '../components/BackFlowLayout';
import { useParams } from 'react-router-dom';
import { useStores } from '../hooks/useStores';
import { PositionModelWSDTO } from '../types/Positions';
import { Observer } from 'mobx-react-lite';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import ActivePositionItem from '../components/Portfolio/ActivePositionItem';

import moment from 'moment';
import useInstrument from '../hooks/useInstrument';
import { useTranslation } from 'react-i18next';
import { getNumberSign } from '../helpers/getNumberSign';

const PositionDetails = () => {
  const { id } = useParams();

  const { t } = useTranslation();
  const { mainAppStore, quotesStore } = useStores();
  const [position, setPosition] = useState<PositionModelWSDTO>();

  const { getPressision } = useInstrument();

  useEffect(() => {
    const positionById = quotesStore?.activePositions?.find(
      (item) => item.id === +id
    );
    positionById && setPosition(positionById);
  }, [id]);

  return (
    <BackFlowLayout pageTitle="Position Details">
      <Observer>
        {() => (
          <>
            {position && (
              <FlexContainer
                flexDirection="column"
                maxHeight="100%"
                overflow="auto"
                width="100%"
              >
                <ActivePositionItem
                  position={position}
                  backgroundColor="transparent"
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
                    {position.openPrice.toFixed(
                      +getPressision(position.instrument)
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
                  <PrimaryTextSpan fontSize="16px">
                    {position.id}
                  </PrimaryTextSpan>
                </FlexContainer>
              </FlexContainer>
            )}
          </>
        )}
      </Observer>
    </BackFlowLayout>
  );
};

export default PositionDetails;

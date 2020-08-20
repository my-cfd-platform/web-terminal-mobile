import React, { FC } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { InstrumentModelWSDTO } from '../../types/InstrumentsTypes';
import ImageContainer from '../ImageContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { useStores } from '../../hooks/useStores';

interface Props {
  instrumentId: InstrumentModelWSDTO['id'];
  instrumentName: InstrumentModelWSDTO['name'];
  isActive: boolean;
}

const InstrumentBadge: FC<Props> = ({
  instrumentId,
  instrumentName,
  isActive,
}) => {
  const { instrumentsStore } = useStores();
  const handleSwitchInstrument = () => {
    instrumentsStore.switchInstrument(instrumentId);
  };
  return (
    <FlexContainer
      flexDirection="column"
      opacity={isActive ? '1' : '0.3'}
      alignItems="center"
      onClick={handleSwitchInstrument}
    >
      <FlexContainer width="48px" height="48px" marginBottom="8px">
        <ImageContainer instrumentId={instrumentId} />
      </FlexContainer>
      <PrimaryTextSpan fontSize="8px" color="#FFFFFF">
        {instrumentName}
      </PrimaryTextSpan>
    </FlexContainer>
  );
};

export default InstrumentBadge;

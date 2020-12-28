import React, { FC } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { InstrumentModelWSDTO } from '../../types/InstrumentsTypes';
import ImageContainer from '../ImageContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { useStores } from '../../hooks/useStores';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import IconClose from '../../assets/svg_no_compress/icon-close-btn.svg';
import SvgIcon from '../SvgIcon';

interface Props {
  instrumentId: InstrumentModelWSDTO['id'];
  instrumentName: InstrumentModelWSDTO['name'];
  isActive: boolean;
  removable: boolean;
  onRemove: () => void;
}

const InstrumentBadge: FC<Props> = ({
  instrumentId,
  instrumentName,
  isActive,
  removable,
  onRemove,
}) => {
  const { instrumentsStore } = useStores();
  const handleSwitchInstrument = () => {
    instrumentsStore.switchInstrument(instrumentId);
  };
  const handleRemoveInstrument = () => {
    onRemove();
  };
  return (
    <FlexContainer
      flexDirection="column"
      opacity={isActive ? '1' : '0.3'}
      alignItems="center"
      onClick={handleSwitchInstrument}
    >
      <FlexContainer
        width="48px"
        height="48px"
        marginBottom="8px"
        position="relative"
      >
        <ImageContainer instrumentId={instrumentId} />
        {removable && (
          <InstumentCloseButton onClick={handleRemoveInstrument}>
            <SvgIcon {...IconClose} />
          </InstumentCloseButton>
        )}
      </FlexContainer>
      <PrimaryTextSpan
        fontSize="8px"
        color="#FFFFFF"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
        maxWidth="48px"
      >
        {instrumentName}
      </PrimaryTextSpan>
    </FlexContainer>
  );
};

export default InstrumentBadge;

const InstumentCloseButton = styled(ButtonWithoutStyles)`
  width: 24px;
  height: 24px;
  border: 3px solid #1c1f26;
  background-color: #979797;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: -6px;
  right: -8px;
  z-index: 1;
`;

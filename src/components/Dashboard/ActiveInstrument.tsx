import React, { FC } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import IconStar from '../../assets/svg/icon-favourite.svg';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';

const ActiveInstrument: FC = observer(() => {
  const { instrumentsStore } = useStores();
  const handleCheckFavourite = () => {};
  return (
    <FlexContainer
      justifyContent="space-between"
      padding="0 16px"
      marginBottom="8px"
    >
      <FlexContainer flexDirection="column">
        <PrimaryTextSpan fontSize="16px" color="#fff" marginBottom="2px">
          {instrumentsStore.activeInstrument?.instrumentItem.name}
        </PrimaryTextSpan>
        <PrimaryTextSpan fontSize="13px" color="rgba(196, 196, 196, 0.5)">
          {instrumentsStore.activeInstrument?.instrumentItem.groupId}
        </PrimaryTextSpan>
      </FlexContainer>
      <FlexContainer>
        <ButtonWithoutStyles onClick={handleCheckFavourite}>
          <SvgIcon
            {...IconStar}
            width={16}
            height={16}
            fillColor="rgba(196, 196, 196, 0.5)"
          />
        </ButtonWithoutStyles>
      </FlexContainer>
    </FlexContainer>
  );
});

export default ActiveInstrument;

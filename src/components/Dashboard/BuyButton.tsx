import React, { FC } from 'react';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import styled from '@emotion/styled';
import Colors from '../../constants/Colors';
import { FlexContainer } from '../../styles/FlexContainer';
import SvgIcon from '../SvgIcon';
import BuyIcon from '../../assets/svg/icon-buy.svg';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';

interface Props {
  handleClick: () => void;
}

const BuyButton: FC<Props> = observer(({ handleClick }) => {
  const { t } = useTranslation();

  const { quotesStore, instrumentsStore } = useStores();

  return (
    <BuyButtonWrapper onClick={handleClick}>
      <FlexContainer marginRight="16px">
        <SvgIcon {...BuyIcon} width={24} height={20} fillColor="#232830" />
      </FlexContainer>
      <FlexContainer flexDirection="column" alignItems="flex-start">
        <PrimaryTextSpan
          fontSize="13px"
          fontWeight="bold"
          color="#232830"
          marginBottom="2px"
          textAlign="left"
        >
          {t('Buy')}
        </PrimaryTextSpan>
        {(instrumentsStore.activeInstrument &&
          quotesStore.quotes[instrumentsStore.activeInstrument.instrumentItem.id])
        && (
          <PrimaryTextSpan fontSize="13px" color="#232830">
            {
              quotesStore.quotes[
                instrumentsStore.activeInstrument.instrumentItem.id
              ].ask.c.toFixed(instrumentsStore.activeInstrument.instrumentItem.digits)
            }
          </PrimaryTextSpan>
        )}
      </FlexContainer>
    </BuyButtonWrapper>
  );
});

export default BuyButton;

const BuyButtonWrapper = styled(ButtonWithoutStyles)`
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 10px;
  background-color: ${Colors.ACCENT_BLUE};
  padding: 8px 16px;
`;

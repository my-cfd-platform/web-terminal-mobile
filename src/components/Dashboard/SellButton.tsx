import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks/useStores';
import { FlexContainer } from '../../styles/FlexContainer';
import SvgIcon from '../SvgIcon';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import SellIcon from '../../assets/svg/icon-sell.svg';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import Colors from '../../constants/Colors';
import { observer } from 'mobx-react-lite';

interface Props {
  handleClick: () => void;
}

const SellButton: FC<Props> = observer(({ handleClick }) => {
  const { t } = useTranslation();

  const { quotesStore, instrumentsStore } = useStores();

  return (
    <BuyButtonWrapper onClick={handleClick}>
      <FlexContainer marginRight="16px">
        <SvgIcon {...SellIcon} width={24} height={20} fillColor="#fff" />
      </FlexContainer>
      <FlexContainer flexDirection="column">
        <PrimaryTextSpan
          fontSize="16px"
          fontWeight="bold"
          color="#fff"
          textAlign="left"
          marginBottom="2px"
        >
          {t('Sell')}
        </PrimaryTextSpan>
        {(instrumentsStore.activeInstrument &&
          quotesStore.quotes[instrumentsStore.activeInstrument.instrumentItem.id])
        && (
          <PrimaryTextSpan fontSize="13px" color="#fff">
            {
              quotesStore.quotes[
                instrumentsStore.activeInstrument.instrumentItem.id
              ].bid.c.toFixed(instrumentsStore.activeInstrument.instrumentItem.digits)
            }
          </PrimaryTextSpan>
        )}
      </FlexContainer>
    </BuyButtonWrapper>
  );
});

export default SellButton;

const BuyButtonWrapper = styled(ButtonWithoutStyles)`
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 10px;
  background-color: ${Colors.RED};
  padding: 8px 16px;
  margin-right: 8px;
`;

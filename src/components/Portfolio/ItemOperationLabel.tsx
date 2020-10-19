import styled from '@emotion/styled';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Colors from '../../constants/Colors';
import { AskBidEnum } from '../../enums/AskBid';
interface Props {
  operation: AskBidEnum;
}

const ItemOperationLabel = ({operation}: Props) => {
  const {t} = useTranslation();
  return (
    <Label isBuy={operation === AskBidEnum.Buy}>
      {t(operation === AskBidEnum.Buy ? 'buy' : 'sell')}
    </Label>
  );
};

export default ItemOperationLabel;

const Label = styled.span<{isBuy: boolean}>`
  background-color: ${(props) =>
    props.isBuy ? Colors.ACCENT_BLUE : Colors.RED};
  color: ${(props) => (props.isBuy ? '#000000' : '#ffffff')};
  font-size: 8px;
  font-weight: 800;
  border-radius: 4px;
  padding: 2px;
  text-transform: uppercase;
  line-height: 1;
  width: 32px;
  height: 12px;
  margin-left: 8px;
  text-align: center;
`;
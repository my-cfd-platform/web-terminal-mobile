import React, { FC } from 'react';
import { PositionModelWSDTO } from '../../types/Positions';
import { PendingOrderWSDTO } from '../../types/PendingOrdersTypes';

interface Props {
  pendingOrder: PendingOrderWSDTO;
  currencySymbol: string;
}

const PendingOrderItem: FC<Props> = ({ pendingOrder }) => {
  return (
    <div>
      {pendingOrder.instrument}
    </div>
  );
};

export default PendingOrderItem;
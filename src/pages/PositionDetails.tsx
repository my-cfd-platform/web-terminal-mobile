import React, { useCallback } from 'react';
import BackFlowLayout from '../components/BackFlowLayout';
import { useParams } from 'react-router-dom';
import { PortfolioTabEnum } from '../enums/PortfolioTabEnum';
import ActivePositionsDetails from '../components/PositionDetails/ActivePositionsDetails';
import ClosedPositionsDetails from '../components/PositionDetails/ClosedPositionsDetails';
import PendingPositionsDetails from '../components/PositionDetails/PendingPositionsDetails';


const PositionDetails = () => {
  const { id, type } = useParams();

  const renderByType = useCallback(() => {
    switch (type) {
      case PortfolioTabEnum.CLOSED:
        return <ClosedPositionsDetails positionId={+id} />;
      case PortfolioTabEnum.PENDING:
        return <PendingPositionsDetails positionId={+id} />;
      default:
        return <ActivePositionsDetails positionId={+id} />;
    }
  }, [type]);

  return (
    <BackFlowLayout pageTitle="Position Details">
      {renderByType()}
    </BackFlowLayout>
  );
};

export default PositionDetails;

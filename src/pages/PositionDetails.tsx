import React, { useCallback } from 'react';
import BackFlowLayout from '../components/BackFlowLayout';
import { useParams } from 'react-router-dom';
import { PortfolioTabEnum } from '../enums/PortfolioTabEnum';
import ActivePositionsDetails from '../components/PositionDetails/ActivePositionsDetails';
import ClosedPositionsDetails from '../components/PositionDetails/ClosedPositionsDetails';
import PendingPositionsDetails from '../components/PositionDetails/PendingPositionsDetails';
import { useTranslation } from 'react-i18next';

const PositionDetails = () => {
  const { id, type } = useParams<{ id: string; type: string }>();
  const { t } = useTranslation();

  const renderByType = useCallback(() => {
    switch (type) {
      case PortfolioTabEnum.ACTIVE:
        return <ActivePositionsDetails positionId={+id} />;

      case PortfolioTabEnum.CLOSED:
        return <ClosedPositionsDetails positionId={+id} />;

      case PortfolioTabEnum.PENDING:
        return <PendingPositionsDetails positionId={+id} />;

      default:
        return <ActivePositionsDetails positionId={+id} />;
    }
  }, [type]);

  return (
    <BackFlowLayout pageTitle={t('Position Details')}>
      {renderByType()}
    </BackFlowLayout>
  );
};

export default PositionDetails;

import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { BalanceHistoryDTO } from '../types/HistoryReportTypes';
import moment from 'moment';
import { useStores } from '../hooks/useStores';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';

interface BalanceHistoryItemProps {
  isActive?: boolean;
  item: BalanceHistoryDTO;
  handleClick: (id: number) => void;
}

const BalanceHistoryItem = ({
  isActive,
  item,
  handleClick,
}: BalanceHistoryItemProps) => {
  const { mainAppStore } = useStores();
  const { t } = useTranslation();
  const onClick = () => {
    handleClick(item.createdAt);
  };
  return (
    <FlexContainer
      onClick={onClick}
      width="100vw"
      backgroundColor="rgba(42, 45, 56, 0.5)"
      marginBottom="2px"
      padding="16px 16px"
      justifyContent={isActive ? "center" : "space-between"}
      flexDirection={isActive ? 'column' : 'row'}
      
      flexWrap="wrap"
      alignItems="center"
      minHeight="max-content"
    >
      <FlexContainer
        flexDirection="column"
        padding="0 16px 0 0"
        width={isActive ? '100%' : '70%'}
        overflow="hidden"
        marginBottom={isActive ? '16px' : '0'}
        position="relative"
      >
        {!isActive && <GradientFilter />}
        <PrimaryTextSpan
          color="#ffffff"
          fontSize="16px"
          whiteSpace={isActive ? 'normal' : 'nowrap'}
          marginBottom="4px"
        >
          {item.description}
        </PrimaryTextSpan>

        <PrimaryTextSpan color="rgba(255, 255, 255, 0.4)" fontSize="13px">
          {moment(item.createdAt).format('DD MMM YYYY, HH:mm')}
        </PrimaryTextSpan>
      </FlexContainer>

      <FlexContainer
        flexDirection="column"
        justifyContent="flex-end"
        alignItems={isActive ? 'flex-start' : 'flex-end'}
        width={isActive ? '100%' : '30%'}
        position="relative"
        zIndex="3"
      >
        <PrimaryTextSpan
          color="#fffccc"
          fontSize="16px"
          fontWeight={500}
          marginBottom="4px"
        >
          {item.amount < 0 ? '-' : '+'}
          {mainAppStore.accounts.find((acc) => acc.isLive)?.symbol}
          {Math.abs(item.amount).toFixed(2)}
        </PrimaryTextSpan>
        <PrimaryTextSpan color="rgba(255, 255, 255, 0.4)" fontSize="13px">
          {t('Amount')}
        </PrimaryTextSpan>
      </FlexContainer>
    </FlexContainer>
  );
};

export default BalanceHistoryItem;

const GradientFilter = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 100%;
  background: linear-gradient(
    90deg,
    #23262f 55.65%,
    rgba(35, 38, 47, 0.4) 97.58%
  );
  transform: translateX(-50%) rotate(180deg);
  height: 100%;
  width: 154px;
`;

import React from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import Colors from '../../constants/Colors';

const AccountLabel = observer(() => {
  const { mainAppStore } = useStores();
  const { t } = useTranslation();
  return (
    <FlexContainer
      position="absolute"
      left="16px"
      top="12px"
      alignItems="center"
      justifyContent="center"
    >
      <FlexContainer flex="1" justifyContent="flex-end">
        <AccountBadge
          badgeColor={
            mainAppStore.activeAccount?.isLive ? Colors.ACCENT : '#fff'
          }
        >
          {mainAppStore.activeAccount?.isLive ? t('Live') : t('Demo')}
        </AccountBadge>
      </FlexContainer>
    </FlexContainer>
  );
});

export default AccountLabel;

const AccountBadge = styled.span<{ badgeColor?: string }>`
  font-size: 13px;
  font-weight: bold;
  background-color: ${props => props.badgeColor};
  border-radius: 4px;
  padding: 4px 8px;
  text-transform: uppercase;
  color: #1C1C1E;
  width: 64px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

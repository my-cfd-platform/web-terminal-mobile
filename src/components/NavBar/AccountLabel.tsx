import React from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

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
      {!mainAppStore.activeAccount?.isLive && (
        <FlexContainer flex="1" justifyContent="flex-end">
          <AccountBadge>{t('Demo')}</AccountBadge>
        </FlexContainer>
      )}
    </FlexContainer>
  );
});

export default AccountLabel;

const AccountBadge = styled.span`
  font-size: 13px;
  font-weight: bold;
  background-color: #fff;
  border-radius: 4px;
  padding: 4px 8px;
  text-transform: uppercase;
  color: #1c1c1e;
  width: 64px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

import React from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { PrimaryTextSpan } from '../../styles/TextsElements';

const AccountLabel = observer(() => {
  const { mainAppStore } = useStores();
  const { t } = useTranslation();
  return (
    <FlexContainer alignItems="center" justifyContent="center">
      <PrimaryTextSpan
        color="rgba(255, 255, 255, 0.4)"
        fontWeight={500}
        fontSize="14px"
        lineHeight="18px"
        textTransform="uppercase"
        marginRight="14px"
      >
        {mainAppStore.activeAccount?.isLive ? 'Real' : 'Demo'}
      </PrimaryTextSpan>
    </FlexContainer>
  );
});

export default AccountLabel;

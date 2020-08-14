import React from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import { useStores } from '../../hooks/useStores';
import { PrimaryTextSpan } from '../../styles/TextsElements';

const AccountLabel = () => {
  const {mainAppStore } = useStores();
  return (
    <>
      {!mainAppStore.activeAccount?.isLive && (
        <LabelWrap
          height="24px"
          borderRadius="4px"
          backgroundColor="#ffffff"
          position="absolute"
          left="16px"
          top="12px"
          alignItems="center"
          justifyContent="center"
          padding="4px 12px"
        >
          <PrimaryTextSpan
            fontSize="13px"
            fontWeight="bold"
            color="#000000"
            textTransform="uppercase"
            lineHeight="1"
          >
            Demo
          </PrimaryTextSpan>
        </LabelWrap>
      )}
    </>
    
  );
};

export default AccountLabel;

const LabelWrap = styled(FlexContainer)`

`;
import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import SearchPanel from '../components/SearchPanel';

const Markets = () => {
  return (
    <DashboardLayout>
      <FlexContainer flexDirection="column" width="100vw">
        <FlexContainer padding="20px 0 32px">
          <FlexContainer padding="0 16px" alignItems="center" justifyContent="space-between" position="relative" width="100%">

            <PrimaryTextSpan color="#ffffff" fontWeight={600} fontSize="24px">
              Markets
            </PrimaryTextSpan>

            <SearchPanel position="absolute" />

          </FlexContainer>
        </FlexContainer>

        <FlexContainer>body</FlexContainer>
      </FlexContainer>
    </DashboardLayout>
  );
};

export default Markets;

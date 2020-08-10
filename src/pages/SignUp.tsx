import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import SignFlowLayout from '../components/SignFlowLayout';
import SignTypeTabs from '../components/SignTypeTabs';

const SignUp = () => {
  return (
    <SignFlowLayout>
      <FlexContainer
        flexDirection="column"
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        minHeight="calc(100vh - 100px)"
        maxHeight="calc(100vh - 100px)"
      >
        <FlexContainer flexDirection="column" alignItems="center" width="100%">
          <SignTypeTabs />
          form
        </FlexContainer>
        <FlexContainer>button</FlexContainer>
      </FlexContainer>
    </SignFlowLayout>
  );
};

export default SignUp;

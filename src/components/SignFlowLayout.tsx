import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import Logo from './Logo';
import { useStores } from '../hooks/useStores';
import { useTranslation } from 'react-i18next';
import { Observer } from 'mobx-react-lite';
import LogoMonfex from '../assets/images/logo.png';

interface Props {}

const SignFlowLayout: FC<Props> = (props) => {
  const { children } = props;
  const { mainAppStore } = useStores();

  return (
    <WrapperLayoutFix
      flexDirection="column"
      alignItems="center"
      height="100%"
      width="100vw"
      position="relative"
    >
      <FlexContainer
        justifyContent="center"
        alignItems="center"
        padding="30px 0"
        minHeight="100px"
      >
        <FlexContainer width="230px">
          <Observer>
            {() => <Logo src={mainAppStore.initModel.logo || LogoMonfex} />}
          </Observer>
        </FlexContainer>
      </FlexContainer>
      <FlexContainer flexDirection="column" height="100%">
        {children}
      </FlexContainer>
    </WrapperLayoutFix>
  );
};

export default SignFlowLayout;

const ButtonAppleStore = styled(Link)`
  width: 120px;
  margin-right: 24px;
`;

const ButtonGoogleStore = styled(Link)`
  width: 134px;
`;

const ButtonImage = styled.img`
  width: 100%;
  overflow: hidden;
  border: 1px solid #a6a6a6;
  border-radius: 10px;
`;

const LinkItem = styled.a`
  margin-right: 24px;
  text-decoration: none;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  :last-of-type {
    margin-right: 0;
  }
  :hover {
    color: #00ffdd;
  }
`;

const WrapperLayoutFix = styled(FlexContainer)`
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
`;

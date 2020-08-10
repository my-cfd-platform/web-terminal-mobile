import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import ButtonAppleStoreImage from '../assets/images/button-apple-store.png';
import ButtonGoogleStoreImage from '../assets/images/button-google-store.png';
import Logo from './Logo';
import { useStores } from '../hooks/useStores';
import { useTranslation } from 'react-i18next';
import { Observer } from 'mobx-react-lite';
import LogoMonfex from '../assets/images/logo.png';

interface Props {}

const SignFlowLayout: FC<Props> = props => {
  const { children } = props;
  const { mainAppStore } = useStores();
  const { t } = useTranslation();

  return (
    <FlexContainer
      flexDirection="column"
      alignItems="center"
      justifyContent="space-between"
      width="100vw"
      height="100vh"
      position="relative"
    >
      <FlexContainer flexDirection="column" width="100vw">
        <FlexContainer justifyContent="center" alignItems="center" padding="30px 0" minHeight="100px">
          <FlexContainer width="230px">
            <Observer>
              {() => <Logo src={mainAppStore.initModel.logo || LogoMonfex} />}
            </Observer>
          </FlexContainer>
        </FlexContainer>

        <FlexContainer flexDirection="column">{children}</FlexContainer>
      </FlexContainer>

      
    </FlexContainer>
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

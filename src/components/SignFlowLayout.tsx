import React, { FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import Logo from './Logo';
import { useStores } from '../hooks/useStores';
import { Observer } from 'mobx-react-lite';
import LogoMonfex from '../assets/images/logo.png';
import NetworkErrorPopup from './NetworkErrorPopup';
import NotificationPopup from './NotificationPopup';
import ServerErrorPopup from './ServerErrorPopup';

interface Props {}

const SignFlowLayout: FC<Props> = (props) => {
  const { children } = props;
  const { mainAppStore, serverErrorPopupStore } = useStores();

  return (
    <FlexContainer
      flexDirection="column"
      alignItems="center"
      height="100%"
      width="100vw"
      position="relative"
    >
      <Observer>{() => <NetworkErrorPopup />}</Observer>
      <Observer>
        {() => <>{serverErrorPopupStore.isActive && <ServerErrorPopup />}</>}
      </Observer>
      <Observer>{() => <NotificationPopup></NotificationPopup>}</Observer>
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
    </FlexContainer>
  );
};

export default SignFlowLayout;

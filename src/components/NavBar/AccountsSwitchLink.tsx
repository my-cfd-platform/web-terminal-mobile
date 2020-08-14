import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import Page from '../../constants/Pages';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import Colors from '../../constants/Colors';
import { useStores } from '../../hooks/useStores';
import { Observer } from 'mobx-react-lite';
import DropDownArrov from '../../assets/svg/icon-dropdown.svg';
import SvgIcon from '../SvgIcon';

const AccountsSwitchLink = () => {
  const { mainAppStore } = useStores();
  return (
    <AccountSwitch to={Page.ACCOUNTS_SWITCH}>
      <Observer>
        {() => (
          <PrimaryTextSpan
            color={mainAppStore.activeAccount?.isLive ? Colors.ACCENT : "#ffffff"}
            fontSize="16px"
            fontWeight="bold"
            marginRight="8px"
            lineHeight="1"
          >
            {mainAppStore.activeAccount?.symbol}
            {mainAppStore.activeAccount?.balance.toFixed(2)}
          </PrimaryTextSpan>
        )}
      </Observer>
      <SvgIcon {...DropDownArrov} fillColor="rgba(255, 255, 255, 0.4)" />
    </AccountSwitch>
  );
};

export default AccountsSwitchLink;

const AccountSwitch = styled(Link)``;

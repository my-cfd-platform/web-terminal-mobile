import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import Page from '../../constants/Pages';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import Colors from '../../constants/Colors';
import { useStores } from '../../hooks/useStores';
import { Observer, observer } from 'mobx-react-lite';
import DropDownArrov from '../../assets/svg/icon-dropdown.svg';
import SvgIcon from '../SvgIcon';

const AccountsSwitchLink = observer(() => {
  const { mainAppStore } = useStores();
  const [balance, setBalance] = useState<number>(mainAppStore.balanceWas);

  const animateValue = (start: number, end: number) => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / 2000, 1);
      setBalance((progress * (end - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
    mainAppStore.balanceWas = end;
  };

  useEffect(() => {
    if (mainAppStore.accounts) {
      const newBalance = mainAppStore.accounts.find(
        (item) => item.id === mainAppStore.activeAccountId
      )?.balance || balance;
      if (newBalance !== balance && balance !== 0) {
        animateValue(
          balance,
          newBalance
        );
      } else if (balance === 0) {
        mainAppStore.balanceWas = newBalance;
        setBalance(newBalance);
      }
    }
  }, [
    mainAppStore.activeAccountId,
    mainAppStore.accounts
  ]);

  return (
    <AccountSwitch to={!mainAppStore.isPromoAccount ? Page.ACCOUNTS_SWITCH : Page.DASHBOARD}>
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
            {balance.toFixed(2)}
          </PrimaryTextSpan>
        )}
      </Observer>
      {!mainAppStore.isPromoAccount && <SvgIcon {...DropDownArrov} fillColor="rgba(255, 255, 255, 0.4)"/>}
    </AccountSwitch>
  );
});

export default AccountsSwitchLink;

const AccountSwitch = styled(Link)`
  margin-left: 16px;
  text-decoration: none;
  transition: all .4s ease;
  &:hover {
    text-decoration: none;
  }
`;

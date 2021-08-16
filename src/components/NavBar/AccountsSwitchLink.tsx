import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import Colors from '../../constants/Colors';
import { useStores } from '../../hooks/useStores';
import { Observer, observer } from 'mobx-react-lite';
import DropDownArrov from '../../assets/svg/icon-dropdown.svg';
import SvgIcon from '../SvgIcon';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { moneyFormat, moneyFormatPart } from '../../helpers/moneyFormat';
import {
  getNumberSign,
  getNumberSignNegative,
} from '../../helpers/getNumberSign';

const AccountsSwitchLink = observer(() => {
  const { mainAppStore } = useStores();
  const [balance, setBalance] = useState<number>(mainAppStore.balanceWas);
  const [closedComponent, setClosedComponent] = useState<boolean>(false);

  const animateValue = (start: number, end: number) => {
    if (!closedComponent) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / 2000, 1);
        setBalance(progress * (end - start) + start);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
      mainAppStore.balanceWas = end;
    }
  };

  const handleOpenAccounts = () => () => {
    mainAppStore.openAccountSwitcher();
  };

  useEffect(() => {
    let cleanupFunction = false;
    if (mainAppStore.accounts) {
      const newBalance =
        mainAppStore.accounts.find(
          (item) => item.id === mainAppStore.activeAccountId
        )?.balance || 0;
      if (!cleanupFunction) {
        if (newBalance !== balance && balance !== 0) {
          animateValue(balance, newBalance);
        } else {
          mainAppStore.balanceWas = newBalance;
          setBalance(newBalance);
        }
      }
    }
    return () => {
      cleanupFunction = true;
    };
  }, [mainAppStore.activeAccountId, mainAppStore.accounts]);

  useEffect(() => {
    return () => {
      setClosedComponent(true);
    };
  }, []);

  return (
    <AccountSwitch onClick={handleOpenAccounts()}>
      <Observer>
        {() => (
          <PrimaryTextSpan
            color="#FFFCCC"
            fontSize="16px"
            fontWeight="bold"
            marginRight="8px"
            lineHeight="1"
          >
            {getNumberSignNegative(balance)}
            {mainAppStore.activeAccount?.symbol}
            {moneyFormatPart(Math.abs(balance)).int}

            <PrimaryTextSpan
              color="#FFFCCC"
              fontSize="12px"
              fontWeight="bold"
              lineHeight="1"
            >
              .{moneyFormatPart(Math.abs(balance)).decimal}
            </PrimaryTextSpan>
          </PrimaryTextSpan>
        )}
      </Observer>
      <SvgIcon {...DropDownArrov} fillColor="rgba(255, 255, 255, 0.4)" />
    </AccountSwitch>
  );
});

export default AccountsSwitchLink;

const AccountSwitch = styled(ButtonWithoutStyles)`
  text-decoration: none;
  transition: all 0.4s ease;
  &:hover {
    text-decoration: none;
  }
`;

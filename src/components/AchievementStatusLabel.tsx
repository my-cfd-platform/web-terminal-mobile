import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import AchievementStatus from '../constants/achievementStatus';
import { useStores } from '../hooks/useStores';
import { FlexContainer } from '../styles/FlexContainer';

import BasicIMG from '../assets/images/achievement_status_bg/new/basic.png';
import SilverIMG from '../assets/images/achievement_status_bg/new/silver.png';
import GoldIMG from '../assets/images/achievement_status_bg/new/gold.png';
import PlatinumIMG from '../assets/images/achievement_status_bg/new/platinum.png';
import DiamondIMG from '../assets/images/achievement_status_bg/new/diamond.png';
import VipIMG from '../assets/images/achievement_status_bg/new/vip.png';
// import UltraIMG from '../assets/images/achievement_status_bg/new/ultra.png';

import { AccountStatusEnum } from '../enums/AccountStatusEnum';

const AchievementStatusLabel = observer(() => {
  const { userProfileStore } = useStores();

  const labelImage = useCallback(() => {
    const key = userProfileStore.statusTypes?.find(
      (status) => status.id === userProfileStore.currentAccountTypeId
    )?.type;

    switch (key) {
      case AccountStatusEnum.GOLD:
        return GoldIMG;
      case AccountStatusEnum.SILVER:
        return SilverIMG;
      case AccountStatusEnum.VIP:
        return VipIMG;
      case AccountStatusEnum.PLATINUM:
        return PlatinumIMG;
      case AccountStatusEnum.DIAMOND:
        return DiamondIMG;

      default:
        return BasicIMG;
    }
  }, [userProfileStore.currentAccountTypeId]);

  if (!userProfileStore.currentAccountTypeId || !userProfileStore.statusTypes) {
    return null;
  }

  return (
    <Wrap width="100%" justifyContent="center" alignItems="center">
      <Label
        width="124px"
        height="24px"
        borderRadius="0 0 12px 12px"
        alignItems="center"
        justifyContent="center"
      >
        <img src={labelImage()} width="123px" height="24px" />
      </Label>
    </Wrap>
  );
});

export default AchievementStatusLabel;

const Wrap = styled(FlexContainer)`
  border-top: 1px solid rgba(169, 171, 173, 0.1);
`;

const Label = styled(FlexContainer)`
  border: 1px solid rgba(169, 171, 173, 0.1);
  border-top: 0;
  background-repeat: no-repeat;
  background-size: cover;
`;

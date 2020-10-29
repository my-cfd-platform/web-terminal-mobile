import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import AchievementStatus from '../constants/achievementStatus';
import { useStores } from '../hooks/useStores';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';

import SilverBG from '../assets/images/achievement_status_bg/silver.png';
import GoldBG from '../assets/images/achievement_status_bg/gold.png';
import PlatinumBG from '../assets/images/achievement_status_bg/platinum.png';

const listStatus = [
  AchievementStatus.SILVER,
  AchievementStatus.GOLD,
  AchievementStatus.PLATINUM,
];

const AchievementStatusLabel = observer(() => {
  const { mainAppStore } = useStores();

  const labelBackground = useCallback(() => {
    const key = mainAppStore.activeAccount?.achievementStatus;
    switch (key) {
      case AchievementStatus.SILVER:
        return SilverBG;
      case AchievementStatus.GOLD:
        return GoldBG;
      case AchievementStatus.PLATINUM:
        return PlatinumBG;
      default:
        return SilverBG;
    }
  }, [mainAppStore.accounts]);

  const labelColor = useCallback(() => {
    const key = mainAppStore.activeAccount?.achievementStatus;
    switch (key) {
      case AchievementStatus.SILVER:
        return '#C5DDF1';
      case AchievementStatus.GOLD:
        return '#FFFCCC';
      case AchievementStatus.PLATINUM:
        return '#00FFDD';
      default:
        return '#ffffff';
    }
  }, [mainAppStore.accounts]);

  if (
    !mainAppStore.activeAccount?.achievementStatus ||
    !listStatus.includes(mainAppStore.activeAccount?.achievementStatus)
  ) {
    return null;
  }

  return (
    <Wrap width="100%" justifyContent="center" alignItems="center">
      <Label
        width="124px"
        padding="5px"
        borderRadius="0 0 12px 12px"
        alignItems="center"
        justifyContent="center"
        backgroundImage={`url(${labelBackground()})`}
      >
        <PrimaryTextSpan
          color={labelColor()}
          fontSize="12px"
          lineHeight="1"
          textTransform="uppercase"
        >
          {mainAppStore.activeAccount?.achievementStatus}
        </PrimaryTextSpan>
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
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
import UltraBG from '../assets/images/achievement_status_bg/ultra.png';

const listStatus = [
  AchievementStatus.SILVER,
  AchievementStatus.GOLD,
  AchievementStatus.PLATINUM,
];

const AchievementStatusLabel = observer(() => {
  const { mainAppStore } = useStores();

  const labelBackground = useCallback(() => {
    const key = mainAppStore.accounts.find((acc) => acc.isLive)?.achievementStatus;
    switch (key) {
      case AchievementStatus.SILVER:
        return SilverBG;
      case AchievementStatus.GOLD:
        return GoldBG;
      case AchievementStatus.PLATINUM:
        // return PlatinumBG;
        return UltraBG;
      default:
        return SilverBG;
    }
  }, [mainAppStore.accounts]);

  const labelColor = useCallback(() => {
    const key = mainAppStore.accounts.find((acc) => acc.isLive)?.achievementStatus;
    switch (key) {
      case AchievementStatus.SILVER:
        return '#C5DDF1';
      case AchievementStatus.GOLD:
        return '#FFFCCC';
      case AchievementStatus.PLATINUM:
        // return '#00FFDD';
        return '#AE88FF';
      default:
        return '#ffffff';
    }
  }, [mainAppStore.accounts]);

  if (
    !mainAppStore.accounts.find((acc) => acc.isLive)?.achievementStatus ||
    !listStatus.includes(mainAppStore.accounts.find((acc) => acc.isLive)?.achievementStatus || '')
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
          {mainAppStore.accounts.find((acc) => acc.isLive)
            ?.achievementStatus === AchievementStatus.PLATINUM
            ? AchievementStatus.ULTRA
            : mainAppStore.accounts.find((acc) => acc.isLive)?.achievementStatus}
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

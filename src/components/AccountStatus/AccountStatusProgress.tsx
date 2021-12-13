import 'react-circular-progressbar/dist/styles.css';
import styled from '@emotion/styled-base';
import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';

import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import { useStores } from '../../hooks/useStores';
import AccStatusData from '../../constants/AccountStatusData';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import SvgIcon from '../SvgIcon';
import IconProgressStar from '../../assets/svg/account-status/icon-star-progress.svg';

const AccountStatusProgress = observer(() => {
  const { userProfileStore } = useStores();
  const { t } = useTranslation();
  return (
    <FlexContainer
      width="100%"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      marginBottom="40px"
    >
      <FlexContainer marginBottom="16px">
        <ProgressWrapper
          width="128px"
          height="128px"
          backgroundColor="rgba(255, 255, 255, 0.24)"
          borderRadius="50%"
          position="relative"
        >
          <CircularProgressbar
            value={userProfileStore.percentageToNextAccountType || 0.1}
            styles={buildStyles({
              pathColor: AccStatusData[userProfileStore.userStatus].color,
              trailColor: 'transparent',
            })}
            strokeWidth={16}
          />
          <ProgressBackground
            gradient={AccStatusData[userProfileStore.userStatus].gradient}
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <SvgIcon
              {...IconProgressStar}
              fillColor={AccStatusData[userProfileStore.userStatus].color}
            />
            <PrimaryTextSpan color="#ffffff" fontSize="16px" fontWeight="bold">
              {AccStatusData[userProfileStore.userStatus].name}
            </PrimaryTextSpan>
          </ProgressBackground>
        </ProgressWrapper>
      </FlexContainer>

      {userProfileStore.userStatus !== userProfileStore.userNextStatus && (
        <FlexContainer>
          <PrimaryTextSpan color="#fff" fontSize="14px">
            {`${t('Deposit')} $${
              userProfileStore.amountToNextAccountType
            } ${'to unlock'}`}
          </PrimaryTextSpan>
          <PrimaryTextSpan
            fontSize="14px"
            color={AccStatusData[userProfileStore.userStatus].color}
          >
            &nbsp;
            {`${AccStatusData[userProfileStore.userNextStatus].name} ${t(
              'Status'
            )}`}
          </PrimaryTextSpan>
        </FlexContainer>
      )}
    </FlexContainer>
  );
});

export default AccountStatusProgress;

const ProgressWrapper = styled(FlexContainer)`
  position: relative;
  margin: 8px;
  box-shadow: 0px 0px 16px rgba(202, 226, 246, 0.12);
`;

const ReverseStar = styled(FlexContainer)`
  transform: scaleX(-1);
`;

const ProgressBackground = styled(FlexContainer)<{ gradient: string }>`
  position: absolute;
  width: 112px;
  height: 112px;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${(props) =>
    `${`linear-gradient(180deg, rgba(202, 226, 246, 0) 0%, ${props.gradient} 100%), rgba(0, 0, 0, 0.3)`}`};
  z-index: -1;
`;

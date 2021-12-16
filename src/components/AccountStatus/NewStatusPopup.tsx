import styled from '@emotion/styled';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AccStatusData, {
  AccountStatusInfo,
} from '../../constants/AccountStatusData';
import { FULL_VH } from '../../constants/global';
import {
  AccountStatusEnum,
  AccStautsFeatureIconEnum,
} from '../../enums/AccountStatusEnum';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import Modal from '../Modal';

import IconStar from '../../assets/svg/account-status/icons-content/icon-start.svg';
import IconCandles from '../../assets/svg/account-status/icons-content/icon-candles.svg';
import IconEducation from '../../assets/svg/account-status/icons-content/icon-education.svg';
import IconDiagram from '../../assets/svg/account-status/icons-content/icon-diagram.svg';
import IconVideo from '../../assets/svg/account-status/icons-content/icon-youtube.svg';
import IconSpread from '../../assets/svg/account-status/icons-content/icon-tag.svg';
import IconSwap from '../../assets/svg/account-status/icons-content/icon-swap.svg';
import SvgIcon from '../SvgIcon';
import { PrimaryButton } from '../../styles/Buttons';

import ModalBg from '../../assets/images/achievement_status_bg/new/bg-congratulation-modal.png';
import IconStarModal from '../../assets/svg/account-status/icon-star-congratulation.svg';
import { useStores } from '../../hooks/useStores';
import { useHistory } from 'react-router';
import Page from '../../constants/Pages';

interface Props {
  activeStatus: AccountStatusEnum;
}
const NewStatusPopup = ({ activeStatus }: Props) => {
  const { t } = useTranslation();
  const { userProfileStore } = useStores();
  const { push } = useHistory();

  const [statusInfo] = useState<AccountStatusInfo>(
    AccStatusData[activeStatus]
  );

  const countFeatures = useMemo(() => {
    return statusInfo.openedFeatures.filter((item) => item.isNew).length;
  }, [statusInfo]);

  const handleClickTrade = () => {
    userProfileStore.setKVActiveStatus(
      userProfileStore.currentAccountTypeId || ''
    );
    userProfileStore.closeCongratModal();
    push(Page.DASHBOARD);
  };

  const getIcon = (icon: AccStautsFeatureIconEnum) => {
    switch (icon) {
      case AccStautsFeatureIconEnum.STAR:
        return IconStar;
      case AccStautsFeatureIconEnum.CANDLES:
        return IconCandles;
      case AccStautsFeatureIconEnum.EDUCATION:
        return IconEducation;
      case AccStautsFeatureIconEnum.DIAGRAM:
        return IconDiagram;
      case AccStautsFeatureIconEnum.VIDEO:
        return IconVideo;
      case AccStautsFeatureIconEnum.SPREAD:
        return IconSpread;
      case AccStautsFeatureIconEnum.SWAP:
        return IconSwap;
      default:
        return IconStar;
    }
  };

  return (
    <Modal>
      <ModalWrap padding="32px" justifyContent="center" alignItems="center">
        <FlexContainer
          borderRadius="16px"
          backgroundColor="#2F323C"
          boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
          flexDirection="column"
          width="100%"
        >
          <ModalHeader
            minHeight="140px"
            backgroundColor={statusInfo.color}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            borderRadius="16px 16px 0 0"
            padding="16px 24px 44px"
            position="relative"
          >
            <PrimaryTextSpan color="#1C1F26" fontSize="24px" fontWeight="bold">
              {t('Congratulations!')}
            </PrimaryTextSpan>
            <PrimaryTextSpan
              textAlign="center"
              fontSize="14px"
              lineHeight="21px"
              fontWeight={500}
              color="#1C1F26"
            >
              {`${t('You received')} ${statusInfo.name} ${t('Status')}`}
              <br />
              {`${t('and unlocked')} ${countFeatures} ${t('benefits')}.`}
            </PrimaryTextSpan>

            <StartImage
              gradient={statusInfo.gradient}
              border={`4px solid ${statusInfo.color}`}
            >
              <SvgIcon {...IconStarModal} fillColor={statusInfo.color} />
            </StartImage>
          </ModalHeader>
          <FlexContainer flexDirection="column" padding="80px 24px 24px">
            <FlexContainer
              flexDirection="column"
              width="100%"
              marginBottom="36px"
            >
              {statusInfo.openedFeatures !== null &&
                statusInfo.openedFeatures.map((item) => (
                  <FlexContainer
                    key={item.label}
                    width="100%"
                    marginBottom="16px"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <FlexContainer alignItems="center">
                      <FlexContainer width="30px">
                        <SvgIcon
                          {...getIcon(item.icon)}
                          fillColor={statusInfo.color}
                        />
                      </FlexContainer>
                      <PrimaryTextSpan color="#ffffff" fontSize="14px">
                        {item.label}
                      </PrimaryTextSpan>
                    </FlexContainer>

                    {item.isNew && (
                      <LabelNew backgroundColor={statusInfo.color}>
                        <PrimaryTextSpan
                          fontSize="12px"
                          lineHeight="1"
                          textTransform="uppercase"
                          color="#1C1F26"
                        >
                          {t('New')}
                        </PrimaryTextSpan>
                      </LabelNew>
                    )}
                  </FlexContainer>
                ))}
            </FlexContainer>
            <PrimaryButton width="100%" onClick={handleClickTrade}>
              <PrimaryTextSpan color="#252636" fontWeight={700} fontSize="16px">
                {t('Let’s Trade')}
              </PrimaryTextSpan>
            </PrimaryButton>
          </FlexContainer>
        </FlexContainer>
      </ModalWrap>
    </Modal>
  );
};

export default NewStatusPopup;

const StartImage = styled(FlexContainer)<{ gradient: string }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -52px;
  background: ${(props) =>
    `linear-gradient(180deg, rgba(202, 226, 246, 0) 0%, ${props.gradient} 100%), #2F323C`};

  filter: ${(props) => `drop-shadow(0px 8px 32px ${props.gradient})`};
`;

const ModalHeader = styled(FlexContainer)`
  background-image: ${`url(${ModalBg})`};
  background-repeat: no-repeat;
  background-size: cover;
`;

const LabelNew = styled(FlexContainer)`
  height: 16px;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  padding: 2px 4px;
`;

const ModalWrap = styled(FlexContainer)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: ${`calc(${FULL_VH})`};
  z-index: 6;
  background: rgba(18, 21, 28, 0.8);
`;

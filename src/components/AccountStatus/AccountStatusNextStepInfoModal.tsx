import styled from '@emotion/styled-base';
import React, { useEffect, useRef, useState } from 'react';
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
import ImageDesriptionBg from '../../assets/images/achievement_status_bg/new/bg-description-modal.png';
import { PrimaryButton } from '../../styles/Buttons';
import SvgIcon from '../SvgIcon';

import IconStar from '../../assets/svg/account-status/icons-content/icon-start.svg';
import IconCandles from '../../assets/svg/account-status/icons-content/icon-candles.svg';
import IconEducation from '../../assets/svg/account-status/icons-content/icon-education.svg';
import IconDiagram from '../../assets/svg/account-status/icons-content/icon-diagram.svg';
import IconVideo from '../../assets/svg/account-status/icons-content/icon-youtube.svg';
import IconSpread from '../../assets/svg/account-status/icons-content/icon-tag.svg';
import IconSwap from '../../assets/svg/account-status/icons-content/icon-swap.svg';

import { useHistory } from 'react-router';
import Page from '../../constants/Pages';

interface Props {
  prevStatusType: AccountStatusEnum;
  activeStatus: AccountStatusEnum;
  closeModal: () => void;
}

const AccountStatusNextStepInfoModal = (props: Props) => {
  const { activeStatus, prevStatusType, closeModal } = props;
  const { t } = useTranslation();
  const { push } = useHistory();
  const modalRef = useRef<HTMLDivElement>(null);

  const [statusInfo] = useState<AccountStatusInfo>(AccStatusData[activeStatus]);

  const [currentStatusInfo] = useState<AccountStatusInfo>(
    AccStatusData[prevStatusType]
  );

  const handleClickAboutStatus = () => {
    closeModal();
    push(Page.ABOUT_STATUS);
  };

  const handleClickOutside = (e: any) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
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

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Modal>
      <ModalWrap>
        <ModalContainer ref={modalRef}>
          <ModalHeader
            padding="16px"
            backgroundColor={currentStatusInfo.color}
            flexDirection="column"
            backgroundImage={`url(${ImageDesriptionBg})`}
          >
            <PrimaryTextSpan color="#1C1F26" fontWeight="bold" fontSize="16px">
              {`${t('Deposit')} ${statusInfo.depositValue}`}
            </PrimaryTextSpan>
            <PrimaryTextSpan color="#1C1F26" fontWeight="bold" fontSize="16px">
              {`${t('to unlock')} ${statusInfo.name} Status!`}
            </PrimaryTextSpan>
          </ModalHeader>
          <FlexContainer padding="16px" flexDirection="column">
            <FlexContainer flexDirection="column" width="100%">
              {statusInfo.newFeatures !== null &&
                statusInfo.newFeatures.map((item) => (
                  <FlexContainer
                    key={item.label}
                    width="100%"
                    marginBottom="16px"
                    alignItems="center"
                  >
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
                ))}
            </FlexContainer>
            <PrimaryButton width="100%" onClick={handleClickAboutStatus}>
              <PrimaryTextSpan color="#252636" fontWeight={700} fontSize="16px">
                {t('About Statuses')}
              </PrimaryTextSpan>
            </PrimaryButton>
          </FlexContainer>
        </ModalContainer>
      </ModalWrap>
    </Modal>
  );
};

export default AccountStatusNextStepInfoModal;

const ModalHeader = styled(FlexContainer)`
  background-repeat: no-repeat;
  background-size: contain;
  background-position: top right;
`;

const ModalContainer = styled(FlexContainer)`
  background: #2f323c;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: column;
  align-self: flex-start;
  overflow: hidden;
`;

const ModalWrap = styled(FlexContainer)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: ${`calc(${FULL_VH})`};
  z-index: 1;
  background: rgba(18, 21, 28, 0.8);
  padding: 60px 16px 16px;
`;

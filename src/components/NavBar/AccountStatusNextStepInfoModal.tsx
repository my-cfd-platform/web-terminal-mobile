import styled from '@emotion/styled-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import AccStatusData from '../../constants/AccountStatusData';
import { FULL_VH } from '../../constants/global';
import { AccountStatusEnum } from '../../enums/AccountStatusEnum';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import Modal from '../Modal';
import ImageDesriptionBg from '../../assets/images/achievement_status_bg/new/bg-description-modal.png';
import { PrimaryButton } from '../../styles/Buttons';

interface Props {
  activeStatus: AccountStatusEnum;
}
const AccountStatusNextStepInfoModal = (props: Props) => {
  const { activeStatus } = props;
  const { t } = useTranslation();
  return (
    <Modal>
      <ModalWrap>
        <ModalContainer>
          <ModalHeader
            padding="16px"
            backgroundColor={AccStatusData[activeStatus].color}
            flexDirection="column"
            backgroundImage={`url(${ImageDesriptionBg})`}
          >
            <PrimaryTextSpan color="#1C1F26" fontWeight="bold" fontSize="16px">
              {`${t('Deposit')} $7,500`}
            </PrimaryTextSpan>
            <PrimaryTextSpan color="#1C1F26" fontWeight="bold" fontSize="16px">
              {`${t('to unlock')} Platinum Status!`}
            </PrimaryTextSpan>
          </ModalHeader>
          <FlexContainer padding="16px">
            <PrimaryButton width="100%">
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

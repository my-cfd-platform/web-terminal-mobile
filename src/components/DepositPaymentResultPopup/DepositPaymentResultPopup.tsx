import React, { FC, useEffect } from 'react';
import styled from '@emotion/styled';

import Modal from '../Modal';
import { FlexContainer } from '../../styles/FlexContainer';
import { useLocation, useHistory } from 'react-router-dom';
import DepositPaymentSuccess from './DepositPaymentSuccess';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import DepositPaymentFail from './DepositPaymentFail';
import { useStores } from '../../hooks/useStores';
import Pages from '../../constants/Pages';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { useTranslation } from 'react-i18next';

interface Params {
  hash: string;
  status: string;
  amount?: number;
}

const DepositPaymentResultPopup: FC = () => {
  const { mainAppStore } = useStores();
  const { t } = useTranslation();

  const { push } = useHistory();
  const location = useLocation();
  const [queryParams, setParams] = React.useState<Params>({
    hash: '',
    status: '',
    amount: 0,
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setParams({
      hash: location.hash || '',
      status: params.get('status') || '',
      amount: Number(params.get('amount')) || 0,
    });
  }, [location]);

  const switchView = () => {
    switch (queryParams.status) {
      case 'success':
        return (
          <DepositPaymentSuccess
            amount={queryParams.amount || 0}
            currencySymbol={mainAppStore.activeAccount?.symbol}
          />
        );
      case 'fail':
        return <DepositPaymentFail />;
      case 'failed':
        return <DepositPaymentFail />;
      default:
        break;
    }
  };

  const handleClosePopup = () => {
    push(Pages.DASHBOARD);
  };

  if (
    queryParams.status === 'success' ||
    queryParams.status === 'fail' ||
    queryParams.status === 'failed'
  ) {
    return (
      <Modal>
        <ModalBackground
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          alignItems="center"
          justifyContent="center"
          zIndex="1001"
        >
          <PopupWrap flexDirection="column" position="relative">
            <FlexContainer
              position="absolute"
              width="100%"
              justifyContent="center"
              top="29px"
              left="0"
              zIndex="299"
            >
              <PrimaryTextSpan fontSize="18px" color="#ffffff">
                {t('Deposit')}
              </PrimaryTextSpan>
            </FlexContainer>
            <FlexContainer
              position="absolute"
              right="12px"
              top="32px"
              zIndex="300"
            >
              <ButtonWithoutStyles onClick={handleClosePopup}>
                <PrimaryTextSpan fontSize="13px" color="#ffffff">
                  {t('Done')}
                </PrimaryTextSpan>
              </ButtonWithoutStyles>
            </FlexContainer>

            {switchView()}
          </PopupWrap>
        </ModalBackground>
      </Modal>
    );
  }

  return null;
};

export default DepositPaymentResultPopup;

const PopupWrap = styled(FlexContainer)`
  width: 100%;
  height: 100vh;
  border-radius: 8px;
  box-sizing: border-box;
  background-color: #1c1f26;
  padding: 72px 32px 44px;
  justify-content: center;
`;

const ModalBackground = styled(FlexContainer)`
  background-color: rgba(37, 38, 54, 0.8);
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(37, 38, 54, 0.6);
    backdrop-filter: blur(12px);
  }
`;

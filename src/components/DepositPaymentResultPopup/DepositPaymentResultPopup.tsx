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
import { FULL_VH } from '../../constants/global';
import DepositPaymentPending from './DepositPaymentPending';
import { DepositStatusResultEnum } from '../../enums/DepositStatusResultEnum';

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
      case DepositStatusResultEnum.SUCCESS:
        return (
          <DepositPaymentSuccess
            amount={queryParams.amount || 0}
            currencySymbol={mainAppStore.activeAccount?.symbol}
          />
        );
      case DepositStatusResultEnum.FAIL:
        return <DepositPaymentFail />;

      case DepositStatusResultEnum.FAILED:
        return <DepositPaymentFail />;

      case DepositStatusResultEnum.PENDING:
        return <DepositPaymentPending />;
      default:
        break;
    }
  };

  const handleClosePopup = () => {
    push(Pages.DASHBOARD);
  };

  if (
    queryParams.status === DepositStatusResultEnum.SUCCESS ||
    queryParams.status === DepositStatusResultEnum.PENDING ||
    queryParams.status === DepositStatusResultEnum.FAILED ||
    queryParams.status === DepositStatusResultEnum.FAIL
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
          <PopupWrap
            flexDirection="column"
            position="relative"
            height={`calc(${FULL_VH})`}
            minHeight={`calc(${FULL_VH})`}
          >
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
  border-radius: 8px;
  box-sizing: border-box;
  background-color: #1c1f26;
  padding: 72px 16px 44px;
  justify-content: center;
`;

const ModalBackground = styled(FlexContainer)`
  background-color: #23262f;

  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(37, 38, 54, 0.6);
    backdrop-filter: blur(12px);
  }
`;

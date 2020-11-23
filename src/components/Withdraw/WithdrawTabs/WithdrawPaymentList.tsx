import styled from '@emotion/styled';
import React from 'react';
import { Link } from 'react-router-dom';
import Page from '../../../constants/Pages';
import { FlexContainer } from '../../../styles/FlexContainer';

import SvgIcon from '../../SvgIcon';
import { PrimaryTextSpan } from '../../../styles/TextsElements';
import { useTranslation } from 'react-i18next';

import IconArrowList from '../../../assets/svg/profile/icon-arrow-link.svg';
import IconBankTransfer from '../../../assets/svg/payments/icon-banktransfer.svg';
import IconBitcoin from '../../../assets/svg/payments/icon-bitcoin.svg';

const WithdrawPaymentList = () => {
  const { t } = useTranslation();

  return (
    <FlexContainer flexDirection="column" width="100%">
      <PaymentLink to={Page.WITHDRAW_VISAMASTER}>
        <FlexContainer
          height="80px"
          minHeight="80px"
          padding="16px"
          alignItems="center"
          justifyContent="space-between"
        >
          <FlexContainer>
            <FlexContainer
              width="48px"
              height="48px"
              borderRadius="50%"
              backgroundColor="#494c53"
              justifyContent="center"
              alignItems="center"
            >
              <SvgIcon {...IconBankTransfer} width="28px" fillColor="#fffee6" />
            </FlexContainer>

            <FlexContainer flexDirection="column" padding="0 0 0 16px" justifyContent="center">
              <PrimaryTextSpan color="#ffffff" fontSize="16px">
                {t('Bank Transfer')}
              </PrimaryTextSpan>
              {/* <PrimaryTextSpan color="rgba(255,255,255,0.5)" lineHeight="1.8">
                {t('Other methods will be available')}
              </PrimaryTextSpan> */}
            </FlexContainer>
          </FlexContainer>
          <FlexContainer>
            <SvgIcon {...IconArrowList} fillColor="#ffffff" />
          </FlexContainer>
        </FlexContainer>
      </PaymentLink>

      <PaymentLink to={Page.WITHDRAW_BITCOIN}>
        <FlexContainer
          height="80px"
          minHeight="80px"
          padding="16px"
          alignItems="center"
          justifyContent="space-between"
        >
          <FlexContainer>
            <FlexContainer
              width="48px"
              height="48px"
              borderRadius="50%"
              backgroundColor="#494c53"
              justifyContent="center"
              alignItems="center"
            >
              <SvgIcon {...IconBitcoin} width="28px" fillColor="#fffee6" />
            </FlexContainer>

            <FlexContainer flexDirection="column" padding="0 0 0 16px" justifyContent="center">
              <PrimaryTextSpan color="#ffffff" fontSize="16px">
                {t('Bitcoin')}
              </PrimaryTextSpan>
              {/* <PrimaryTextSpan color="rgba(255,255,255,0.5)" lineHeight="1.8">
                {t('Other methods will be available')}
              </PrimaryTextSpan> */}
            </FlexContainer>
          </FlexContainer>
          <FlexContainer>
            <SvgIcon {...IconArrowList} fillColor="#ffffff" />
          </FlexContainer>
        </FlexContainer>
      </PaymentLink>
    </FlexContainer>
  );
};

export default WithdrawPaymentList;

const PaymentLink = styled(Link)`
  margin-bottom: 2px;
  background-color: rgba(42, 45, 56, 0.5);
  transition: all 0.4s ease;

  &:active {
    background-color: rgba(42, 45, 56, 0.8);
  }

  text-decoration: none;
  &:hover,
  &:active,
  &:focus,
  &:visited {
    text-decoration: none;
  }
`;

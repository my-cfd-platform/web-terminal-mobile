import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import BackFlowLayout from '../components/BackFlowLayout';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { useStores } from '../hooks/useStores';
import { observer } from 'mobx-react-lite';

import LogoMonfex from '../assets/images/logo.png';
import { PrimaryTextSpan, PrimaryTextParagraph } from '../styles/TextsElements';

const AccountAboutUs = observer(() => {
  const { t } = useTranslation();
  const { mainAppStore } = useStores();

  return (
    <BackFlowLayout pageTitle={t('About us')}>
      <FlexContainer flexDirection="column" width="100%" padding="40px 0 0">
        <FlexContainer width="100%" justifyContent="center" marginBottom="12px">
          <Logo src={mainAppStore.initModel.logo || LogoMonfex} />
        </FlexContainer>

        <FlexContainer width="100%" justifyContent="center">
          <PrimaryTextSpan fontSize="10px" color="rgba(255, 255, 255, 0.4)">
            ©2017–{new Date().getFullYear()}{' '}
            <PrimaryTextSpan
              textTransform="capitalize"
              fontSize="10px"
              color="rgba(255, 255, 255, 0.4)"
            >
              {mainAppStore.initModel.brandName || 'Monfex'}
            </PrimaryTextSpan>
            . {t('All rights reserved')}. v {BUILD_VERSION}
          </PrimaryTextSpan>
        </FlexContainer>

        {mainAppStore.initModel.brandName.toLowerCase() === 'monfex' && (
          <>
            <FlexContainer
              width="100%"
              padding="40px 16px"
              flexDirection="column"
            >
              <PrimaryTextParagraph
                color="#ffffff"
                textAlign="justify"
                lineHeight="1.6"
                fontSize="13px"
              >
                Monfex is a multinational brand with profound experience in
                trading on cryptocurrency markets. Monfex Trading Platform, the
                core product of Monfex, is a powerful, fast and secure
                online-trading software, which allows traders to buy and sell
                leveraged cryptocurrency contracts at any time, using any
                device, and with ultra-low spreads.
              </PrimaryTextParagraph>
              <br />
              <PrimaryTextParagraph
                color="#ffffff"
                textAlign="justify"
                lineHeight="1.6"
                fontSize="13px"
              >
                Monfex acts not only as a cryptocurrency trading platform, but
                also as a community of traders and an educational hub, due in
                part to the Monfex Trading Academy and Monfex Trade Signals.
              </PrimaryTextParagraph>
            </FlexContainer>

            <FlexContainer
              width="100%"
              justifyContent="space-between"
              alignItems="center"
              padding="0 16px"
            >
              <FlexContainer alignItems="center" flexDirection="column">
                <PrimaryTextSpan textAlign="center">200,000+</PrimaryTextSpan>
                <PrimaryTextSpan
                  textAlign="center"
                  color="rgba(255,252,204,0.7)"
                  fontSize="11px"
                >
                  Accounts Worldwide
                </PrimaryTextSpan>
              </FlexContainer>

              <FlexContainer alignItems="center" flexDirection="column">
                <PrimaryTextSpan textAlign="center">Up to 500X</PrimaryTextSpan>
                <PrimaryTextSpan
                  textAlign="center"
                  color="rgba(255,252,204,0.7)"
                  fontSize="11px"
                >
                  leverage
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer alignItems="center" flexDirection="column">
                <PrimaryTextSpan textAlign="center">0%</PrimaryTextSpan>
                <PrimaryTextSpan
                  textAlign="center"
                  color="rgba(255,252,204,0.7)"
                  fontSize="11px"
                >
                  Commission
                </PrimaryTextSpan>
              </FlexContainer>
            </FlexContainer>
          </>
        )}

        {mainAppStore.initModel.brandName.toLowerCase() === 'handelpro' && (
          <>
            <FlexContainer
              width="100%"
              padding="40px 16px"
              flexDirection="column"
            >
              <PrimaryTextParagraph
                color="#ffffff"
                textAlign="justify"
                lineHeight="1.6"
                fontSize="13px"
              >
                A LEADING TRADING PLATFORM IN POLAND
              </PrimaryTextParagraph>
              <br />
              <PrimaryTextParagraph
                color="#ffffff"
                textAlign="justify"
                lineHeight="1.6"
                fontSize="13px"
              >
                Handel Pro is a company that values ​​its customers. Our account
                managers are doing everything in their power to support you and
                guide you through the 24/7 trading process, especially if you
                are a beginner trader. We never abandon our clients and we are
                always at your disposal.
              </PrimaryTextParagraph>
              <br />
              <PrimaryTextParagraph
                color="#ffffff"
                textAlign="justify"
                lineHeight="1.6"
                fontSize="13px"
              >
                The Handel Pro platform is easy to use - it can take you 30
                seconds to register an account. In addition, deposits to and
                withdrawals are very fast and available for both Visa /
                Mastercard and cryptocurrencies.
              </PrimaryTextParagraph>
            </FlexContainer>

            <FlexContainer
              width="100%"
              justifyContent="space-between"
              alignItems="center"
              padding="0 16px"
            >
              <FlexContainer alignItems="center" flexDirection="column">
                <PrimaryTextSpan textAlign="center">200,000+</PrimaryTextSpan>
                <PrimaryTextSpan
                  textAlign="center"
                  color="rgba(255,252,204,0.7)"
                  fontSize="11px"
                >
                  Accounts Worldwide
                </PrimaryTextSpan>
              </FlexContainer>

              <FlexContainer alignItems="center" flexDirection="column">
                <PrimaryTextSpan textAlign="center">Up to 500X</PrimaryTextSpan>
                <PrimaryTextSpan
                  textAlign="center"
                  color="rgba(255,252,204,0.7)"
                  fontSize="11px"
                >
                  leverage
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer alignItems="center" flexDirection="column">
                <PrimaryTextSpan textAlign="center">0%</PrimaryTextSpan>
                <PrimaryTextSpan
                  textAlign="center"
                  color="rgba(255,252,204,0.7)"
                  fontSize="11px"
                >
                  Commission
                </PrimaryTextSpan>
              </FlexContainer>
            </FlexContainer>
          </>
        )}
      </FlexContainer>
    </BackFlowLayout>
  );
});

export default AccountAboutUs;

const Logo = styled.img`
  height: 30px;
`;

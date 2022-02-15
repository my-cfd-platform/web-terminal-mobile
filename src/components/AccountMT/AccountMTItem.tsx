import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { moneyFormatPart } from '../../helpers/moneyFormat';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import SvgIcon from '../SvgIcon';
import IconTrade from '../../assets/svg/profile/icon-trade-btn.svg';
import styled from '@emotion/styled';
import { useStores } from '../../hooks/useStores';
import { useHistory } from 'react-router-dom';
import Fields from '../../constants/fields';
import Topics from '../../constants/websocketTopics';
import IconClose from '../../assets/svg/mt5/icon-info-close.svg';

interface Props {
  isMT?: boolean;
  balance: number;
  margin: number;
  bonus?: number;
  depositLink: string;
  tradeLink: string;
  label: string;
  image: string;
  server?: string;
  login?: number;
}

const AccountMTItem = ({
  isMT = false,
  bonus = 0,
  balance,
  margin,
  depositLink,
  tradeLink,
  label,
  image,
  server = '',
  login,
}: Props) => {
  const { t } = useTranslation();
  const { push } = useHistory();
  const { mainAppStore } = useStores();

  const [showLoginInfo, setShowLoginInfo] = useState(false);

  const toggleShowInfo = () => setShowLoginInfo(!showLoginInfo);
  const handleClickTrading = () => {
    const acc = mainAppStore.accounts.find((item) => item.isLive);
    if (!isMT) {
      if (acc) {
        mainAppStore.setActiveAccount(acc);
        mainAppStore.activeSession?.send(Topics.SET_ACTIVE_ACCOUNT, {
          [Fields.ACCOUNT_ID]: acc.id,
        });
      }
      push(tradeLink);
    } else {
      // @ts-ignore
      window.open(`${tradingLink}`, '_blank').focus();
    }
  };

  const handleClickDeposit = () => {
    push(depositLink);
  };

  return (
    <FlexContainer
      backgroundColor="rgba(255, 255, 255, 0.12)"
      border="1px solid rgba(255, 255, 255, 0.04)"
      borderRadius="4px"
      marginBottom="16px"
      alignItems="center"
      flexDirection="column"
    >
      <FlexContainer
        padding="4px 24px"
        margin="-1px 0 0 0"
        backgroundColor="#1C1F26"
        borderRadius="0px 0px 10px 10px"
        border="1px solid rgba(255, 255, 255, 0.04)"
      >
        <PrimaryTextSpan
          fontSize="12px"
          textTransform="uppercase"
          color="#00FFDD"
        >
          {label}
        </PrimaryTextSpan>
      </FlexContainer>

      <FlexContainer width="100%" padding="24px 20px">
        <FlexContainer width="48px" marginRight="16px">
          <LabelImage image={image} />
        </FlexContainer>
        <FlexContainer flex="1" flexDirection="column">
          {/*  */}
          <FlexContainer flexDirection="column" marginBottom="16px">
            <PrimaryTextSpan
              color="rgba(255, 255, 255, 0.64)"
              fontSize="13px"
              textTransform="uppercase"
            >
              {t('Balance')}
            </PrimaryTextSpan>

            <PrimaryTextSpan fontWeight={500} color="#FFFCCC" fontSize="28px">
              ${moneyFormatPart(balance).int}
              <PrimaryTextSpan fontWeight={500} color="#FFFCCC" fontSize="24px">
                .{moneyFormatPart(balance).decimal}
              </PrimaryTextSpan>
            </PrimaryTextSpan>
          </FlexContainer>
          {/*  */}
          <FlexContainer
            flex="1"
            justifyContent="space-between"
            marginBottom="16px"
          >
            <FlexContainer flexDirection="column" width="calc(50% - 6px)">
              <PrimaryTextSpan
                color="rgba(255, 255, 255, 0.64)"
                fontSize="13px"
                textTransform="uppercase"
                marginBottom="4px"
              >
                {t('Margin')}
              </PrimaryTextSpan>

              <PrimaryTextSpan color="#fff" fontSize="20px">
                ${moneyFormatPart(margin).int}
                <PrimaryTextSpan color="#fff" fontSize="16px">
                  .{moneyFormatPart(margin).decimal}
                </PrimaryTextSpan>
              </PrimaryTextSpan>
            </FlexContainer>
            {/*  */}
            {!isMT && (
              <FlexContainer flexDirection="column" width="calc(50% - 6px)">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.64)"
                  fontSize="13px"
                  textTransform="uppercase"
                  marginBottom="4px"
                >
                  {t('Bonus')}
                </PrimaryTextSpan>

                <PrimaryTextSpan color="#fff" fontSize="20px">
                  ${moneyFormatPart(bonus).int}
                  <PrimaryTextSpan color="#fff" fontSize="16px">
                    .{moneyFormatPart(bonus).decimal}
                  </PrimaryTextSpan>
                </PrimaryTextSpan>
              </FlexContainer>
            )}
          </FlexContainer>

          {isMT && (
            <FlexContainer
              marginBottom="16px"
              flexDirection="column"
              alignItems="flex-start"
            >
              <ButtonWithoutStyles onClick={toggleShowInfo}>
                <FlexContainer alignItems="center" marginBottom="4px">
                  <PrimaryTextSpan
                    color="rgba(255, 255, 255, 0.64)"
                    fontSize="13px"
                    textTransform="uppercase"
                    marginRight="8px"
                  >
                    {t('Login info')}
                  </PrimaryTextSpan>
                  <SvgIcon
                    {...IconClose}
                    fillColor="rgba(255, 255, 255, 0.64)"
                  />
                </FlexContainer>
              </ButtonWithoutStyles>

              {showLoginInfo && (
                <FlexContainer flexDirection="column">
                  <FlexContainer
                    backgroundColor="rgba(255, 255, 255, 0.12)"
                    borderRadius="4px"
                    padding="6px 12px"
                    margin="8px 0"
                    alignItems="center"
                    width="max-content"
                  >
                    <PrimaryTextSpan marginRight="12px">
                      {t('Login')}:
                    </PrimaryTextSpan>
                    <PrimaryTextSpan
                      color="#fff"
                      fontWeight={500}
                      fontSize="12px"
                    >
                      {login}
                    </PrimaryTextSpan>
                  </FlexContainer>
                  <FlexContainer
                    backgroundColor="rgba(255, 255, 255, 0.12)"
                    borderRadius="4px"
                    padding="6px 12px"
                    alignItems="center"
                    width="max-content"
                  >
                    <PrimaryTextSpan marginRight="12px">
                      {t('Server name')}:
                    </PrimaryTextSpan>
                    <PrimaryTextSpan
                      color="#fff"
                      fontWeight={500}
                      fontSize="12px"
                    >
                      {server}
                    </PrimaryTextSpan>
                  </FlexContainer>
                </FlexContainer>
              )}
            </FlexContainer>
          )}
          {/*  */}
          <FlexContainer flex="1" justifyContent="space-between">
            <FlexContainer flexDirection="column" width="calc(50% - 6px)">
              <ButtonWithoutStyles onClick={handleClickDeposit}>
                <FlexContainer
                  backgroundColor="#1C1F26"
                  width="100%"
                  height="36px"
                  justifyContent="center"
                  alignItems="center"
                  borderRadius="4px"
                >
                  <PrimaryTextSpan color="#fff" fontWeight={700}>
                    {t('Deposit')}
                  </PrimaryTextSpan>
                </FlexContainer>
              </ButtonWithoutStyles>
            </FlexContainer>
            <FlexContainer flexDirection="column" width="calc(50% - 6px)">
              <ButtonWithoutStyles onClick={handleClickTrading}>
                <FlexContainer
                  backgroundColor="#00FFDD"
                  width="100%"
                  height="36px"
                  justifyContent="center"
                  alignItems="center"
                  borderRadius="4px"
                >
                  <FlexContainer marginRight="8px">
                    <SvgIcon {...IconTrade} />
                  </FlexContainer>
                  <PrimaryTextSpan color="#1C1F26" fontWeight={700}>
                    {t('Trade')}
                  </PrimaryTextSpan>
                </FlexContainer>
              </ButtonWithoutStyles>
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default AccountMTItem;

const LabelImage = styled.div<{ image: string }>`
  width: 46px;
  height: 46px;
  background-color: transparent;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-image: ${(props) => (props.image ? `url(${props.image})` : '')};
`;

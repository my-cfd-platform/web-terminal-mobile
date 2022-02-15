import React from 'react';
import { useTranslation } from 'react-i18next';
import BackFlowLayout from '../components/BackFlowLayout';
import { useStores } from '../hooks/useStores';
import { PrimaryButton } from '../styles/Buttons';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';

import IconCopy from '../assets/svg/icon-mt-copy.svg';
import SvgIcon from '../components/SvgIcon';
import { useHistory } from 'react-router-dom';
import Page from '../constants/Pages';

const AccountMTLoginDetail = () => {
  const { t } = useTranslation();
  const { push } = useHistory();
  const { userProfileStore, notificationStore } = useStores();

  const handleClickCopy = (e: any, string: string) => {
    e.stopPropagation();
    let el = document.createElement('textarea');
    el.value = string;
    el.setAttribute('readonly', '');
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    //  --- --- --- --- ---
    notificationStore.setNotification(t('Copied to clipboard'));
    notificationStore.isSuccessfull = true;
    notificationStore.openNotification();
  };

  if (userProfileStore.newMTAccountInfo === null) {
    push(Page.MT5_CHANGE_ACCOUNT);
  }

  return (
    <BackFlowLayout pageTitle={t('MT5 Credentials')} type="close">
      <FlexContainer flex="1" flexDirection="column">
        <FlexContainer flex="1" flexDirection="column">
          <FlexContainer
            width="100%"
            backgroundColor="#252933"
            justifyContent="space-between"
            padding="14px 16px"
            marginBottom="2px"
          >
            <PrimaryTextSpan color="#FFFFFF" fontWeight="bold" fontSize="16px">
              {t('Server')}
            </PrimaryTextSpan>

            <FlexContainer>
              <PrimaryTextSpan
                color="#FFFCCC"
                fontWeight="bold"
                fontSize="16px"
                marginRight="16px"
              >
                {userProfileStore.newMTAccountInfo?.serverName}
              </PrimaryTextSpan>
              <ButtonWithoutStyles
                onClick={(e) =>
                  handleClickCopy(
                    e,
                    `${t('Server')}: ${
                      userProfileStore.newMTAccountInfo?.serverName
                    }`
                  )
                }
              >
                <SvgIcon {...IconCopy} fillColor="#252933" />
              </ButtonWithoutStyles>
            </FlexContainer>
          </FlexContainer>
          {/*  */}
          <FlexContainer
            width="100%"
            backgroundColor="#252933"
            justifyContent="space-between"
            padding="14px 16px"
            marginBottom="2px"
          >
            <PrimaryTextSpan color="#FFFFFF" fontWeight="bold" fontSize="16px">
              {t('Login')}
            </PrimaryTextSpan>

            <FlexContainer>
              <PrimaryTextSpan
                color="#FFFCCC"
                fontWeight="bold"
                fontSize="16px"
                marginRight="16px"
              >
                {userProfileStore.newMTAccountInfo?.login}
              </PrimaryTextSpan>
              <ButtonWithoutStyles
                onClick={(e) =>
                  handleClickCopy(
                    e,
                    `${t('Login')}: ${userProfileStore.newMTAccountInfo?.login}`
                  )
                }
              >
                <SvgIcon {...IconCopy} fillColor="#252933" />
              </ButtonWithoutStyles>
            </FlexContainer>
          </FlexContainer>
          {/*  */}
          <FlexContainer
            width="100%"
            backgroundColor="#252933"
            justifyContent="space-between"
            padding="14px 16px"
            marginBottom="2px"
          >
            <PrimaryTextSpan color="#FFFFFF" fontWeight="bold" fontSize="16px">
              {t('Password')}
            </PrimaryTextSpan>

            <FlexContainer>
              <PrimaryTextSpan
                color="#FFFCCC"
                fontWeight="bold"
                fontSize="16px"
                marginRight="16px"
              >
                {userProfileStore.newMTAccountInfo?.password}
              </PrimaryTextSpan>
              <ButtonWithoutStyles
                onClick={(e) =>
                  handleClickCopy(
                    e,
                    `${t('Password')}: ${
                      userProfileStore.newMTAccountInfo?.password
                    }`
                  )
                }
              >
                <SvgIcon {...IconCopy} fillColor="#252933" />
              </ButtonWithoutStyles>
            </FlexContainer>
          </FlexContainer>
          {/*  */}
          <FlexContainer
            width="100%"
            backgroundColor="#252933"
            justifyContent="space-between"
            padding="14px 16px"
            marginBottom="2px"
          >
            <PrimaryTextSpan color="#FFFFFF" fontWeight="bold" fontSize="16px">
              {t('Investor')}
            </PrimaryTextSpan>

            <FlexContainer>
              <PrimaryTextSpan
                color="#FFFCCC"
                fontWeight="bold"
                fontSize="16px"
                marginRight="16px"
              >
                {userProfileStore.newMTAccountInfo?.investorPassword}
              </PrimaryTextSpan>
              <ButtonWithoutStyles
                onClick={(e) =>
                  handleClickCopy(
                    e,
                    `${t('Investor')}: ${
                      userProfileStore.newMTAccountInfo?.investorPassword
                    }`
                  )
                }
              >
                <SvgIcon {...IconCopy} fillColor="#252933" />
              </ButtonWithoutStyles>
            </FlexContainer>
          </FlexContainer>
          {/*  */}
        </FlexContainer>

        <FlexContainer padding="16px" width="100%">
          <PrimaryButton
            width="100%"
            onClick={(e) =>
              handleClickCopy(
                e,
                `${t('Server')}: ${
                  userProfileStore.newMTAccountInfo?.serverName
                } \n ${t('Login')}: ${
                  userProfileStore.newMTAccountInfo?.login
                } \n ${t('Password')}: ${
                  userProfileStore.newMTAccountInfo?.password
                } \n ${t('Investor')}: ${
                  userProfileStore.newMTAccountInfo?.investorPassword
                }`
              )
            }
          >
            <PrimaryTextSpan color="#1C1F26" fontSize="16px" fontWeight="bold">
              {t('Copy All')}
            </PrimaryTextSpan>
          </PrimaryButton>
        </FlexContainer>
      </FlexContainer>
    </BackFlowLayout>
  );
};

export default AccountMTLoginDetail;

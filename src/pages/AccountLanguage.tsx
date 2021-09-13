import React, { useEffect, useState } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import BackFlowLayout from '../components/BackFlowLayout';
import Colors from '../constants/Colors';
import { PrimaryButton } from '../styles/Buttons';
import { ObjectKeys } from '../helpers/objectKeys';
import { CountriesEnum } from '../enums/CountriesEnum';
import {
  ListForEN,
  ListForPL,
  ListForES,
  ListForDE,
  ListForRU,
  ListForPT,
} from '../constants/listOfLanguages';
import { useStores } from '../hooks/useStores';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import Page from '../constants/Pages';
import { useHistory } from 'react-router-dom';

const AccountLanguage = () => {
  const { mainAppStore } = useStores();
  const [list, setList] = useState(ListForEN);
  const [activeLanguage, setActiveLanguage] = useState<any>(null);
  const [wasChanged, setWasChanged] = useState<boolean>(false);
  const { t } = useTranslation();
  const { push } = useHistory();

  useEffect(() => {
    switch (mainAppStore.lang) {
      case CountriesEnum.EN:
        setActiveLanguage({
          id: CountriesEnum.EN,
          name: ListForEN[CountriesEnum.EN],
        });
        setList(ListForEN);
        break;
      case CountriesEnum.PL:
        setActiveLanguage({
          id: CountriesEnum.PL,
          name: ListForPL[CountriesEnum.PL],
        });
        setList(ListForPL);
        break;
      case CountriesEnum.ES:
        setActiveLanguage({
          id: CountriesEnum.ES,
          name: ListForES[CountriesEnum.ES],
        });
        setList(ListForES);
        break;
      case CountriesEnum.DE:
        setActiveLanguage({
          id: CountriesEnum.DE,
          name: ListForDE[CountriesEnum.DE],
        });
        setList(ListForDE);
        break;
      case CountriesEnum.RU:
        setActiveLanguage({
          id: CountriesEnum.RU,
          name: ListForRU[CountriesEnum.RU],
        });
        setList(ListForRU);
        break;
      case CountriesEnum.PT:
        setActiveLanguage({
          id: CountriesEnum.PT,
          name: ListForPT[CountriesEnum.PT],
        });
        setList(ListForPT);
        break;
      default:
        break;
    }
  }, [mainAppStore.lang]);

  const handleChangeActiveLanguage = (key: any) => {
    setWasChanged(!(key.id === mainAppStore.lang));
    setActiveLanguage(key);
  };

  const handleChangeLanguage = () => {
    mainAppStore.setLanguage(activeLanguage.id);
    push(Page.ACCOUNT_PROFILE);
  };

  return (
    <BackFlowLayout
      backLink={Page.ACCOUNT_PROFILE}
      pageTitle={t('Choose language')}
    >
      <FlexContainer
        flexDirection="column"
        justifyContent="space-between"
        width="100%"
        height="100%"
      >
        <FlexContainer flexDirection="column" width="100%">
          {ObjectKeys(list).sort().map((key) => (
            <LanguageItem
              key={key}
              onClick={() =>
                handleChangeActiveLanguage({
                  id: key,
                  name: list[key],
                })
              }
            >
              
              <PrimaryTextSpan
                fontSize="16px"
                color={activeLanguage?.id === key ? '#fffccc' : '#fff'}
              >
              {list[key].originName} ({list[key].name})
              </PrimaryTextSpan>
            </LanguageItem>
          ))}
        </FlexContainer>
        <FlexContainer
          width="100%"
          alignItems="center"
          justifyContent="center"
          padding="0 16px 40px"
        >
          <PrimaryButton
            padding="12px"
            type="button"
            width="100%"
            onClick={handleChangeLanguage}
            disabled={!wasChanged}
          >
            <PrimaryTextSpan
              color={Colors.BLACK}
              fontWeight="bold"
              fontSize="16px"
            >
              {t('Change language')}
            </PrimaryTextSpan>
          </PrimaryButton>
        </FlexContainer>
      </FlexContainer>
    </BackFlowLayout>
  );
};

export default AccountLanguage;

const LanguageItem = styled(FlexContainer)`
  background-color: rgba(42, 45, 56, 0.5);
  padding: 14px 16px;
  border: none;
  border-bottom: #1c1f26 2px solid;
  width: 100%;
  color: #fffccc;
  font-size: 16px;
  line-height: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

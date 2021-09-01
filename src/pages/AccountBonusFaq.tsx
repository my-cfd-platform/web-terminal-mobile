import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import BackFlowLayout from '../components/BackFlowLayout';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { PrimaryTextSpan, PrimaryTextParagraph } from '../styles/TextsElements';
import Page from '../constants/Pages';

const AccountBonusFaq = observer(() => {
  const { t } = useTranslation();

  return (
    <BackFlowLayout backLink={Page.ACCOUNT_PROFILE} pageTitle={t('Bonus FAQ')}>
      <FlexContainer flexDirection="column" width="100%" padding="16px">
        <FlexContainer flexDirection="column" marginBottom="32px">
          <PrimaryTextSpan
            textTransform="uppercase"
            color="#ffffff"
            fontSize="13px"
            marginBottom="8px"
          >
            {t('What does “bonus” mean?')}
          </PrimaryTextSpan>
          <PrimaryTextParagraph
            color="rgba(255, 255, 255, 0.4)"
            fontSize="13px"
            lineHeight="20px"
          >
            {t(
              'A “bonus” is the money that a company provides to a client for the purposes of trading only under certain conditions. You can view all details on your bonus account. A “bonus” is given to one account per client only.'
            )}
          </PrimaryTextParagraph>
        </FlexContainer>

        <FlexContainer flexDirection="column" marginBottom="32px">
          <PrimaryTextSpan
            textTransform="uppercase"
            color="#ffffff"
            fontSize="13px"
            marginBottom="8px"
          >
            {t('What is my “bonus” amount?')}
          </PrimaryTextSpan>
          <PrimaryTextParagraph
            color="rgba(255, 255, 255, 0.4)"
            fontSize="13px"
            lineHeight="20px"
          >
            {t(
              'The amount of “bonus” depends on the amount of money you deposit. The maximum bonus amount is $500.'
            )}
          </PrimaryTextParagraph>
        </FlexContainer>

        <FlexContainer flexDirection="column" marginBottom="32px">
          <PrimaryTextSpan
            textTransform="uppercase"
            color="#ffffff"
            fontSize="13px"
            marginBottom="8px"
          >
            {t('What are the rules on the use of bonuses?')}
          </PrimaryTextSpan>
          <PrimaryTextParagraph
            color="rgba(255, 255, 255, 0.4)"
            fontSize="13px"
            lineHeight="20px"
          >
            {t(
              'All the profit a trader makes belongs to him/her. It can be withdrawn at any moment and without any further conditions. But note that you cannot withdraw bonus funds themselves: if you submit a withdrawal request, your bonuses are burned.'
            )}
            <br />
            {t(
              'Example: If a trader deposited $100 in real funds to the account, and gets a $30 bonus fund, the account balance will be: $100 (own money) + $30 (bonus) = $130. A trader can use $130 for trading by depositing only $100. All the profits a trader makes will belong to him/her.'
            )}
            <br />
            {t(
              'A “bonus” cannot be lost until there is a balance on the account.'
            )}
          </PrimaryTextParagraph>
        </FlexContainer>

        <FlexContainer flexDirection="column" marginBottom="32px">
          <PrimaryTextSpan
            textTransform="uppercase"
            color="#ffffff"
            fontSize="13px"
            marginBottom="8px"
          >
            {t('Can I withdraw my bonus money?')}
          </PrimaryTextSpan>
          <PrimaryTextParagraph
            color="rgba(255, 255, 255, 0.4)"
            fontSize="13px"
            lineHeight="20px"
          >
            {t(
              'Bonuses will be automatically deducted if you apply to make a withdrawal.'
            )}
          </PrimaryTextParagraph>
        </FlexContainer>
        <br />
      </FlexContainer>
    </BackFlowLayout>
  );
});

export default AccountBonusFaq;

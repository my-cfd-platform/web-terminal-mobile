import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { moneyFormatPart } from '../../helpers/moneyFormat';
import { useStores } from '../../hooks/useStores';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import InformationPopup from '../InformationPopup';

const WithdrawAvailableBalanceInfo = observer(() => {
  const { mainAppStore } = useStores();
  const { t } = useTranslation();
  return (
    <>
      <FlexContainer padding="16px" justifyContent="space-between">
        <PrimaryTextSpan fontSize="14px" color="rgba(196, 196, 196, 0.5)">
          {t('Withdrawable')}
        </PrimaryTextSpan>
        <PrimaryTextSpan fontSize="14px" color="rgba(255, 255, 255, 0.4)">
          {mainAppStore.realAcc?.symbol}
          {
            moneyFormatPart(
              (mainAppStore.realAcc?.balance || 0) - (mainAppStore.realAcc?.bonus || 0)
            ).int
          }
          .
          <PrimaryTextSpan fontSize="10px" color="rgba(255, 255, 255, 0.4)">
            {
              moneyFormatPart(
                (mainAppStore.realAcc?.balance || 0) - (mainAppStore.realAcc?.bonus || 0)
              ).decimal
            }
          </PrimaryTextSpan>
        </PrimaryTextSpan>
      </FlexContainer>

      {mainAppStore.accounts.find((acc) => acc.isLive)?.bonus && (
        <FlexContainer padding="16px" justifyContent="space-between">
          <FlexContainer>
            <PrimaryTextSpan
              fontSize="14px"
              color="rgba(196, 196, 196, 0.5)"
              marginRight="8px"
            >
              {t('Bonus')}
            </PrimaryTextSpan>
            <InformationPopup
              infoText={t(
                'There is no possibility of withdrawing bonus. But this is an extra amount on your account and when you make a profit with them, this is something you can withdraw.'
              )}
            />
          </FlexContainer>
          <PrimaryTextSpan fontSize="14px" color="rgba(255, 255, 255, 0.4)">
            {mainAppStore.realAcc?.symbol}
            {
              moneyFormatPart(
                mainAppStore.realAcc?.bonus || 0
              ).int
            }
            .
            <PrimaryTextSpan fontSize="10px" color="rgba(255, 255, 255, 0.4)">
              {
                moneyFormatPart(
                  mainAppStore.realAcc?.bonus || 0
                ).decimal
              }
            </PrimaryTextSpan>
          </PrimaryTextSpan>
        </FlexContainer>
      )}
    </>
  );
});

export default WithdrawAvailableBalanceInfo;

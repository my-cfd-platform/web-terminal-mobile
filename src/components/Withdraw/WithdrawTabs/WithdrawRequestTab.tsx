import { Observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FULL_VH } from '../../../constants/global';
import API from '../../../helpers/API';
import { getProcessId } from '../../../helpers/getProcessId';
import { useStores } from '../../../hooks/useStores';
import { FlexContainer } from '../../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../../styles/TextsElements';
import LoaderForComponents from '../../LoaderForComponents';
import WithdrawalFaqLink from '../WithdrawalFaqLink';
import WithdrawPaymentList from './WithdrawPaymentList';

const WithdrawRequestTab = () => {
  const { t } = useTranslation();
  const { mainAppStore, withdrawalStore } = useStores();
  const [userEmail, setEmail] = useState('');

  useEffect(() => {
    async function fetchPersonalData() {
      try {
        const response = await API.getPersonalData(
          getProcessId(),
          mainAppStore.initModel.authUrl
        );
        setEmail(response.data.email);
      } catch (error) {}
    }
    fetchPersonalData();
  }, []);

  return (
    <FlexContainer
      height={`calc(${FULL_VH} - 136px)`}
      width="100%"
      flexDirection="column"
    >
      <FlexContainer
        flexDirection="column"
        width="100%"
        height="100%"
        justifyContent="space-between"
        position="relative"
      >
        <Observer>
          {() => (
            <>
              {withdrawalStore.loading && (
                <LoaderForComponents isLoading={withdrawalStore.loading} />
              )}
              {!withdrawalStore.loading && (
                <>
                  {withdrawalStore.pendingPopup ? (
                    <FlexContainer
                      height="calc(100% - 75px)"
                      alignItems="center"
                      justifyContent="center"
                      padding="16px"
                    >
                      <PrimaryTextSpan color="#ffffff" textAlign="center">
                        {t('Our Customer support will contact you via')} &nbsp;
                        <PrimaryTextSpan color="#FFFCCC">
                          {userEmail || 'your@email.com'}
                        </PrimaryTextSpan>
                        <br />
                        {t(
                          'to confirm and proceed with your withdrawal request.'
                        )}
                        <br />
                        {t(
                          'Please be note, that you can submit only one withdrawal request at a time'
                        )}
                      </PrimaryTextSpan>
                    </FlexContainer>
                  ) : (
                    <>
                      {mainAppStore.accounts.find((acc) => acc.isLive)
                        ?.balance === 0 ? (
                        <FlexContainer
                          height="calc(100% - 75px)"
                          alignItems="center"
                          justifyContent="center"
                          padding="16px"
                        >
                          <PrimaryTextSpan color="#ffffff" textAlign="center">
                            {t(
                              'Withdrawal will be available after you deposit money into the system'
                            )}
                          </PrimaryTextSpan>
                        </FlexContainer>
                      ) : (
                        <WithdrawPaymentList />
                      )}
                    </>
                  )}
                  <WithdrawalFaqLink />
                </>
              )}
            </>
          )}
        </Observer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default WithdrawRequestTab;
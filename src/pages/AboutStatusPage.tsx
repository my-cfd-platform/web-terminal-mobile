import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BackFlowLayout from '../components/BackFlowLayout';
import { PrimaryButton } from '../styles/Buttons';
import { FlexContainer } from '../styles/FlexContainer';
import { useStores } from '../hooks/useStores';
import { observer } from 'mobx-react-lite';
import AccountStatusProgress from '../components/AccountStatus/AccountStatusProgress';
import AboutStatusTable from '../components/AccountStatus/AboutStatusTable';

const AboutStatusPage = observer(() => {
  const { t } = useTranslation();
  const { mainAppStore, userProfileStore } = useStores();

  const [parsedParams, setParsedParams] = useState('');
  const urlParams = new URLSearchParams();

  const hadnleClickDeposit = () => {
    if (userProfileStore.isBonus) {
      userProfileStore.showBonusPopup();
      mainAppStore.setLoading(false);
    } else {
      window.location.href = `${API_DEPOSIT_STRING}/?${parsedParams}`;
    }
  };

  useEffect(() => {
    urlParams.set('token', mainAppStore.token);
    urlParams.set(
      'active_account_id',
      mainAppStore.accounts.find((item) => item.isLive)?.id || ''
    );
    urlParams.set('env', 'web_mob');
    urlParams.set('lang', mainAppStore.lang);
    urlParams.set('trader_id', userProfileStore.userProfileId || '');
    urlParams.set('api', mainAppStore.initModel.tradingUrl);
    urlParams.set('rt', mainAppStore.refreshToken);

    setParsedParams(urlParams.toString());
  }, [
    mainAppStore.token,
    mainAppStore.lang,
    mainAppStore.accounts,
    userProfileStore,
  ]);

  return (
    <BackFlowLayout pageTitle={t('My Status')}>
      <FlexContainer
        flexDirection="column"
        width="100%"
        justifyContent="space-between"
      >
        <FlexContainer flex="1" overflow="auto" flexDirection="column">
          <AccountStatusProgress />
          <AboutStatusTable />
        </FlexContainer>
        <FlexContainer backgroundColor="#1C1F26" padding="16px" width="100%">
          <PrimaryButton width="100%" onClick={hadnleClickDeposit}>
            {userProfileStore.userStatus === userProfileStore.userNextStatus
              ? t('Deposit')
              : t('Deposit to Get Status')}
          </PrimaryButton>
        </FlexContainer>
      </FlexContainer>
    </BackFlowLayout>
  );
});

export default AboutStatusPage;

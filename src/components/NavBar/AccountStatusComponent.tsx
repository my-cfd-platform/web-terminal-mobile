import { observer } from 'mobx-react-lite';
import React, { useRef } from 'react';
import { AccountStatusEnum } from '../../enums/AccountStatusEnum';
import { useStores } from '../../hooks/useStores';
import AccountStatusNextStepInfoModal from '../AccountStatus/AccountStatusNextStepInfoModal';
import NewStatusPopup from '../AccountStatus/NewStatusPopup';
import AccountStatusBar from './AccountStatusBar';

const AccountStatusComponent = observer(() => {
  const { mainAppStore, userProfileStore } = useStores();

  const statusBarRef = useRef<HTMLDivElement>(null)

  if (
    mainAppStore.isPromoAccount ||
    userProfileStore.currentAccountTypeId === null ||
    userProfileStore.statusTypes === null
  ) {
    return null;
  }


  return (
    <>
      <AccountStatusBar
        customRef={statusBarRef}
        donePercent={
          userProfileStore.userStatus === AccountStatusEnum.VIP
            ? 100
            : userProfileStore.percentageToNextAccountType || 3
        }
        onClick={userProfileStore.toggleStatusDescription}
        activeStatus={userProfileStore.userStatus}
      />

      {!userProfileStore.isCongratModal &&
        userProfileStore.isStatusDescription && (
          <AccountStatusNextStepInfoModal
            statusBarRef={statusBarRef}
            closeModal={userProfileStore.closeStatusDescription}
            prevStatusType={userProfileStore.userStatus}
            activeStatus={userProfileStore.userNextStatus}
            depositValue={userProfileStore.amountToNextAccountType || 0}
          />
        )}

      {userProfileStore.isCongratModal && (
        <NewStatusPopup activeStatus={userProfileStore.userStatus} />
      )}
    </>
  );
});

export default AccountStatusComponent;

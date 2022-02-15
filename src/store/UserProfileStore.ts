import { AccountStatusEnum } from './../enums/AccountStatusEnum';
import { IWelcomeBonusExpirations } from './../types/UserInfo';
import { observable, action, computed } from 'mobx';
import { WelcomeBonusResponseEnum } from '../enums/WelcomeBonusResponseEnum';
import API from '../helpers/API';
import { PersonalDataDTO } from '../types/PersonalDataTypes';
import moment from 'moment';
import {
  AccountUserStatusInfo,
  MTCreateAccountDTO,
  UserActiveStatus,
} from '../types/AccountsTypes';
import KeysInApi from '../constants/keysInApi';
import { RootStore } from './RootStore';

interface ContextProps {
  rootStore: RootStore;
  userProfile: PersonalDataDTO | null;
  userProfileId: string;
  loadingBonus: boolean;
  isBonus: boolean;
  bonusPercent: number;
  bonusExpirationDate: number;

  statusTypes: AccountUserStatusInfo[] | null;
  userStatus: AccountStatusEnum;
  userNextStatus: AccountStatusEnum;

  currentAccountTypeId: string | null;
  percentageToNextAccountType: number | null;
  amountToNextAccountType: number | null;
  isCongratModal: boolean;
  isStatusDescription: boolean;

  newMTAccountInfo: null | MTCreateAccountDTO;
}

export class UserProfileStore implements ContextProps {
  rootStore: RootStore;
  @observable userProfile: PersonalDataDTO | null = null;
  @observable userProfileId: string = '';

  @observable loadingBonus = false;
  @observable isBonusPopup = false;
  @observable isBonus = false;

  @observable bonusPercent = 0;
  @observable bonusExpirationDate = 0;

  @observable statusTypes: AccountUserStatusInfo[] | null = null;
  @observable userStatus = AccountStatusEnum.BASIC;
  @observable userNextStatus: AccountStatusEnum = AccountStatusEnum.BASIC;

  @observable currentAccountTypeId: string | null = null;
  @observable percentageToNextAccountType: number | null = null;
  @observable amountToNextAccountType: number | null = null;

  @observable isCongratModal: boolean = false;
  @observable isStatusDescription: boolean = false;

  @observable newMTAccountInfo: null | MTCreateAccountDTO = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @action
  setNewMTAccount = (info: MTCreateAccountDTO) => {
    this.newMTAccountInfo = info;
  }

  @action
  setUser = (userData: PersonalDataDTO) => {
    this.userProfile = userData;
    this.userProfileId = userData.id;
  };

  @action
  setUserIsBonus = () => (this.isBonus = true);
  @action
  setUserNotIsBonus = () => (this.isBonus = false);

  @action
  setBonusLoading = () => (this.loadingBonus = true);
  @action
  stopBonusLoading = () => (this.loadingBonus = false);

  @action
  showBonusPopup = () => (this.isBonusPopup = true);
  @action
  hideBonusPopup = () => (this.isBonusPopup = false);

  @action
  resetBonusStore = () => {
    this.isBonus = false;
    this.bonusPercent = 0;
    this.bonusExpirationDate = 0;
  };

  @action
  getUserBonus = async (miscUrl: string) => {
    this.setBonusLoading();
    try {
      const response = await API.getUserBonus(miscUrl);
      if (
        response.responseCode === WelcomeBonusResponseEnum.Ok &&
        response.data.welcomeBonusExpirations !== null
      ) {
        const currentDate = moment().unix();

        const bonusInfo =
          response.data.welcomeBonusExpirations
            .sort(
              (a: IWelcomeBonusExpirations, b: IWelcomeBonusExpirations) =>
                a.expirationDateUtc - b.expirationDateUtc
            )
            .find(
              (data: IWelcomeBonusExpirations) =>
                data.expirationDateUtc > currentDate
            ) || response.data.welcomeBonusExpirations[0];

        this.bonusPercent = bonusInfo.bonusPercentageFromFtd;
        this.bonusExpirationDate = bonusInfo.expirationDateUtc;
        this.setUserIsBonus();
      } else {
        this.setUserNotIsBonus();
      }

      this.stopBonusLoading();
    } catch (error) {
      this.stopBonusLoading();
    }
  };

  @action
  updateStatusTypes = (data: AccountUserStatusInfo[] | null) => {
    if (data !== null && data !== undefined && data.length > 0) {
      this.statusTypes = data.sort((a, b) => a.order - b.order);
    }
  };

  @action
  setNextStatus = (currentType: AccountStatusEnum) => {
    let nextStatus = currentType;
    if (this.statusTypes === null) {
      return;
    }
    let currentIndex = this.statusTypes?.findIndex(
      (el) => el.type === currentType + 1
    );
    if (currentIndex !== -1) {
      nextStatus = this.statusTypes[currentIndex].type;
    }
    this.userNextStatus = nextStatus;
  };

  @action
  setActiveStatus = (currentAccountTypeId: string) => {
    let type: AccountStatusEnum = AccountStatusEnum.BASIC;
    if (this.statusTypes !== null) {
      let satusInfo = this.statusTypes.find(
        (status) => status.id === currentAccountTypeId
      );
      if (satusInfo?.type) {
        type = satusInfo.type;
      }
    }
    this.userStatus = type;
    this.setNextStatus(type);
  };

  @action
  openCongratModal = () => {
    this.isCongratModal = true;
  };
  @action
  closeCongratModal = () => {
    this.isCongratModal = false;
  };

  @action
  toggleStatusDescription = () => {
    this.isStatusDescription = !this.isStatusDescription;
  };

  @action
  openStatusDescription = () => {
    this.isStatusDescription = true;
  };

  @action
  closeStatusDescription = () => {
    this.isStatusDescription = false;
  };

  @action
  checkActiveAccount = async (currentAccountTypeId: string) => {
    try {
      const activeStatusId = await API.getKeyValue(
        KeysInApi.ACTIVE_ACCOUNT_STATUS,
        this.rootStore.mainAppStore.initModel.tradingUrl
      );

      if (activeStatusId && activeStatusId !== currentAccountTypeId) {
        this.openCongratModal();
      }
      return activeStatusId;
    } catch (error) {}
  };

  @action
  setKVActiveStatus = async (
    currentAccountTypeId: string,
    init: boolean = false
  ) => {
    try {
      if (init && !this.rootStore.mainAppStore.isVerification) {
        // on new user init KV Status
        const activeStatusId = await this.checkActiveAccount(currentAccountTypeId);
        if (!activeStatusId) {
          await API.setKeyValue(
            {
              key: KeysInApi.ACTIVE_ACCOUNT_STATUS,
              value: currentAccountTypeId,
            },
            this.rootStore.mainAppStore.initModel.tradingUrl
          );
        }
      } else {
        // custom save KV
        if (currentAccountTypeId) {
          await API.setKeyValue(
            {
              key: KeysInApi.ACTIVE_ACCOUNT_STATUS,
              value: currentAccountTypeId,
            },
            this.rootStore.mainAppStore.initModel.tradingUrl
          );
        }
      }
    } catch (error) {}
  };
}

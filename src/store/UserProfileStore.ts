import { IWelcomeBonusExpirations } from './../types/UserInfo';
import { observable, action } from 'mobx';
import { WelcomeBonusResponseEnum } from '../enums/WelcomeBonusResponseEnum';
import API from '../helpers/API';
import { PersonalDataDTO } from '../types/PersonalDataTypes';
import moment from 'moment';

interface ContextProps {
  userProfile: PersonalDataDTO | null;
  userProfileId: string;
  loadingBonus: boolean;
  isBonus: boolean;
  bonusPercent: number;
  bonusExpirationDate: number;
}

export class UserProfileStore implements ContextProps {
  @observable userProfile: PersonalDataDTO | null = null;
  @observable userProfileId: string = '';

  @observable loadingBonus = false;
  @observable isBonusPopup = false;
  @observable isBonus = false;

  @observable bonusPercent = 0;
  @observable bonusExpirationDate = 0;

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
  getUserBonus = async (miscUrl: string) => {
    this.setBonusLoading();
    try {
      const response = await API.getUserBonus(miscUrl);

      if (response.responseCode === WelcomeBonusResponseEnum.Ok) {
        const currentDate = moment().unix();

        if (response.data.welcomeBonusExpirations !== null) {
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
      } else {
        this.setUserNotIsBonus();
      }

      this.stopBonusLoading();
    } catch (error) {
      this.stopBonusLoading();
    }
  };
}

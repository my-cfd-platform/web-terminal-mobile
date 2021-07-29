import { observable, action } from 'mobx';
import { WelcomeBonusResponseEnum } from '../enums/WelcomeBonusResponseEnum';
import API from '../helpers/API';
import { PersonalDataDTO } from '../types/PersonalDataTypes';

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
        this.bonusPercent = response.data.welcomeBonusExpirations[0].bonusPercentageFromFtd;
        this.bonusExpirationDate = response.data.welcomeBonusExpirations[0].expirationDateUtc;
        this.setUserIsBonus();
      }

      console.log(response);
      this.stopBonusLoading();
    } catch (error) {
      this.stopBonusLoading();
    }
  };
}

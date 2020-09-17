import { observable, action } from 'mobx';
import { PersonalDataDTO } from '../types/PersonalDataTypes';

interface ContextProps {
  userProfile: PersonalDataDTO | null;
}

export class UserProfileStore implements ContextProps {
  @observable userProfile: PersonalDataDTO | null = null;
  @observable userProfileId?: string;

  @action
  setUser = (userData: PersonalDataDTO | null) => {
    this.userProfile = userData;
    this.userProfileId = userData?.id;
  }
}

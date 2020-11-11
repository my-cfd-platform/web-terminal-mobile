import { observable, action } from 'mobx';
import { PersonalDataDTO } from '../types/PersonalDataTypes';

interface ContextProps {
  userProfile: PersonalDataDTO | null;
  userProfileId: string 
}

export class UserProfileStore implements ContextProps {
  @observable userProfile: PersonalDataDTO | null = null;
  @observable userProfileId: string = '';

  @action
  setUser = (userData: PersonalDataDTO) => {
    this.userProfile = userData;
    this.userProfileId = userData.id;
  };
}

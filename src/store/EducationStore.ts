import { RootStore } from './RootStore';
import { action, observable } from 'mobx';
import {
  IEducationCourses,
  IEducationQuestion,
  IEducationQuestionsList,
} from '../types/EducationTypes';
import API from '../helpers/API';
import { WelcomeBonusResponseEnum } from '../enums/WelcomeBonusResponseEnum';
import Page from '../constants/Pages';
import { EducationResponseEnum } from '../enums/EducationResponseEnum';
import { HintEnum } from '../enums/HintEnum';
import KeysInApi from '../constants/keysInApi';

interface IEducationStore {
  educationIsLoaded: boolean;
  showPopup: boolean;
  coursesList: IEducationCourses[] | null;
  questionsList: IEducationQuestionsList | null;
  activeCourse: IEducationCourses | null;
  activeQuestion: IEducationQuestion | null;
  educationHint: HintEnum | null;
}

export class EducationStore implements IEducationStore {
  rootStore: RootStore;
  @observable educationIsLoaded: boolean = false;
  @observable coursesList: IEducationCourses[] | null = null;
  @observable questionsList: IEducationQuestionsList | null = null;
  @observable activeCourse: IEducationCourses | null = null;
  @observable activeQuestion: IEducationQuestion | null = null;
  @observable showPopup: boolean = false;
  @observable educationHint: HintEnum | null = null;

  constructor(rootStore: RootStore) {
    // makeAutoObservable(this, { rootStore: false });
    this.rootStore = rootStore;
  }

  @action
  setEducationIsLoaded = (newValue: boolean) => {
    this.educationIsLoaded = newValue;
  };

  @action
  setShowPopup = (newValue: boolean) => {
    this.showPopup = newValue;
  };

  @action
  setCoursesList = (newValue: IEducationCourses[] | null) => {
    this.coursesList = newValue;
  };

  @action
  setQuestionsList = (newValue: IEducationQuestionsList | null) => {
    this.questionsList = newValue;
  };

  @action
  setActiveCourse = (newValue: IEducationCourses | null) => {
    this.activeCourse = newValue;
  };

  @action
  setActiveQuestion = (newValue: IEducationQuestion | null) => {
    this.activeQuestion = newValue;
  };

  @action
  setHint = async (value: HintEnum | null, saveKeyValue: boolean = true) => {
    try {
      this.educationHint = value;
      saveKeyValue && API.setKeyValue(
        {
          key: KeysInApi.SHOW_HINT,
          value: value || false,
        },
        this.rootStore.mainAppStore.initModel.tradingUrl
      );
    } catch (error) {}
  };

  @action
  openHint = (value: HintEnum, saveKeyValue: boolean = true) => {
    this.setHint(value, saveKeyValue);
  };

  @action
  closeHint = () => {
    this.setHint(null);
  };

  @action
  getCourserList = async () => {
    try {
      const response = await API.getListOfCourses(
        this.rootStore.mainAppStore.initModel.miscUrl
      );
      if (response.responseCode === EducationResponseEnum.Ok) {
        const validCourseList = response.data.some(
          (item) => item.totalQuestions > 0 && item.id
        );
        if (validCourseList) {
          this.setCoursesList(response.data);
        } else {
          this.setCoursesList(null);
        }
        this.setEducationIsLoaded(true);
      } else {
        this.setEducationIsLoaded(false);
        this.setCoursesList(null);
      }
    } catch {}
  };

  @action
  openErrorModal = () => {
    this.rootStore.serverErrorPopupStore.setReloadPayload(Page.EDUCATION);
    this.rootStore.serverErrorPopupStore.openModal();
  };

  @action
  resetStore = () => {
    this.setQuestionsList(null);
    this.setCoursesList(null);
    this.setActiveCourse(null);
    this.setActiveQuestion(null);
    this.setHint(null);
  };
}

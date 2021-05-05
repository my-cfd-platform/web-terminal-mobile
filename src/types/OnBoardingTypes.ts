import { ButtonActionType } from '../enums/ButtonActionType';
import { OnBoardingResponseEnum } from '../enums/OnBoardingRsponseEnum';

export interface OnBoardingButton {
  text: string,
  action: ButtonActionType,
}

export interface OnBoardingInfo {
  responseCode: OnBoardingResponseEnum,
  data: {
    totalSteps: number,
    lottieJson: string,
    title: string,
    description: string,
    fullScreen: boolean,
    buttons: OnBoardingButton[],
  }
}

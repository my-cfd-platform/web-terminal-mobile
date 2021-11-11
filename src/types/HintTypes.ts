import { HintEnum } from './../enums/HintEnum';

export interface IPosition {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

export interface IHint {
  order: number;
  text: string;
  position: IPosition;
  positionTriangle: IPosition;
  positionTriangleDirection: 'top' | 'left' | 'bottom' | 'right';
}


export type IHintsData = {
  [key in HintEnum]: IHint[];
};
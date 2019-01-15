import { string, number } from "prop-types";

export interface IReduxLottoDataState {
  lottoDataAll: ILottoDataJson[];
  lottoDataOldestDate: number;
  lottoDataNewestDate: number;
}

export interface IReduxSelectState {
  currentBalls: number[];
}

export interface IReduxCompleteState {
  select: IReduxSelectState;
}

export enum EReduxActions {
  LOTTO_DATA_FETCH = "LOTTO_DATA_FETCH",
  LOTTO_DATA_SAVE_ALL = "LOTTO_DATA_SAVE_ALL",
  LOTTO_DATA_UPDATE = "LOTTO_DATA_UPDATE",
  //
  SELECT_TOGGLE = "SELECT_TOGGLE",
  SELECT_CLEAR = "SELECT_CLEAR"
}

export type TBallFrequency = [
  number, // Ball.
  number, // Frequency.
  string // Color.
];

export interface IBallData {
  title: string;
  frequencies: TBallFrequency[];
}

export interface ILottoDataCsv {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  Draw: string;
  "Bonus Ball": string;
  "2nd Bonus Ball": string;
  "Power Ball": string;
  "Draw Date": string;
}

export interface ILottoDataJson {
  position1: number;
  position2: number;
  position3: number;
  position4: number;
  position5: number;
  position6: number;
  bonusBall1: number;
  bonusBall2: number;
  powerBall: number;
  drawNum: number;
  drawDate: string;
  drawTime: number;
}

export enum ELottoJsonKeys {
  position1 = "position1",
  position2 = "position2",
  position3 = "position3",
  position4 = "position4",
  position5 = "position5",
  position6 = "position6",
  bonusBall1 = "bonusBall1",
  bonusBall2 = "bonusBall2",
  powerBall = "powerBall",
  drawNum = "drawNum",
  drawDate = "drawDate",
  drawTime = "drawTime"
}

export interface ICombinations {
  balls: [
    number, // Ball.
    string // Color.
  ][];
  frequency: number;
}

export interface IComboData {
  title: string;
  combinations: ICombinations[];
}

export interface IDrawItem {
  drawNum: number;
  balls: [
    number, // Ball.
    string // Color.
  ][];
}

export interface IDrawData {
  title: string;
  draws: IDrawItem[];
}

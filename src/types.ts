export interface IReduxLottoDataState {
  lottoDataAll: ILottoDataJson[];
  lottoDataTotalItems: number;
  //
  lottoDataOldestDate: number; // Milliseconds.
  lottoDataNewestDate: number; // Milliseconds.
  //
  lottoDataIsFetching: boolean;
}

export interface IReduxRangeDataState {
  rangeDataAll: ILottoDataJson[];
  rangeDataTotalItems: number;
  //
  rangeDataBaseBalls: IBallData[];
  rangeDataPowerBalls: IBallData[];
  rangeDataDraws: IDrawData[];
  //
  rangeDataOldest: number; // Milliseconds.
  rangeDataNewest: number; // Milliseconds.
}

export interface IReduxCombinationsState {
  combinationsData: IComboData[];
  combinationAssociations: TAssociationData[];
  combinationsIsCalculating: boolean;
}

export interface IReduxSelectState {
  currentBalls: number[];
}

export interface IReduxCompleteState {
  lottoData: IReduxLottoDataState;
  rangeData: IReduxRangeDataState;
  combinations: IReduxCombinationsState;
  select: IReduxSelectState;
}

export enum EReduxActions {
  LOTTO_DATA_FETCH = "LOTTO_DATA_FETCH",
  LOTTO_DATA_SAVE_ALL = "LOTTO_DATA_SAVE_ALL",
  //
  RANGE_DATA_UPDATE = "RANGE_DATA_UPDATE",
  //
  SELECT_TOGGLE = "SELECT_TOGGLE",
  SELECT_CLEAR = "SELECT_CLEAR",
  //
  COMBINATIONS_CALCULATE = "COMBINATIONS_CALCULATE",
  COMBINATIONS_UPDATE = "COMBINATIONS_UPDATE"
}

// export type TBallFrequency = [
//   number, // Ball.
//   number, // Frequency.
//   string //  Color.
// ];

export interface IBallFrequency {
  frequency: number;
  balls: [
    number, // Ball.
    string //  Color.
  ][];
}

export interface IBallData {
  title: string;
  frequencies: IBallFrequency[];
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
  frequency: number;
  matches: [
    number, // Ball.
    string // Color.
  ][][];
}

export interface IComboData {
  title: string;
  total: number;
  combinations: ICombinations[];
}

export type TAssociationData = {
  frequency: number;
  balls: [
    number, // Ball.
    string // Color.
  ][];
}[];

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

export interface IPredictionData {
  input: number[][];
  output: number[];
}

export type TPrediction = [
  number, // Ball.
  string //  Color.
][];

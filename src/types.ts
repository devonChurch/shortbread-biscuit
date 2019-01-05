export type TFrequency = [
  number, // Ball.
  number, // Frequency.
  string // Color.
];

export interface IBallData {
  title: string;
  frequencies: TFrequency[];
}

export interface IBallCsv {
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

export interface IBallJson {
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

export enum EBallKeys {
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

export interface IBallData {
  title: string;
  frequencies: [
    number, // Ball.
    number, // Frequency.
    string
  ][];
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

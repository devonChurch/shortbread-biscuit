import { IBallData, IBallCsv, IBallJson } from "./types";
import { colors } from "./statics";

export const createListFromTo = (from: number, to: number): number[] =>
  new Array(to - from + 1).fill(0).map((_, index) => from + index);

export const getBallColor = (ball: number): string => {
  switch (true) {
    case ball >= 40:
      return colors.ballPurple;
    case ball >= 30:
      return colors.ballRed;
    case ball >= 20:
      return colors.ballGreen;
    case ball >= 10:
      return colors.ballOrange;
    default:
      return colors.ballBlue;
  }
};

type Frequency = [number, number, string];

export const getFrequencies = (
  json: IBallJson[],
  columns: (
    | "position1"
    | "position2"
    | "position3"
    | "position4"
    | "position5"
    | "position6"
    | "bonusBall1"
    | "bonusBall2"
    | "powerBall"
    | "drawNum"
    | "drawDate"
    | "drawTime")[],
  max: number,
  createColor: (ball: number) => string
): Frequency[] => {
  const shell = new Array(max)
    .fill(0)
    .reduce((acc, _, index) => ({ ...acc, [`${index + 1}`]: 0 }), {});

  const frequencies = json.reduce((accFreq, row) => {
    return columns.reduce((accCol, column) => {
      const ball = row[column];
      return {
        ...accCol,
        [ball]: accCol[ball] + 1
      };
    }, accFreq);
  }, shell);

  return Object.entries(frequencies)
    .sort(([, frequencyA], [, frequencyB]) =>
      frequencyA > frequencyB ? -1 : 1
    )
    .map(
      ([ball, frequency]): Frequency => [+ball, +frequency, createColor(+ball)]
    );
};

export const sliceItemsByTime = (
  json: IBallJson[],
  fromDate: number,
  toDate: number
): IBallJson[] =>
  json.filter(({ drawTime }) => drawTime >= fromDate && drawTime <= toDate);

export const enrichJsonData = (csvJson: IBallCsv[]): IBallJson[] =>
  csvJson.map(
    ({
      1: position1, //                 "33"
      2: position2, //                 "15"
      3: position3, //                 "11"
      4: position4, //                 "2"
      5: position5, //                 "35"
      6: position6, //                 "10"
      Draw: drawNum, //              "1816"
      "Bonus Ball": bonusBall1, //     "5"
      "2nd Bonus Ball": bonusBall2, // ""
      "Power Ball": powerBall, //      "8"
      "Draw Date": drawDate //         "Saturday 29 December 2018"
    }) => ({
      position1: +position1,
      position2: +position2,
      position3: +position3,
      position4: +position4,
      position5: +position5,
      position6: +position6,
      bonusBall1: +bonusBall1,
      bonusBall2: +bonusBall2,
      powerBall: +powerBall,
      drawNum: +drawNum,
      drawDate,
      drawTime: new Date(drawDate).getTime()
    })
  );

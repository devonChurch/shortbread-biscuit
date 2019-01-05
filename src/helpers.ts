import { TFrequency, IBallData, IBallCsv, IBallJson } from "./types";
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
): TFrequency[] => {
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
      ([ball, frequency]): TFrequency => [+ball, +frequency, createColor(+ball)]
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

export const setToFromDate = (
  jsonAll: IBallJson[],
  fromDate: number,
  toDate: number
): {
  data: IBallData[];
  jsonSlice: IBallJson[];
  fromDate: number;
  toDate: number;
} => {
  const jsonSlice = sliceItemsByTime(jsonAll, fromDate, toDate);
  // prettier-ignore
  const data = [
    {title: 'Most Frequent', frequencies: getFrequencies(jsonSlice, ["position1", "position1", "position2", "position3", "position4", "position5", "position6", "bonusBall1"], 40, getBallColor) },
    {title: 'Position One', frequencies: getFrequencies(jsonSlice, ["position1"], 40, getBallColor) },
    {title: 'Position Two', frequencies: getFrequencies(jsonSlice, ["position2"], 40, getBallColor) },
    {title: 'Position Three', frequencies: getFrequencies(jsonSlice, ["position3"], 40, getBallColor) },
    {title: 'Position Four', frequencies: getFrequencies(jsonSlice, ["position4"], 40, getBallColor) },
    {title: 'Position Five', frequencies: getFrequencies(jsonSlice, ["position5"], 40, getBallColor) },
    {title: 'Position Six', frequencies: getFrequencies(jsonSlice, ["position6"], 40, getBallColor) },
    {title: 'Bonus Ball', frequencies: getFrequencies(jsonSlice, ["bonusBall1"], 40, getBallColor) },
    {title: 'Power Ball', frequencies: getFrequencies(jsonSlice, ["powerBall"], 10, () => 'blue') },
  ];

  return {
    data,
    jsonSlice,
    fromDate,
    toDate
  };
};

import {
  TBallFrequency,
  IBallData,
  IBallCsv,
  IBallJson,
  EBallKeys,
  IComboData,
  ICombinations
} from "./types";
import { colors } from "./statics";
import { Table } from "antd";
import { pathToFileURL } from "url";

// const MIN_COMBO_FREQUENCY = 3;
// const MIN_COMBO_MATCH_LENGTH = 4;

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
  columns: EBallKeys[],
  max: number,
  createColor: (ball: number) => string
): TBallFrequency[] => {
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
      ([ball, frequency]): TBallFrequency => [
        +ball,
        +frequency,
        createColor(+ball)
      ]
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
      Draw: drawNum, //                "1816"
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
  ballData: IBallData[];
  powerData: IBallData[];
  jsonSlice: IBallJson[];
} => {
  const jsonSlice = sliceItemsByTime(jsonAll, fromDate, toDate);
  const {
    position1,
    position2,
    position3,
    position4,
    position5,
    position6,
    bonusBall1,
    powerBall
  } = EBallKeys;
  // prettier-ignore
  const ballData = [
    {title: 'Most Frequent', frequencies: getFrequencies(jsonSlice, [position1, position1, position2, position3, position4, position5, position6, bonusBall1], 40, getBallColor) },
    {title: 'Ball One', frequencies: getFrequencies(jsonSlice, [position1], 40, getBallColor) },
    {title: 'Ball Two', frequencies: getFrequencies(jsonSlice, [position2], 40, getBallColor) },
    {title: 'Ball Three', frequencies: getFrequencies(jsonSlice, [position3], 40, getBallColor) },
    {title: 'Ball Four', frequencies: getFrequencies(jsonSlice, [position4], 40, getBallColor) },
    {title: 'Ball Five', frequencies: getFrequencies(jsonSlice, [position5], 40, getBallColor) },
    {title: 'Ball Six', frequencies: getFrequencies(jsonSlice, [position6], 40, getBallColor) },
    {title: 'Bonus Ball', frequencies: getFrequencies(jsonSlice, [bonusBall1], 40, getBallColor) },
  ];
  // prettier-ignore
  const powerData = [
    {title: 'Power Ball', frequencies: getFrequencies(jsonSlice, [powerBall], 10, () => 'blue') }
  ];

  return {
    ballData,
    powerData,
    jsonSlice
  };
};

export const enrichCombinationsWithColor = (
  comboData: IComboData[]
): IComboData[] =>
  comboData.map(({ title, combinations }) => ({
    title,
    combinations: combinations.map(({ frequency, balls }) => ({
      frequency,
      balls: balls.map(([ball]): [number, string] => [ball, getBallColor(ball)])
    }))
  }));

// type TComparison = number[];

// const compareRows = (
//   table: TComparison[],
//   comparison: TComparison
// ): TComparison[] =>
//   table.reduce((acc: TComparison[], row: TComparison) => {
//     const match = comparison.filter(ball => row.includes(ball)).sort();
//     const isMatch = Boolean(match.length >= MIN_COMBO_MATCH_LENGTH);

//     return isMatch ? [...acc, match] : acc;
//   }, []);

// const compareTable = (table: TComparison[]): TComparison[] =>
//   table.reduce((acc: TComparison[], row: TComparison, index) => {
//     const data = [...table.slice(0, index), ...table.slice(index + 1)];

//     return [...acc, ...compareRows(data, row)];
//   }, []);

// interface ICombinationKeys {
//   [key: string]: IComboData;
// }

// const getFrequency = (matches: TComparison[]): ICombinationKeys =>
//   matches.reduce((acc: ICombinationKeys, match: TComparison) => {
//     const key = match.join(",");
//     const hasKey = acc.hasOwnProperty(key);

//     if (hasKey) {
//       acc[key].frequency++;
//     } else {
//       acc[key] = {
//         balls: match,
//         frequency: 1
//       };
//     }

//     return acc;
//   }, {});

// const flattenSequence = (frequency: ICombinationKeys): IComboData[] =>
//   Object.values(frequency).reduce(
//     (acc: IComboData[], item: IComboData) => [
//       ...acc,
//       { balls: item.balls, frequency: item.frequency }
//     ],
//     []
//   );

// const prepareComboData = (table: IBallJson[]): TComparison[] =>
//   table.reduce(
//     (acc: TComparison[], row: IBallJson) => [
//       ...acc,
//       [
//         row.position1,
//         row.position2,
//         row.position3,
//         row.position4,
//         row.position5,
//         row.position6,
//         row.bonusBall1
//       ]
//     ],
//     []
//   );

// const sortCombinations = (table: IComboData[]): IComboData[] => {
//   const allCombinations = table
//     .filter(({ frequency }) => frequency >= MIN_COMBO_FREQUENCY)
//     .sort(({ frequency: frequencyA }, { frequency: frequencyB }) =>
//       frequencyA > frequencyB ? -1 : 1
//     )
//     .sort(({ balls: ballsA }, { balls: ballsB }) =>
//       ballsA.length > ballsB.length ? -1 : 1
//     );

//   return allCombinations.slice(0, 10);
// };

// export const createComboData = (table: IBallJson[]): IComboData[] => {
//   const prepped = prepareComboData(table);
//   const matches = compareTable(prepped);
//   const frequencies = getFrequency(matches);
//   const flattened = flattenSequence(frequencies);
//   const sorted = sortCombinations(flattened);

//   return sorted;
// };

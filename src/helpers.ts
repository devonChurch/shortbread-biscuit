import axios from "axios";
import csvToJson from "csvtojson";
import {
  TBallFrequency,
  IBallData,
  ILottoDataCsv,
  ILottoDataJson,
  ELottoJsonKeys,
  IComboData,
  IDrawItem,
  IDrawData
} from "./types";
import { colors } from "./statics";

export const fetchCsvData = () =>
  axios({
    method: "get",
    url: "lotto-numbers.csv"
  });

export const getTimeNow = () => new Date().getTime();

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
  json: ILottoDataJson[],
  columns: ELottoJsonKeys[],
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
  json: ILottoDataJson[],
  fromDate: number,
  toDate: number
): ILottoDataJson[] =>
  json.filter(({ drawTime }) => drawTime >= fromDate && drawTime <= toDate);

export const enrichJsonData = (csvJson: ILottoDataCsv[]): ILottoDataJson[] =>
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

export const convertLottoCsvDataToJson = async (
  rawCsvData: string
): Promise<ILottoDataJson[]> => {
  const csvJson = await csvToJson().fromString(rawCsvData);

  return enrichJsonData(csvJson);
};

export const extractDateBoundsFromLottoData = (
  lottoData: ILottoDataJson[]
) => ({
  oldest: lottoData.slice(-1)[0].drawTime,
  newest: lottoData[0].drawTime
});

export const setToFromDate = (
  jsonAll: ILottoDataJson[],
  fromDate: number,
  toDate: number
): {
  ballData: IBallData[];
  powerData: IBallData[];
  jsonSlice: ILottoDataJson[];
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
  } = ELottoJsonKeys;
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

const createDrawItem = ({
  position1,
  position2,
  position3,
  position4,
  position5,
  position6,
  bonusBall1,
  powerBall,
  drawNum
}: ILottoDataJson): IDrawItem => ({
  drawNum,
  balls: [
    [position1, getBallColor(position1)],
    [position2, getBallColor(position2)],
    [position3, getBallColor(position3)],
    [position4, getBallColor(position4)],
    [position5, getBallColor(position5)],
    [position6, getBallColor(position6)],
    [bonusBall1, getBallColor(bonusBall1)],
    [powerBall, "blue"]
  ]
});

interface IDrawShell {
  segments: IDrawData[];
  segment: IDrawData;
}

export const createDrawData = (table: ILottoDataJson[]): IDrawData[] => {
  const itemsPerCard = 50;
  const shell = {
    segments: [],
    segment: { title: "", draws: [] }
  };

  const { segments } = table.reduce(
    (acc, row, index) => {
      const increment = index + 1;
      const { segments, segment } = acc;
      const { draws } = segment;
      const { drawNum } = row;
      const totalDraws = draws.length;
      const isFull = totalDraws > itemsPerCard || increment === table.length;

      if (isFull) {
        segments.push({
          title: `Draw ${drawNum + 1 + (totalDraws - 1)} to ${drawNum + 1}`,
          draws
        });
        segment.draws = [createDrawItem(row)];
      } else {
        segment.draws.push(createDrawItem(row));
      }

      return { segments, segment };
    },
    shell as IDrawShell
  );

  return segments;
};

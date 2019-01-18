import { EReduxActions as actions, ILottoDataJson, IComboData } from "../types";

export const lottoDataFetch = () => ({
  type: actions.LOTTO_DATA_FETCH
});

export const lottoDataSaveAll = (lottoDataAll: ILottoDataJson[]) => ({
  type: actions.LOTTO_DATA_SAVE_ALL,
  payload: lottoDataAll
});

export const rangeDataUpdateBase = ({
  lottoDataAll,
  rangeDataOldest,
  rangeDataNewest
}: {
  lottoDataAll: ILottoDataJson[];
  rangeDataOldest: number;
  rangeDataNewest: number;
}) => ({
  type: actions.RANGE_DATA_UPDATE,
  payload: { lottoDataAll, rangeDataOldest, rangeDataNewest }
});

export const combinationsCalculate = () => ({
  type: actions.COMBINATIONS_CALCULATE
});

export const combinationsUpdate = (combinationsData: IComboData[]) => ({
  type: actions.COMBINATIONS_UPDATE,
  payload: combinationsData
});

export const selectToggle = (ballNum: number) => ({
  type: actions.SELECT_TOGGLE,
  payload: ballNum
});

export const selectClear = () => ({
  type: actions.SELECT_CLEAR
});

import { EReduxActions as actions, ILottoDataJson } from "../types";
import { enrichJsonData } from "../helpers";

export const lottoDataFetch = () => ({
  type: actions.LOTTO_DATA_FETCH
});

export const lottoDataSaveAll = (lottoDataAll: ILottoDataJson[]) => ({
  type: actions.LOTTO_DATA_SAVE_ALL,
  payload: lottoDataAll
});

export const rangeDataCreate = ({
  lottoDataAll,
  rangeDataOldest,
  rangeDataNewest
}: {
  lottoDataAll: ILottoDataJson[];
  rangeDataOldest: number;
  rangeDataNewest: number;
}) => ({
  type: actions.RANGE_DATA_CREATE,
  payload: { lottoDataAll, rangeDataOldest, rangeDataNewest }
});

export const selectToggle = (ballNum: number) => ({
  type: actions.SELECT_TOGGLE,
  payload: ballNum
});

export const selectClear = () => ({
  type: actions.SELECT_CLEAR
  // payload: 0
});

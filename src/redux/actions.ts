import { EReduxActions as actions, ILottoDataJson } from "../types";
import { enrichJsonData } from "../helpers";

export const lottoDataFetch = () => ({
  type: actions.LOTTO_DATA_FETCH
});

// export const lottoDataSaveAll = (lottoDataAll: ILottoDataJson[]) => {
//   return {
//     type: actions.LOTTO_DATA_SAVE_ALL,
//     payload: lottoDataAll
//   };
// };

export const selectToggle = (ballNum: number) => ({
  type: actions.SELECT_TOGGLE,
  payload: ballNum
});

export const selectClear = () => ({
  type: actions.SELECT_CLEAR
  // payload: 0
});

import {
  IReduxLottoDataState as IState,
  EReduxActions as actions,
  ILottoDataJson
} from "../../types";
import { extractDateBoundsFromLottoData } from "../../helpers";

interface IAction {
  type: actions.LOTTO_DATA_SAVE_ALL;
  payload: ILottoDataJson[];
}

const initialState = {
  lottoDataAll: [],
  lottoDataTotalItems: 0,
  //
  lottoDataOldestDate: 0,
  lottoDataNewestDate: 0,
  //
  lottoDataIsFetching: true
};

export default function(state: IState = initialState, action: IAction) {
  switch (action.type) {
    case actions.LOTTO_DATA_SAVE_ALL: {
      const lottoDataAll = action.payload;
      const {
        oldest: lottoDataOldestDate,
        newest: lottoDataNewestDate
      } = extractDateBoundsFromLottoData(lottoDataAll);
      return {
        ...state,
        lottoDataAll,
        lottoDataTotalItems: lottoDataAll.length,
        lottoDataOldestDate,
        lottoDataNewestDate,
        lottoDataIsFetching: false
      };
    }
    default:
      return state;
  }
}

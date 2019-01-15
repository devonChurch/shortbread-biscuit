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
  lottoDataOldestDate: 0,
  lottoDataNewestDate: 0
};

export default function(state: IState = initialState, action: IAction) {
  switch (action.type) {
    case actions.LOTTO_DATA_SAVE_ALL: {
      console.log("lotto data action", action);
      const lottoDataAll = action.payload;
      const {
        oldest: lottoDataOldestDate,
        newest: lottoDataNewestDate
      } = extractDateBoundsFromLottoData(lottoDataAll);
      return {
        ...state,
        lottoDataAll,
        lottoDataOldestDate,
        lottoDataNewestDate
      };
    }
    default:
      return state;
  }
}

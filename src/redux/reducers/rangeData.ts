import {
  IReduxRangeDataState as IState,
  EReduxActions as actions,
  ILottoDataJson
} from "../../types";
import { extractRangeDataFromLottoData } from "../../helpers";

interface IAction {
  type: actions.RANGE_DATA_UPDATE;
  payload: {
    lottoDataAll: ILottoDataJson[];
    rangeDataOldest: number; // Milliseconds.
    rangeDataNewest: number; // Milliseconds.
  };
}

const initialState = {
  rangeDataAll: [],
  rangeDataTotalItems: 0,
  //
  rangeDataBaseBalls: [],
  rangeDataPowerBalls: [],
  rangeDataDraws: [],
  //
  rangeDataOldest: 0,
  rangeDataNewest: 0
};

export default function(state: IState = initialState, action: IAction) {
  switch (action.type) {
    case actions.RANGE_DATA_UPDATE: {
      const { lottoDataAll, rangeDataOldest, rangeDataNewest } = action.payload;
      const {
        rangeData: rangeDataAll,
        baseBalls: rangeDataBaseBalls,
        powerBalls: rangeDataPowerBalls,
        rangeDataDraws: rangeDataDraws
      } = extractRangeDataFromLottoData(
        lottoDataAll,
        rangeDataOldest,
        rangeDataNewest
      );

      return {
        ...state,
        rangeDataAll,
        rangeDataTotalItems: rangeDataAll.length,
        //
        rangeDataOldest,
        rangeDataNewest,
        //
        rangeDataBaseBalls,
        rangeDataPowerBalls,
        rangeDataDraws
      };
    }
    default:
      return state;
  }
}

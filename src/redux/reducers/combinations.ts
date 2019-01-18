import {
  IReduxCombinationsState as IState,
  EReduxActions as actions,
  IComboData
} from "../../types";

interface IAction {
  type: actions.COMBINATIONS_UPDATE | actions.COMBINATIONS_CALCULATE;
  payload: IComboData[];
}

const initialState = {
  combinationsData: [],
  combinationsIsCalculating: true
};

export default function(state: IState = initialState, action: IAction) {
  switch (action.type) {
    case actions.COMBINATIONS_UPDATE: {
      return {
        ...state,
        combinationsData: action.payload,
        combinationsIsCalculating: false
      };
    }
    case actions.COMBINATIONS_CALCULATE: {
      return {
        ...state,
        combinationsIsCalculating: true
      };
    }
    default:
      return state;
  }
}

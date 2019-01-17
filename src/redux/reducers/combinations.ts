import {
  IReduxCombinationsState as IState,
  EReduxActions as actions,
  IComboData
} from "../../types";

interface IAction {
  type: actions.COMBINATIONS_UPDATE;
  payload: IComboData[];
}

const initialState = {
  combinationsData: []
};

export default function(state: IState = initialState, action: IAction) {
  switch (action.type) {
    case actions.COMBINATIONS_UPDATE: {
      return {
        ...state,
        combinationsData: action.payload
      };
    }
    default:
      return state;
  }
}

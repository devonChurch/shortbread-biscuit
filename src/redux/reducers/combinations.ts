import {
  IReduxCombinationsState as IState,
  EReduxActions as actions,
  IComboData,
  TAssociationData
} from "../../types";

interface IAction {
  type: actions.COMBINATIONS_UPDATE | actions.COMBINATIONS_CALCULATE;
  payload: {
    combinations: IComboData[];
    associations: TAssociationData[];
  };
}

const initialState = {
  combinationsData: [],
  combinationAssociations: [],
  combinationsIsCalculating: true
};

export default function(state: IState = initialState, action: IAction) {
  switch (action.type) {
    case actions.COMBINATIONS_UPDATE: {
      const { combinations, associations } = action.payload;
      return {
        ...state,
        combinationsData: combinations,
        combinationAssociations: associations,
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

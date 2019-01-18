import {
  IReduxSelectState as IState,
  EReduxActions as actions
} from "../../types";

interface IAction {
  type: actions.SELECT_TOGGLE | actions.SELECT_CLEAR;
  payload: number;
}

const initialState = {
  currentBalls: []
};

export default function(state: IState = initialState, action: IAction) {
  switch (action.type) {
    case actions.SELECT_TOGGLE: {
      const prevBalls = state.currentBalls;
      const toggledBall = action.payload;
      const isAlreadyActive = prevBalls.includes(toggledBall);
      const nextBalls = isAlreadyActive
        ? prevBalls.filter(prevItem => prevItem !== toggledBall)
        : [...prevBalls, toggledBall];

      return {
        ...state,
        currentBalls: nextBalls
      };
    }
    case actions.SELECT_CLEAR: {
      return {
        ...state,
        currentBalls: []
      };
    }
    default:
      return state;
  }
}

import { EReduxActions as actions } from "../types";

export const selectToggle = (ballNum: number) => ({
  type: actions.SELECT_TOGGLE,
  payload: ballNum
});

export const selectClear = () => ({
  type: actions.SELECT_CLEAR
  // payload: 0
});

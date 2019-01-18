import { combineReducers } from "redux";
import select from "./select";
import lottoData from "./lottoData";
import rangeData from "./rangeData";
import combinations from "./combinations";

export default combineReducers({
  lottoData,
  rangeData,
  combinations,
  select
});

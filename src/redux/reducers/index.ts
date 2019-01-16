import { combineReducers } from "redux";
import select from "./select";
import lottoData from "./lottoData";
import rangeData from "./rangeData";

export default combineReducers({
  lottoData,
  rangeData,
  select
});

import { combineReducers } from "redux";
import select from "./select";
import lottoData from "./lottoData";

export default combineReducers({
  lottoData,
  select
});

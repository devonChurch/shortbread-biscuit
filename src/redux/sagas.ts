import { call, put, takeEvery, takeLatest, select } from "redux-saga/effects";
import { EReduxActions as actions } from "../types";
import { fetchCsvData, convertLottoCsvDataToJson } from "../helpers";
import { lottoDataSaveAll, rangeDataCreate } from "./actions";

function* lottoDataFetch(action: {}) {
  try {
    const response = yield call(fetchCsvData);
    const lottoDataAll = yield convertLottoCsvDataToJson(response.data);

    yield put(lottoDataSaveAll(lottoDataAll));
    const {
      lottoData: { lottoDataNewestDate }
    } = yield select();
    yield put(
      rangeDataCreate({
        lottoDataAll,
        rangeDataOldest: new Date("01/06/2018").getTime(),
        rangeDataNewest: lottoDataNewestDate
      })
    );
  } catch (error) {
    console.log("error", error);
    // yield put({ type: 'PRODUCTS_RECEIVED', products })
  }
}

function* sagas() {
  yield takeLatest(actions.LOTTO_DATA_FETCH, lottoDataFetch);
}

export default sagas;

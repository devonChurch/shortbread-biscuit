import { call, put, takeLatest, select } from "redux-saga/effects";
import { EReduxActions as actions } from "../types";
import {
  fetchCsvData,
  convertLottoCsvDataToJson,
  createCombinationsWorkerSequence,
  createErrorNotification
} from "../helpers";
import {
  lottoDataSaveAll,
  rangeDataUpdateBase,
  combinationsCalculate,
  combinationsUpdate
} from "./actions";

function* lottoDataAllFetchSaga(action: {}) {
  try {
    const response = yield call(fetchCsvData);
    const lottoDataAll = yield convertLottoCsvDataToJson(response.data);

    yield put(lottoDataSaveAll(lottoDataAll));
    const {
      lottoData: { lottoDataNewestDate }
    } = yield select();
    yield put(
      rangeDataUpdateBase({
        lottoDataAll,
        rangeDataOldest: new Date("01/06/2018").getTime(),
        rangeDataNewest: lottoDataNewestDate
      })
    );
    const {
      rangeData: { rangeDataAll }
    } = yield select();
    yield put(combinationsCalculate());
  } catch (error) {
    createErrorNotification();
  }
}

function* combinationsCalculateSaga() {
  try {
    const {
      rangeData: { rangeDataAll }
    } = yield select();
    const response = yield createCombinationsWorkerSequence(rangeDataAll);
    yield put(combinationsUpdate(response));
  } catch (error) {
    createErrorNotification();
  }
}

function* sagas() {
  yield takeLatest(actions.LOTTO_DATA_FETCH, lottoDataAllFetchSaga);
  yield takeLatest(actions.COMBINATIONS_CALCULATE, combinationsCalculateSaga);
}

export default sagas;

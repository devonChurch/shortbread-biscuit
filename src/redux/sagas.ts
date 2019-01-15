import { call, put, takeEvery, takeLatest, select } from "redux-saga/effects";
import { EReduxActions as actions } from "../types";
import { fetchCsvData, convertLottoCsvDataToJson } from "../helpers";

function* lottoDataFetch(action: {}) {
  // console.log("saga", action);
  // return [];
  try {
    const response = yield call(fetchCsvData);
    const lottoDataAll = yield convertLottoCsvDataToJson(response.data);

    yield put({ type: "LOTTO_DATA_SAVE_ALL", payload: lottoDataAll });

    const state = yield select();
    console.log(state);
  } catch (error) {
    console.log("error", error);
    // yield put({ type: 'PRODUCTS_RECEIVED', products })
  }
  //  try {
  //     const user = yield call(Api.fetchUser, action.payload.userId);
  //     yield put({type: "USER_FETCH_SUCCEEDED", user: user});
  //  } catch (e) {
  //     yield put({type: "USER_FETCH_FAILED", message: e.message});
  //  }
}

function* sagas() {
  yield takeLatest(actions.LOTTO_DATA_FETCH, lottoDataFetch);
}

export default sagas;

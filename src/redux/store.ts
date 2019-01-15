import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension";
import reducers from "./reducers";
import sagas from "./sagas";

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
  // (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
  //   (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

sagaMiddleware.run(sagas);

export default store;

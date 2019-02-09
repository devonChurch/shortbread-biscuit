import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "antd/dist/antd.css";
import { createGlobalStyle } from "./styled";
import store from "./redux/store";
import App from "./App";

const GlobalStyles = createGlobalStyle`
  .ant-card-body {
    padding: 12px !important;
  }
`;

ReactDOM.render(
  <Provider store={store}>
    <App />
    <GlobalStyles />
  </Provider>,
  document.getElementById("root")
);

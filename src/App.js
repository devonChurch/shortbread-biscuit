import React, { Component } from "react";
import axios from "axios";
import csvToJson from "csvtojson";
import logo from "./logo.svg";
import "./App.css";

// array:
// //           0  1  2  3  4
// const foo = [1, 2, 3, 4, 5]
// const bar = foo[2] // 3

// const baz  = {
//   3: 7
//   1: 6,
//   2: 2,
// };
// const zap = baz.potato // two

const getFrequency = (data, column) => {
  const shell = new Array(40)
    .fill(0)
    .reduce((acc, _, index) => ({ ...acc, [`${index + 1}`]: 0 }), {});

  const frequency = data.reduce((acc, row) => {
    const ball = row[column];
    acc[ball]++;

    return acc;
  }, shell);

  return Object.entries(frequency).sort(([, tickA], [, tickB]) =>
    tickA > tickB ? -1 : 1
  );
};

const sliceSinceDraw = (data, draw) => data.filter(row => +row["Draw"] > draw);

class App extends Component {
  constructor() {
    super();
    this.getData();
  }

  getData = async () => {
    const response = await axios({
      method: "get",
      url: "/lotto-numbers.csv"
    });

    const { data: csv } = response;
    // console.log(csv);

    const json = await csvToJson().fromString(csv);
    // console.log(json);

    const slicedData = sliceSinceDraw(json, 1756);
    const frequency = {
      1: getFrequency(slicedData, "1"),
      2: getFrequency(slicedData, "2"),
      3: getFrequency(slicedData, "3"),
      4: getFrequency(slicedData, "4"),
      5: getFrequency(slicedData, "5"),
      6: getFrequency(slicedData, "6"),
      bonus: getFrequency(slicedData, "Bonus Ball"),
      power: getFrequency(slicedData, "Power Ball")
    };

    console.log(frequency);
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;

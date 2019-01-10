import React, { Component } from "react";
import axios from "axios";
import csvToJson from "csvtojson";
import moment from "moment";
import { List, Card, Row, Col } from "antd";
import { IBallData, IBallJson, IComboData } from "./types";
import { colors, dateFormat } from "./statics";
import { setToFromDate, enrichJsonData, createComboData } from "./helpers";
import Select from "./Select";
import Time from "./Time";
import Statistic from "./Statistic";
import Combinations from "./Combinations";

interface IAppState {
  ballData: IBallData[];
  comboData: IComboData[];
  currentBalls: number[];
  fromDate: number; // Milliseconds Date(x).getTime();
  toDate: number; // Milliseconds Date(y).getTime();
  jsonAll: IBallJson[];
  jsonSlice: IBallJson[];
}

interface IAppProps {}

class App extends Component<IAppProps, IAppState> {
  state: IAppState = {
    ballData: [],
    comboData: [],
    currentBalls: [],
    fromDate: 0,
    toDate: 0,
    jsonAll: [],
    jsonSlice: []
  };

  worker: Worker;

  constructor() {
    super({} as IAppProps);
    this.worker = Worker && new Worker("worker.js");
    this.getData();
  }

  componentDidMount() {
    if (Worker) {
      this.worker.onmessage = event => {
        console.log("back from the worker...", event);
        this.setState(prevState => ({
          ...prevState,
          comboData: event.data
        }));
      };
    }
  }

  getData = async () => {
    const response = await axios({
      method: "get",
      url: "lotto-numbers.csv"
    });
    const { data: csv } = response;
    const csvJson = await csvToJson().fromString(csv);
    const enrichedJson = enrichJsonData(csvJson);
    const jsonAll = enrichedJson;
    const fromDate = enrichedJson.slice(-1)[0].drawTime;
    const toDate = enrichedJson[0].drawTime;
    const { ballData, jsonSlice } = setToFromDate(jsonAll, fromDate, toDate);

    Worker && this.worker.postMessage(jsonSlice);
    this.setState(prevState => ({
      ...prevState,
      jsonAll,
      jsonSlice,
      fromDate,
      toDate,
      ballData
    }));
  };

  toggleCurrentBall = (newBall: number): void => {
    this.setState(prevState => {
      const { currentBalls: prevBalls } = prevState;
      const isAlreadyActive = prevBalls.includes(newBall);
      const currentBalls = isAlreadyActive
        ? prevBalls.filter(prevBall => prevBall !== newBall)
        : [...prevBalls, newBall];

      return { ...prevState, currentBalls };
    });
  };

  checkIsCurrentBall = (ball: number): boolean => {
    const { currentBalls } = this.state;
    const isEmpty = !currentBalls.length;
    const isActive = currentBalls.includes(ball);

    return isEmpty || isActive;
  };

  updateFromToDates = (_: any, [fromString, toString]: [string, string]) => {
    const { jsonAll } = this.state;
    const fromDate = moment(fromString, dateFormat).valueOf();
    const toDate = moment(toString, dateFormat).valueOf();
    const { ballData, jsonSlice } = setToFromDate(jsonAll, fromDate, toDate);

    Worker && this.worker.postMessage(jsonSlice);
    this.setState(prevState => ({
      ...prevState,
      jsonSlice,
      fromDate,
      toDate,
      ballData
    }));
  };

  render() {
    const {
      fromDate,
      toDate,
      jsonAll,
      jsonSlice,
      ballData,
      comboData
    } = this.state;
    return (
      <div>
        <div
          style={{
            background: colors.bgDark,
            padding: "8px 16px"
          }}
        >
          <h1 style={{ color: "white", margin: 0 }}>Lotto Settings</h1>
          <Row type="flex" gutter={16}>
            <Col span={24} xs={24} lg={24} xxl={12} style={{ margin: "8px 0" }}>
              <Select
                handleToggle={this.toggleCurrentBall}
                checkIsActive={this.checkIsCurrentBall}
              />
            </Col>

            <Col span={24} xs={24} lg={24} xxl={12} style={{ margin: "8px 0" }}>
              <Time
                fromDate={fromDate}
                toDate={toDate}
                handleChange={this.updateFromToDates}
                currentDraws={jsonSlice.length}
                totalDraws={jsonAll.length}
              />
            </Col>
          </Row>
        </div>

        <div style={{ background: colors.bgLight, padding: "16px" }}>
          <h2>Statistics</h2>
          <List
            grid={{
              gutter: 16,
              xs: 2,
              md: 4,
              xxl: 8
            }}
            dataSource={ballData}
            renderItem={({ title, frequencies }: IBallData) => (
              <List.Item>
                <Statistic
                  title={title}
                  frequencies={frequencies}
                  handleToggle={this.toggleCurrentBall}
                  checkIsActive={this.checkIsCurrentBall}
                />
              </List.Item>
            )}
          />
          {Boolean(comboData.length) && (
            <Combinations
              comboData={comboData}
              handleToggle={this.toggleCurrentBall}
              checkIsActive={this.checkIsCurrentBall}
            />
          )}
        </div>
      </div>
    );
  }
}

export default App;

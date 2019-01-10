import React, { Component } from "react";
import axios from "axios";
import csvToJson from "csvtojson";
import moment from "moment";
import { Row, Col } from "antd";
import { IBallData, IBallJson, IComboData } from "./types";
import { colors, dateFormat } from "./statics";
import { setToFromDate, enrichJsonData } from "./helpers";
import Select from "./Select";
import Time from "./Time";
import Statistic from "./Statistic";
import Combinations from "./Combinations";
import ContentSpinner from "./ContentSpinner";

interface IAppState {
  isLoading: boolean;
  isWorking: boolean;
  ballData: IBallData[];
  powerData: IBallData[];
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
    isLoading: true,
    isWorking: true,
    ballData: [],
    powerData: [],
    comboData: [],
    currentBalls: [],
    fromDate: 0,
    toDate: 0,
    jsonAll: [],
    jsonSlice: []
  };

  worker: Worker;

  constructor(props: IAppProps) {
    super(props);
    this.worker = Worker && new Worker("worker.js");
    this.getData();
  }

  componentDidMount() {
    if (Worker) {
      this.worker.onmessage = event => {
        console.log("back from the worker...", event);
        this.setState(prevState => ({
          ...prevState,
          isWorking: false,
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
    // const fromDate = enrichedJson.slice(-1)[0].drawTime;
    const fromDate = new Date("01/06/2017").getTime();
    const toDate = enrichedJson[0].drawTime;
    const { ballData, powerData, jsonSlice } = setToFromDate(
      jsonAll,
      fromDate,
      toDate
    );

    Worker && this.worker.postMessage(jsonSlice);
    this.setState(prevState => ({
      ...prevState,
      isLoading: false,
      jsonAll,
      jsonSlice,
      fromDate,
      toDate,
      ballData,
      powerData
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
    this.setState(prevState => ({
      ...prevState,
      isWorking: true
    }));

    const { jsonAll } = this.state;
    const fromDate = moment(fromString, dateFormat).valueOf();
    const toDate = moment(toString, dateFormat).valueOf();
    const { ballData, powerData, jsonSlice } = setToFromDate(
      jsonAll,
      fromDate,
      toDate
    );

    Worker && this.worker.postMessage(jsonSlice);
    this.setState(prevState => ({
      ...prevState,
      jsonSlice,
      fromDate,
      toDate,
      ballData,
      powerData
    }));
  };

  render() {
    const {
      isLoading,
      isWorking,
      fromDate,
      toDate,
      jsonAll,
      jsonSlice,
      ballData,
      powerData,
      comboData
    } = this.state;
    return (
      <div style={{ background: colors.bgLight, minHeight: "100vh" }}>
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

        <div style={{ padding: "16px" }}>
          <Row type="flex" gutter={16}>
            <Col span={24} xs={24} style={{ margin: "8px 0" }}>
              <h2>Single Balls</h2>
            </Col>
            {isLoading ? (
              <ContentSpinner />
            ) : (
              ballData.map(({ title, frequencies }: IBallData) => (
                <Col
                  key={title}
                  span={12}
                  xs={8}
                  lg={6}
                  xxl={4}
                  style={{ margin: "8px 0" }}
                >
                  <Statistic
                    title={title}
                    frequencies={frequencies}
                    handleToggle={this.toggleCurrentBall}
                    checkIsActive={this.checkIsCurrentBall}
                  />
                </Col>
              ))
            )}
            <Col span={24} xs={24} style={{ margin: "8px 0" }}>
              <h2>Balls Combinations</h2>
            </Col>
            {isLoading || isWorking ? (
              <ContentSpinner />
            ) : (
              comboData.map(({ title, combinations }: IComboData) => (
                <Col
                  key={title}
                  span={24}
                  xs={24}
                  lg={12}
                  xxl={8}
                  style={{ margin: "8px 0" }}
                >
                  <Combinations
                    title={title}
                    combinations={combinations}
                    handleToggle={this.toggleCurrentBall}
                    checkIsActive={this.checkIsCurrentBall}
                  />
                </Col>
              ))
            )}
            <Col span={24} xs={24} style={{ margin: "8px 0" }}>
              <h2>Power Ball</h2>
            </Col>
            {isLoading ? (
              <ContentSpinner />
            ) : (
              powerData.map(({ title, frequencies }: IBallData) => (
                <Col
                  key={title}
                  span={12}
                  xs={8}
                  lg={6}
                  xxl={4}
                  style={{ margin: "8px 0" }}
                >
                  <Statistic
                    title={""}
                    frequencies={frequencies}
                    handleToggle={() => {}}
                    checkIsActive={() => true}
                  />
                </Col>
              ))
            )}
          </Row>
        </div>
      </div>
    );
  }
}

export default App;

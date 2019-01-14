import React, { Component } from "react";
import axios from "axios";
import csvToJson from "csvtojson";
import moment from "moment";
import { Row, Col } from "antd";
import { IBallData, IBallJson, IComboData, IDrawData } from "./types";
import { colors, dateFormat } from "./statics";
import {
  setToFromDate,
  enrichJsonData,
  enrichCombinationsWithColor,
  getTimeNow,
  createDrawData
} from "./helpers";
import Select from "./Select";
import Time from "./Time";
import Statistic from "./Statistic";
import Draw from "./Draw";
import Combinations from "./Combinations";
import ContentSpinner from "./ContentSpinner";
import ContentProgress from "./ContentProgress";

interface IAppState {
  isLoading: boolean;
  workerPercent: number;
  ballData: IBallData[];
  powerData: IBallData[];
  comboData: IComboData[];
  drawData: IDrawData[];
  currentBalls: number[];
  dateRangeMin: number; // Milliseconds.
  dateRangeMax: number; // Milliseconds.
  fromDate: number; //     Milliseconds.
  toDate: number; //       Milliseconds.
  jsonAll: IBallJson[];
  jsonSlice: IBallJson[];
}

interface IAppProps {}

class App extends Component<IAppProps, IAppState> {
  state: IAppState = {
    isLoading: true,
    workerPercent: 0,
    ballData: [],
    powerData: [],
    comboData: [],
    drawData: [],
    currentBalls: [],
    dateRangeMin: 0,
    dateRangeMax: 0,
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

  checkShouldProgressUpdate = (() => {
    let prevUpdate = getTimeNow();

    return () => {
      const currentUpdate = getTimeNow();
      const nextUpdate = prevUpdate + 500;
      const shouldUpdate = currentUpdate > nextUpdate;

      if (shouldUpdate) {
        prevUpdate = currentUpdate;
      }

      return shouldUpdate;
    };
  })();

  componentDidMount() {
    if (Worker) {
      this.worker.onmessage = event => {
        const { isComplete, combinations, progress } = event.data;

        if (isComplete) {
          this.setState(prevState => ({
            ...prevState,
            workerPercent: 99
          }));
          setTimeout(() => {
            this.setState(prevState => ({
              ...prevState,
              workerPercent: 100,
              comboData: enrichCombinationsWithColor(combinations)
            }));
          }, 500);
        } else if (this.checkShouldProgressUpdate()) {
          this.setState(prevState => ({
            ...prevState,
            workerPercent: Math.round(
              (progress / prevState.jsonSlice.length) * 100
            )
          }));
        }
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
    const dateRangeMin = enrichedJson.slice(-1)[0].drawTime;
    const fromDate = new Date("01/06/2018").getTime();
    const dateRangeMax = enrichedJson[0].drawTime;
    const toDate = dateRangeMax;
    const { ballData, powerData, jsonSlice } = setToFromDate(
      jsonAll,
      fromDate,
      toDate
    );
    console.log(jsonSlice);
    const drawData = createDrawData(jsonSlice);

    Worker && this.worker.postMessage({ json: jsonSlice });
    this.setState(prevState => ({
      ...prevState,
      isLoading: false,
      jsonAll,
      jsonSlice,
      dateRangeMin,
      dateRangeMax,
      fromDate,
      toDate,
      ballData,
      powerData,
      drawData
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

  clearCurrentBalls = () => {
    this.setState(prevState => ({
      ...prevState,
      currentBalls: []
    }));
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
      workerPercent: 0
    }));

    const { jsonAll } = this.state;
    const fromDate = moment(fromString, dateFormat).valueOf();
    const toDate = moment(toString, dateFormat).valueOf();
    const { ballData, powerData, jsonSlice } = setToFromDate(
      jsonAll,
      fromDate,
      toDate
    );
    const drawData = createDrawData(jsonSlice);

    Worker && this.worker.postMessage({ json: jsonSlice });
    this.setState(prevState => ({
      ...prevState,
      jsonSlice,
      fromDate,
      toDate,
      ballData,
      powerData,
      drawData
    }));
  };

  render() {
    const {
      isLoading,
      workerPercent,
      dateRangeMin,
      dateRangeMax,
      fromDate,
      toDate,
      jsonAll,
      jsonSlice,
      ballData,
      powerData,
      comboData,
      drawData,
      currentBalls
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
                handleClear={
                  Boolean(currentBalls.length)
                    ? this.clearCurrentBalls
                    : undefined
                }
              />
            </Col>

            <Col span={24} xs={24} lg={24} xxl={12} style={{ margin: "8px 0" }}>
              <Time
                dateRangeMin={dateRangeMin}
                dateRangeMax={dateRangeMax}
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
              <p style={{ maxWidth: "900px" }}>
                Looking at each <em>Lotto Ball</em> in isolation. What ball{" "}
                <strong>appeared the most</strong>? Where did each ball fall
                during the <strong>draw order</strong>?
              </p>
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
                  xxl={3}
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
              <p style={{ maxWidth: "900px" }}>
                Finding similar <em>Lotto Ball</em> combinations between each
                draw. We disregard <strong>ball order</strong> and instead{" "}
                <strong>aggregate</strong> each combination match based on{" "}
                <strong>ball values</strong>.
              </p>
            </Col>
            {isLoading ? (
              <ContentSpinner />
            ) : workerPercent < 100 ? (
              <ContentProgress percent={workerPercent} />
            ) : (
              comboData.map(({ title, combinations }: IComboData) => (
                <Col
                  key={title}
                  span={24}
                  xs={24}
                  lg={12}
                  xxl={6}
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
              <p style={{ maxWidth: "900px" }}>
                Show the most frequent appearing <em>Lotto Power Ball</em>. This
                part of the draw has no affiliation to the{" "}
                <strong>generic</strong> <em>Lotto Ball</em> references above.
              </p>
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
                  <Statistic title={""} frequencies={frequencies} />
                </Col>
              ))
            )}
            <Col span={24} xs={24} style={{ margin: "8px 0" }}>
              <h2>Draws</h2>
              <p style={{ maxWidth: "900px" }}>
                List the <em>Lotto Draws</em> in descending order{" "}
                <em>
                  (including <strong>Bonus</strong> and <strong>Power</strong>{" "}
                  Balls)
                </em>
                .
              </p>
            </Col>
            {isLoading ? (
              <ContentSpinner />
            ) : (
              drawData.map(({ title, draws }: IDrawData) => (
                <Col
                  key={title}
                  span={24}
                  xs={24}
                  lg={12}
                  xxl={6}
                  style={{ margin: "8px 0" }}
                >
                  <Draw
                    title={title}
                    draws={draws}
                    handleToggle={this.toggleCurrentBall}
                    checkIsActive={this.checkIsCurrentBall}
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

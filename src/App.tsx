import React, { Component, Fragment } from "react";
import axios from "axios";
import csvToJson from "csvtojson";
import moment from "moment";
import { List, Card, DatePicker, Icon, Menu, Row, Col } from "antd";
import { IBallData, IBallJson } from "./types";
import { colors } from "./statics";
import {
  createListFromTo,
  getBallColor,
  getFrequencies,
  sliceItemsByTime,
  enrichJsonData
} from "./helpers";
import Ball from "./Ball";

interface IAppState {
  data: IBallData[];
  currentBalls: number[];
  fromDate: number; // Milliseconds Date(x).getTime();
  toDate: number; // Milliseconds Date(y).getTime();
  jsonAll: IBallJson[];
  jsonSlice: IBallJson[];
}

class App extends Component<{}, IAppState> {
  state: IAppState = {
    data: [],
    currentBalls: [],
    fromDate: 0,
    toDate: 0,
    jsonAll: [],
    jsonSlice: []
  };

  constructor() {
    super({});
    this.getData();
  }

  getData = async () => {
    const response = await axios({
      method: "get",
      url: "/lotto-numbers.csv"
    });
    const { data: csv } = response;
    const csvJson = await csvToJson().fromString(csv);
    const enrichedJson = enrichJsonData(csvJson);
    const jsonAll = enrichedJson;
    const fromDate = enrichedJson.slice(-1)[0].drawTime;
    const toDate = enrichedJson[0].drawTime;

    this.setState(prevState => ({
      ...prevState,
      jsonAll,
      ...this.setToFromDate(jsonAll, fromDate, toDate)
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
    const fromDate = moment(fromString, "do MMMM YYYY").valueOf();
    const toDate = moment(toString, "do MMMM YYYY").valueOf();

    this.setState(prevState => ({
      ...prevState,
      ...this.setToFromDate(jsonAll, fromDate, toDate)
    }));
  };

  setToFromDate = (
    jsonAll: IBallJson[],
    fromDate: number,
    toDate: number
  ): {
    data: IBallData[];
    jsonSlice: IBallJson[];
    fromDate: number;
    toDate: number;
  } => {
    const jsonSlice = sliceItemsByTime(jsonAll, fromDate, toDate);
    // prettier-ignore
    const data = [
      {title: 'Most Frequent', frequencies: getFrequencies(jsonSlice, ["position1", "position1", "position2", "position3", "position4", "position5", "position6", "bonusBall1"], 40, getBallColor) },
      {title: 'Position One', frequencies: getFrequencies(jsonSlice, ["position1"], 40, getBallColor) },
      {title: 'Position Two', frequencies: getFrequencies(jsonSlice, ["position2"], 40, getBallColor) },
      {title: 'Position Three', frequencies: getFrequencies(jsonSlice, ["position3"], 40, getBallColor) },
      {title: 'Position Four', frequencies: getFrequencies(jsonSlice, ["position4"], 40, getBallColor) },
      {title: 'Position Five', frequencies: getFrequencies(jsonSlice, ["position5"], 40, getBallColor) },
      {title: 'Position Six', frequencies: getFrequencies(jsonSlice, ["position6"], 40, getBallColor) },
      {title: 'Bonus Ball', frequencies: getFrequencies(jsonSlice, ["bonusBall1"], 40, getBallColor) },
      {title: 'Power Ball', frequencies: getFrequencies(jsonSlice, ["powerBall"], 10, () => 'blue') },
    ];

    return {
      data,
      jsonSlice,
      fromDate,
      toDate
    };
  };

  render() {
    const { fromDate, toDate, jsonAll, jsonSlice } = this.state;
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
            <Col
              span={24}
              xs={24}
              // sm={12}
              // md={24}
              lg={24}
              // xl={8}
              xxl={12}
              style={{ margin: "8px 0" }}
            >
              <Card title="Selection" style={{ height: "100%" }}>
                {[
                  createListFromTo(1, 9),
                  createListFromTo(10, 19),
                  createListFromTo(20, 29),
                  createListFromTo(30, 39),
                  [40]
                ].map(balls => (
                  <div key={balls.join(",")}>
                    {balls.map(ball => (
                      <span
                        key={ball}
                        style={{
                          opacity: this.checkIsCurrentBall(ball) ? 1 : 0.2,
                          marginBottom: "8px",
                          display: "inline-block"
                        }}
                      >
                        <Ball
                          style={{
                            marginBottom: "8px"
                          }}
                          ball={ball}
                          color={getBallColor(ball)}
                          handleClick={() => this.toggleCurrentBall(ball)}
                        />
                      </span>
                    ))}
                  </div>
                ))}
              </Card>
            </Col>

            <Col
              span={24}
              xs={24}
              // sm={12}
              // md={24}
              lg={24}
              // xl={8}
              xxl={6}
              style={{ margin: "8px 0" }}
            >
              <Card title="Time" style={{ height: "100%" }}>
                {Boolean(fromDate && toDate) && (
                  <Fragment>
                    <DatePicker.RangePicker
                      size="large"
                      defaultValue={[
                        moment(new Date(fromDate)),
                        moment(new Date(toDate))
                      ]}
                      format={"do MMMM YYYY"}
                      onChange={this.updateFromToDates}
                    />
                    <h3 style={{ margin: "18px 0 0" }}>
                      Showing <strong>{jsonSlice.length}</strong> from a
                      possible <strong>{jsonAll.length}</strong> draws.
                    </h3>
                  </Fragment>
                )}
              </Card>
            </Col>
          </Row>
        </div>

        <div style={{ background: colors.bgLight, padding: "16px" }}>
          <h2>Statistics</h2>
          <List
            grid={{
              gutter: 16,
              xs: 2,
              // sm: 2,
              md: 4,
              // lg: 4,
              // xl: 4,
              xxl: 8
            }}
            dataSource={this.state.data}
            renderItem={({ title, frequencies }: IBallData) => (
              <List.Item>
                <Card title={title}>
                  {frequencies.map(
                    ([ball, frequency, color]) =>
                      Boolean(ball) && (
                        <div
                          key={ball}
                          style={{
                            opacity: this.checkIsCurrentBall(ball) ? 1 : 0.2
                          }}
                        >
                          <Ball
                            ball={ball}
                            color={color}
                            handleClick={() => this.toggleCurrentBall(ball)}
                          />
                          x{frequency}
                        </div>
                      )
                  )}
                </Card>
              </List.Item>
            )}
          />
        </div>
      </div>
    );
  }
}

export default App;

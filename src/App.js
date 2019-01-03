import React, { Component, Fragment } from "react";
import axios from "axios";
import csvToJson from "csvtojson";
import { List, Card, Tag, Dropdown, Button, Icon, Menu, Row, Col } from "antd";
import Ball from "./Ball";

const listFromTo = (from, to) =>
  new Array(to - from + 1).fill(0).map((_, index) => from + index);

const getBallColor = ball => {
  switch (true) {
    case ball >= 40:
      return "#6200EA";
    case ball >= 30:
      return "#E53935";
    case ball >= 20:
      return "#00BFA5";
    case ball >= 10:
      return "#FF6D00";
    default:
      return "#2962FF";
  }
};

const getFrequencies = (data, column, max, createColor) => {
  const shell = new Array(max)
    .fill(0)
    .reduce((acc, _, index) => ({ ...acc, [`${index + 1}`]: 0 }), {});

  const frequencies = data.reduce((acc, row) => {
    const ball = row[column];
    acc[ball]++;

    return acc;
  }, shell);

  return Object.entries(frequencies)
    .sort(([, frequencyA], [, frequencyB]) =>
      frequencyA > frequencyB ? -1 : 1
    )
    .map(([ball, frequency]) => [+ball, frequency, createColor(+ball)]);
};

const sliceSinceDraw = (data, draw) => data.filter(row => row.drawNum > draw);

const enrichJsonData = json =>
  json.map(
    ({
      1: position1, // : "33"
      2: position2, // : "15"
      3: position3, // : "11"
      4: position4, // : "2"
      5: position5, // : "35"
      6: position6, // : "10"
      ["Bonus Ball"]: bonusBall1, // : "5"
      ["2nd Bonus Ball"]: bonusBall2, // : ""
      ["Power Ball"]: powerBall, // : "8"
      Draw: drawNum, // : "1816"
      ["Draw Date"]: drawDate // : "Saturday 29 December 2018"
    }) => ({
      position1: +position1,
      position2: +position2,
      position3: +position3,
      position4: +position4,
      position5: +position5,
      position6: +position6,
      bonusBall1: +bonusBall1,
      bonusBall2: +bonusBall2,
      powerBall: +powerBall,
      drawNum: +drawNum,
      drawDate,
      drawtime: new Date(drawDate).getTime()
    })
  );

class App extends Component {
  state = {
    data: [],
    currentBalls: []
  };

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
    const json = await csvToJson().fromString(csv);
    const enrichedJson = enrichJsonData(json);
    console.log("enrichedJson", enrichedJson);
    const slicedData = sliceSinceDraw(enrichedJson, 1609);
    // prettier-ignore
    const data = [
      {title: 'Position One', frequencies: getFrequencies(slicedData, "position1", 40, getBallColor) },
      {title: 'Position Two', frequencies: getFrequencies(slicedData, "position2", 40, getBallColor) },
      {title: 'Position Three', frequencies: getFrequencies(slicedData, "position3", 40, getBallColor) },
      {title: 'Position Four', frequencies: getFrequencies(slicedData, "position4", 40, getBallColor) },
      {title: 'Position Five', frequencies: getFrequencies(slicedData, "position5", 40, getBallColor) },
      {title: 'Position Six', frequencies: getFrequencies(slicedData, "position6", 40, getBallColor) },
      {title: 'Bonus Ball', frequencies: getFrequencies(slicedData, "bonusBall1", 40, getBallColor) },
      {title: 'Power Ball', frequencies: getFrequencies(slicedData, "powerBall", 10, () => 'blue') },
    ];

    console.log(data);

    this.setState(prevState => ({
      ...prevState,
      data
    }));
  };

  toggleCurrentBall = newBall =>
    this.setState(prevState => {
      const { currentBalls: prevBalls } = prevState;
      const isAlreadyActive = prevBalls.includes(newBall);
      const currentBalls = isAlreadyActive
        ? prevBalls.filter(prevBall => prevBall !== newBall)
        : [...prevBalls, newBall];

      return { ...prevState, currentBalls };
    });

  checkIsCurrentBall = ball => {
    const { currentBalls } = this.state;
    const isEmpty = !currentBalls.length;
    const isActive = currentBalls.includes(ball);

    return isEmpty || isActive;
  };

  createBallMenu = () => {
    const { currentBalls } = this.state;

    return new Array(40)
      .fill(0)
      .map((_, index) => index + 1)
      .filter(ball => !currentBalls.includes(ball))
      .map(ball => (
        <Menu.Item key={ball}>
          <Icon type="user" />
          {ball}
        </Menu.Item>
      ));
  };

  render() {
    return (
      <div>
        <div
          style={{
            background: "#001529",
            padding: "20px"
          }}
        >
          <Row type="flex" gutter={16}>
            <Col
              // span={16}
              // xs={16}
              // sm={12}
              // md={16}
              lg={16}
              // xl={8}
              xxl={8}
              // style={{ padding: "10px 0" }}
            >
              <Card title="Selection">
                {[
                  listFromTo(1, 9),
                  listFromTo(10, 19),
                  listFromTo(20, 29),
                  listFromTo(30, 39),
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
          </Row>
        </div>

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
          style={{ background: "#f0f2f5", padding: "20px" }}
          dataSource={this.state.data}
          renderItem={({ title, frequencies }) => (
            <List.Item>
              <Card title={title}>
                {frequencies.map(([ball, frequency, color]) => (
                  <div
                    key={ball}
                    style={{ opacity: this.checkIsCurrentBall(ball) ? 1 : 0.2 }}
                  >
                    <Ball
                      ball={ball}
                      color={color}
                      handleClick={() => this.toggleCurrentBall(ball)}
                    />
                    x{frequency}
                  </div>
                ))}
              </Card>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default App;

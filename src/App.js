import React, { Component, Fragment } from "react";
import axios from "axios";
import csvToJson from "csvtojson";
import { List, Card, Tag } from "antd";
import "antd/dist/antd.css";

const getBallColor = ball => {
  switch (true) {
    case ball >= 40:
      return "#6200EA";
    case ball >= 30:
      return "#E53935";
    case ball >= 20:
      return "#00E676";
    case ball >= 10:
      return "#FF6D00";
    default:
      return "#2962FF";
  }
};

const checkIsPower = title => title.toLowerCase().includes("power");

const getFrequencies = (data, column, max) => {
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
    .map(([ball, frequency]) => [+ball, +frequency]);
};

const sliceSinceDraw = (data, draw) => data.filter(row => +row["Draw"] > draw);

class App extends Component {
  state = {
    data: [],
    currentTag: null
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
    const slicedData = sliceSinceDraw(json, 1609);
    // prettier-ignore
    const data = [
      {title: 'Position One', frequencies: getFrequencies(slicedData, "1", 40) },
      {title: 'Position Two', frequencies: getFrequencies(slicedData, "2", 40) },
      {title: 'Position Three', frequencies: getFrequencies(slicedData, "3", 40) },
      {title: 'Position Four', frequencies: getFrequencies(slicedData, "4", 40) },
      {title: 'Position Five', frequencies: getFrequencies(slicedData, "5", 40) },
      {title: 'Position Six', frequencies: getFrequencies(slicedData, "6", 40) },
      {title: 'Bonus Ball', frequencies: getFrequencies(slicedData, "Bonus Ball", 40) },
      {title: 'Power Ball', frequencies: getFrequencies(slicedData, "Power Ball", 10) },
    ];

    console.log(data);

    this.setState(prevState => ({
      ...prevState,
      data
    }));
  };

  setCurrentTag = ball =>
    this.setState(prevState => ({
      ...prevState,
      currentTag: prevState.currentTag === ball ? null : ball
    }));

  checkIsCurrentBall = ball =>
    this.state.currentTag === ball || this.state.currentTag == null;

  render() {
    return (
      <div>
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
          style={{ padding: "20px" }}
          dataSource={this.state.data}
          renderItem={({ title, frequencies }) => (
            <List.Item>
              <Card title={title}>
                {frequencies.map(([ball, frequency]) => (
                  <div
                    style={{ opacity: this.checkIsCurrentBall(ball) ? 1 : 0.2 }}
                  >
                    <Tag
                      key={ball}
                      color={checkIsPower(title) ? "blue" : getBallColor(ball)}
                      style={{ minWidth: "50px" }}
                      onClick={() => this.setCurrentTag(ball)}
                    >
                      #{ball}
                    </Tag>
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

import React, { SFC } from "react";
import { Card } from "antd";
import { IPredictionData, TPrediction } from "./types";
import { getBallColor } from "./helpers";
import predictionsData from "./predictions.json";
import Ball from "./Ball";

const { oneToSixBalls, bounsBall, powerBall } = (() => {
  const [
    one,
    two,
    three,
    four,
    five,
    six,
    bonus,
    power
  ]: TPrediction = (predictionsData as IPredictionData[])
    .slice(-1)[0]
    .output.map((ball): [number, string] => [ball, getBallColor(ball)]);

  return {
    oneToSixBalls: [one, two, three, four, five, six],
    bounsBall: bonus,
    powerBall: power
  };
})();

interface IProps {
  handleToggle: (ball: number) => void;
  checkIsActive: (ball: number) => boolean;
}

const Prediction: SFC<IProps> = ({ checkIsActive, handleToggle }) => (
  <Card>
    <div>
      <h4 style={{ marginBottom: "8px" }}>Position One to Six</h4>

      {oneToSixBalls.map(([ball, color]) => (
        <span
          key={ball}
          style={{
            opacity: checkIsActive(ball) ? 1 : 0.2
          }}
        >
          <Ball ball={ball} color={color} handleClick={handleToggle} />
        </span>
      ))}
    </div>
    <div>
      <h4 style={{ margin: "16px 0 8px" }}>Bonus Ball</h4>
      {(([ball, color]) => (
        <span
          style={{
            opacity: checkIsActive(ball) ? 1 : 0.2
          }}
        >
          <Ball ball={ball} color={color} handleClick={handleToggle} />
        </span>
      ))(bounsBall)}
    </div>
    <div>
      <h4 style={{ margin: "16px 0 8px" }}>Power Ball</h4>
      {(([ball, color]) => (
        <span
          style={{
            opacity: checkIsActive(ball) ? 1 : 0.2
          }}
        >
          <Ball ball={ball} color={color} handleClick={handleToggle} />
        </span>
      ))(powerBall)}
    </div>
  </Card>
);

export default Prediction;

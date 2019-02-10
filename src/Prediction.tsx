import React, { SFC } from "react";
import { Card } from "antd";
import { IPredictionData, TPrediction } from "./types";
import { colors } from "./statics";
import { getBallColor } from "./helpers";
import predictionsData from "./predictions.json";
import Ball from "./Ball";
import BallsList from "./Balls";

const balls: TPrediction = (predictionsData as IPredictionData[])
  .slice(-1)[0]
  .output.map(
    (ball, index): [number, string] => [
      ball,
      index === 7 ? colors.ballPower : getBallColor(ball)
    ]
  );

interface IProps {
  handleToggle: (ball: number) => void;
  checkIsActive: (ball: number) => boolean;
}

const Prediction: SFC<IProps> = ({ checkIsActive, handleToggle }) => (
  <Card>
    <BallsList>
      {balls.map(
        ([ball, color], index) =>
          Boolean(ball) && (
            <Ball
              key={index} // Not the ball number encase numbers are duplicated.
              ball={ball}
              color={color}
              handleClick={handleToggle}
              isActive={!checkIsActive || checkIsActive(ball)}
            />
          )
      )}
    </BallsList>
  </Card>
);

export default Prediction;

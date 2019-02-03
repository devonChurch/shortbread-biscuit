import React, { SFC, Fragment } from "react";
import { Card } from "antd";
import { IBallData } from "./types";
import Ball, { Detail } from "./Ball";
import BallsList, { BallsFrequecy } from "./Balls";

interface IStatistic {
  title: IBallData["title"];
  frequencies: IBallData["frequencies"];
  handleToggle?: (ball: number) => void;
  checkIsActive?: (ball: number) => boolean;
}

const Statistic: SFC<IStatistic> = ({
  title,
  frequencies,
  handleToggle,
  checkIsActive
}) => (
  <Card title={title}>
    <BallsFrequecy>
      {frequencies.map(({ frequency, balls }) => (
        <Fragment key={frequency}>
          <Detail>x{frequency}</Detail>
          <div>
            <BallsList>
              {balls.map(
                ([ball, color]) =>
                  Boolean(ball) && (
                    <Ball
                      key={ball}
                      ball={ball}
                      color={color}
                      handleClick={handleToggle}
                      isActive={!checkIsActive || checkIsActive(ball)}
                    />
                  )
              )}
            </BallsList>
          </div>
        </Fragment>
      ))}
    </BallsFrequecy>
    {/* {frequencies.map(
      ([ball, frequency, color]) =>
        Boolean(ball) && (
          <div key={ball}>
            <Ball
              ball={ball}
              color={color}
              handleClick={handleToggle}
              isActive={!checkIsActive || checkIsActive(ball)}
            />
            x{frequency}
          </div>
        )
    )} */}
  </Card>
);

export default Statistic;

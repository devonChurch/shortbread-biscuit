import React, { SFC } from "react";
import { Card } from "antd";
import { IBallData } from "./types";
import Ball from "./Ball";

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
    {frequencies.map(
      ([ball, frequency, color]) =>
        Boolean(ball) && (
          <div
            key={ball}
            style={{
              opacity: !checkIsActive || checkIsActive(ball) ? 1 : 0.2
            }}
          >
            <Ball ball={ball} color={color} handleClick={handleToggle} />x
            {frequency}
          </div>
        )
    )}
  </Card>
);

export default Statistic;

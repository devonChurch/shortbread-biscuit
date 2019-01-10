import React, { SFC } from "react";
import { Card } from "antd";
import { createListFromTo, getBallColor } from "./helpers";
import Ball from "./Ball";

interface ISelect {
  handleToggle: (ball: number) => void;
  checkIsActive: (ball: number) => boolean;
}

const optionsList = [
  createListFromTo(1, 9),
  createListFromTo(10, 19),
  createListFromTo(20, 29),
  createListFromTo(30, 39),
  [40]
];

const Select: SFC<ISelect> = ({ handleToggle, checkIsActive }) => (
  <Card title="Selection" style={{ height: "100%" }}>
    {optionsList.map(balls => (
      <div key={balls.join(",")}>
        {balls.map(ball => (
          <span
            key={ball}
            style={{
              opacity: checkIsActive(ball) ? 1 : 0.2,
              display: "inline-block"
            }}
          >
            <Ball
              ball={ball}
              color={getBallColor(ball)}
              handleClick={() => handleToggle(ball)}
            />
          </span>
        ))}
      </div>
    ))}
  </Card>
);

export default Select;

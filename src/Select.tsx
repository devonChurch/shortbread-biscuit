import React, { SFC } from "react";
import { Card, Button, Icon } from "antd";
import { createListFromTo, getBallColor } from "./helpers";
import Ball from "./Ball";

interface ISelect {
  handleToggle: (ball: number) => void;
  handleClear?: () => void;
  checkIsActive: (ball: number) => boolean;
}

const optionsList = [
  createListFromTo(1, 9),
  createListFromTo(10, 19),
  createListFromTo(20, 29),
  createListFromTo(30, 39),
  [40]
];

const Select: SFC<ISelect> = ({ handleToggle, handleClear, checkIsActive }) => (
  <Card title="Selection" style={{ height: "100%" }}>
    {handleClear && (
      <Button
        type="default"
        icon="close"
        size="small"
        onClick={handleClear}
        style={{
          position: "absolute",
          right: "16px",
          top: "16px"
        }}
      >
        Clear
      </Button>
    )}
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

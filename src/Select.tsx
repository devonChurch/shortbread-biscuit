import React, { SFC } from "react";
import { Card, Button, Icon } from "antd";
import { createListFromTo, getBallColor } from "./helpers";
import Ball from "./Ball";
import BallsList, { BallsStack } from "./Balls";

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
    <BallsStack>
      {optionsList.map(balls => (
        <BallsList key={balls.join(",")}>
          {balls.map(ball => (
            <Ball
              key={ball}
              ball={ball}
              color={getBallColor(ball)}
              isActive={checkIsActive(ball)}
              handleClick={() => handleToggle(ball)}
            />
          ))}
        </BallsList>
      ))}
    </BallsStack>
  </Card>
);

export default Select;

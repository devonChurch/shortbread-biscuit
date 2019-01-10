import React, { SFC, Fragment } from "react";
import { Card } from "antd";
import { IComboData } from "./types";
import Ball from "./Ball";

interface ICombinations {
  title: string;
  combinations: IComboData["combinations"];
  handleToggle: (ball: number) => void;
  checkIsActive: (ball: number) => boolean;
}

const Combinations: SFC<ICombinations> = ({
  title,
  combinations,
  handleToggle,
  checkIsActive
}) => (
  <Card title={title}>
    {combinations.map(({ balls, frequency }) => (
      <div key={balls.join(",")}>
        {balls.map(ball => (
          <span
            key={ball}
            style={{
              opacity: checkIsActive(ball) ? 1 : 0.2
            }}
          >
            <Ball
              ball={ball}
              color={"blue"}
              handleClick={() => handleToggle(ball)}
            />
          </span>
        ))}
        x{frequency}
      </div>
    ))}
  </Card>
);

export default Combinations;

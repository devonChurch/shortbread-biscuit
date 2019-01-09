import React, { SFC } from "react";
import { Card } from "antd";
import { IComboData } from "./types";
import Ball from "./Ball";

interface ICombinations {
  comboData: IComboData[];
  handleToggle: (ball: number) => void;
  checkIsActive: (ball: number) => boolean;
}

const Combinations: SFC<ICombinations> = ({
  comboData,
  handleToggle,
  checkIsActive
}) => (
  <Card title="Combinations">
    {comboData.map(({ balls, frequency }) => (
      <div key={balls.join(",")}>
        <span style={{ display: "inline-block", minWidth: "30px" }}>
          x{frequency}
        </span>{" "}
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
      </div>
    ))}
  </Card>
);

export default Combinations;

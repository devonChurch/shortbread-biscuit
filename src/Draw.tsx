import React, { SFC } from "react";
import { Card } from "antd";
import { IDrawData } from "./types";
import Ball from "./Ball";

interface IDraw extends IDrawData {
  handleToggle: (ball: number) => void;
  checkIsActive: (ball: number) => boolean;
}

const Draw: SFC<IDraw> = ({ title, draws, handleToggle, checkIsActive }) => (
  <Card title={title}>
    {draws.map(({ drawNum, balls }) => (
      <div key={drawNum}>
        <span style={{ display: "inline-block", minWidth: "50px" }}>
          #{drawNum}
        </span>
        {balls.map(([ball, color], index) =>
          Boolean(ball) && index === 7 ? (
            <Ball key="bonus" ball={ball} color={color} />
          ) : (
            <span
              key={ball}
              style={{
                opacity: checkIsActive(ball) ? 1 : 0.2
              }}
            >
              <Ball ball={ball} color={color} handleClick={handleToggle} />
            </span>
          )
        )}
      </div>
    ))}
  </Card>
);

export default Draw;

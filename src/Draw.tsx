import React, { SFC, Fragment } from "react";
import { Card } from "antd";
import { IDrawData } from "./types";
import Ball, { Detail } from "./Ball";
import BallsList, { BallsDraw, BallsGroup } from "./Balls";

interface IDraw extends IDrawData {
  handleToggle: (ball: number) => void;
  checkIsActive: (ball: number) => boolean;
}

const Draw: SFC<IDraw> = ({ title, draws, handleToggle, checkIsActive }) => (
  <Card title={title}>
    <BallsDraw>
      {draws.map(({ drawNum, balls }) => (
        <Fragment key={drawNum}>
          <Detail>#{drawNum}</Detail>
          <BallsList>
            {balls.map(([ball, color], index) =>
              Boolean(ball) && index === 7 ? (
                <Ball key="bonus" ball={ball} color={color} />
              ) : (
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
        </Fragment>
      ))}
    </BallsDraw>
  </Card>
);

export default Draw;

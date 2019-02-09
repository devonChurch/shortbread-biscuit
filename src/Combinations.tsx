import React, { SFC, Fragment } from "react";
import { Card } from "antd";
import { IComboData } from "./types";
import Ball, { Detail } from "./Ball";
import BallsList, {
  BallsFrequecy,
  BallsGroup,
  BallsCombination
} from "./Balls";

interface ICombinations {
  title: string;
  total: number;
  combinations: IComboData["combinations"];
  handleToggle: (ball: number) => void;
  checkIsActive: (ball: number) => boolean;
}

const Combinations: SFC<ICombinations> = ({
  title,
  total,
  combinations,
  handleToggle,
  checkIsActive
}) => (
  <Card title={title}>
    <BallsFrequecy>
      {combinations.map(({ frequency, matches }) => (
        <BallsCombination key={frequency}>
          <Detail>x{frequency}</Detail>
          <BallsGroup total={total}>
            {matches.map(balls => (
              <BallsList key={balls.join(",")}>
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
            ))}
          </BallsGroup>
        </BallsCombination>
      ))}
    </BallsFrequecy>
  </Card>
);

export default Combinations;

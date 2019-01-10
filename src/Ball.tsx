import React, { SFC } from "react";
import { Tag } from "antd";

interface IBall {
  style?: {
    [key: string]: string | number;
  };
  ball: number;
  color: string;
  handleClick: (ball: number) => void;
}

const Ball: SFC<IBall> = ({ ball, color, handleClick }) => (
  <Tag
    color={color}
    style={{ margin: "4px", minWidth: "40px", textAlign: "center" }}
    onClick={() => handleClick(ball)}
  >
    {ball}
  </Tag>
);

export default Ball;

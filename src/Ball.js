import React, { Component, Fragment } from "react";
import { Tag } from "antd";

const Ball = ({ ball, color, handleClick }) => (
  <Tag
    color={color}
    style={{ minWidth: "40px", textAlign: "center" }}
    onClick={() => handleClick(ball)}
  >
    {ball}
  </Tag>
);

export default Ball;

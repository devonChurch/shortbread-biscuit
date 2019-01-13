import React, { PureComponent } from "react";
import { Tag } from "antd";

interface IState {}

interface IProps {
  style?: {
    [key: string]: string | number;
  };
  ball: number;
  color: string;
  handleClick?: (ball: number) => void;
}

class Ball extends PureComponent<IProps, IState> {
  handleClick = () => {
    const { ball, handleClick } = this.props;
    handleClick && handleClick(ball);
  };

  render() {
    const { ball, color } = this.props;
    return (
      <Tag
        color={color}
        style={{ margin: "4px", minWidth: "40px", textAlign: "center" }}
        onClick={this.handleClick}
      >
        {ball}
      </Tag>
    );
  }
}

export default Ball;

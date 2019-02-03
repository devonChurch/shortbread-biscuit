import React, { PureComponent } from "react";
import { darken, lighten, rgba } from "polished";
import styled from "./styled";

export const Detail = styled.div`
  align-items: center;
  display: flex;
  font-family: monospace;
  font-size: 14px;
  font-weight: 900;
  height: 30px;
  justify-content: center;
`;

const Button = styled(Detail)<{
  isActive: boolean;
  color: string;
  onClick: any;
}>`
  // Reset //
  border: 0;
  color: initial;
  margin: 0;
  padding: 0;

  // Custom //
  border: 1px solid ${({ color }) => color};
  border-radius: 2px;
  background: ${({ color }) => color};
  color: white;
  display: block;
  transition: all 200ms;
  width: 30px;

  ${({ isActive, color }) =>
    !isActive &&
    `
    color: ${darken(0.1, color)};
    background: ${rgba(color, 0.1)};
    border-color: ${rgba(color, 0.2)};
  `}

  ${({ onClick }) => {
    switch (true) {
      case Boolean(onClick): {
        return `
          cursor: pointer;
          pointer-events: initial;

          &:hover {
            transform: scale(1.1);
          }
        `;
      }
      default: {
        return `
          pointer-events: none;
        `;
      }
    }
  }}
`;

interface IState {}

interface IProps {
  style?: {
    [key: string]: string | number;
  };
  ball: number;
  color: string;
  isActive?: boolean;
  handleClick?: (ball: number) => void;
}

class Ball extends PureComponent<IProps, IState> {
  handleClick = () => {
    const { ball, handleClick } = this.props;
    handleClick && handleClick(ball);
  };

  render() {
    const { ball, color, isActive = true } = this.props;
    return (
      <Button
        as="button"
        color={color}
        isActive={isActive}
        onClick={this.handleClick}
      >
        {ball}
      </Button>
    );
  }
}

export default Ball;

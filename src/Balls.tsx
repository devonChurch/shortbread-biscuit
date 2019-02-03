import React, { SFC } from "react";
import styled from "./styled";

const Grid = styled.div`
  align-items: start;
  display: grid;
  grid-gap: 2px;
`;

const BallsList = styled(Grid)`
  grid-template-columns: repeat(auto-fit, 30px);
`;

export const BallsWithDrawNumber = styled(Grid)`
  grid-template-columns: auto repeat(7, 30px) 1fr;
`;

// interface IState {}

// interface IProps {}

// const Balls: SFC<IProps> = ({ children }) => <Container>{children}</Container>;

export const BallsStack = styled(Grid)`
  grid-template-columns: 1fr;
`;

export const BallsGroup = styled(Grid)<{ total: number }>`
  grid-template-columns: ${({ total }) =>
    `repeat(auto-fill, ${total * 30 + (total - 1) * 2}px);`}
  grid-gap: 10px;
`;

export const BallsAssociation = styled(Grid)`
  grid-template-columns: auto 1fr;
  grid-column-gap: 6px;
`;

export const BallsDraw = styled(BallsAssociation)``;

export const BallsFrequecy = styled(BallsAssociation)`
  grid-row-gap: 10px;
`;

export default BallsList;

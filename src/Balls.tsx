import React, { SFC } from "react";
import styled from "./styled";
import { colors } from "./statics";

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

export const BallsStack = styled(Grid)`
  grid-template-columns: 1fr;
`;

export const BallsGroup = styled(Grid)<{ total: number }>`
  grid-template-columns: ${({ total }) =>
    `repeat(auto-fill,minmax(${total * 30 + (total - 1) * 2}px, 1fr))`};
  grid-gap: 10px;
`;

export const BallsModule = styled(Grid)`
  grid-column-gap: 6px;
  grid-template-columns: auto 1fr;
  padding: 6px;
`;

export const BallsCombination = styled(Grid)`
  height: 100%;
  background: ${colors.bgLight};
  border: 2px solid ${colors.bg200};
  border-radius: 2px;
  grid-column-gap: 6px;
  grid-template-columns: auto 1fr;
  padding: 12px;
`;

export const BallsAssociation = styled(BallsCombination)`
  grid-template-columns: auto 1fr;
  grid-template-rows: repeat(auto-fill, 30px);
`;

export const BallsStatistic = styled(BallsModule)`
  grid-column-gap: 6px;
`;

export const BallsDraw = styled(BallsModule)``;

export const BallsFrequecy = styled(Grid)`
  grid-row-gap: 10px;
`;

export default BallsList;

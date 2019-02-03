import React, { SFC, Fragment } from "react";
import { Card } from "antd";
import { TAssociationData } from "./types";
import Ball, { Detail } from "./Ball";
import BallsList, { BallsAssociation, BallsGroup } from "./Balls";

interface IAssociations {
  associations: TAssociationData[];
  handleToggle: (ball: number) => void;
  checkIsActive: (ball: number) => boolean;
}

const Associations: SFC<IAssociations> = ({
  associations,
  handleToggle,
  checkIsActive
}) => (
  <Card>
    <BallsGroup total={7}>
      {associations.map((association, index) => (
        <BallsAssociation key={index}>
          {association.map(({ balls, frequency }) => (
            <Fragment key={balls.join(",")}>
              <Detail>x{frequency}</Detail>
              <div>
                <BallsList>
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
              </div>
            </Fragment>
          ))}
        </BallsAssociation>
      ))}
    </BallsGroup>
  </Card>
);

export default Associations;

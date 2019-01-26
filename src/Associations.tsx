import React, { SFC, Fragment } from "react";
import { Card } from "antd";
import { TAssociationData } from "./types";
import Ball from "./Ball";

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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gridRowGap: "40px"
      }}
    >
      {associations.map((association, index) => (
        <div key={index}>
          {association.map(({ balls, frequency }) => (
            <div key={balls.join(",")}>
              {balls.map(([ball, color]) => (
                <span
                  key={ball}
                  style={{
                    opacity: checkIsActive(ball) ? 1 : 0.2
                  }}
                >
                  <Ball ball={ball} color={color} handleClick={handleToggle} />
                </span>
              ))}
              x{frequency}
            </div>
          ))}
        </div>
      ))}
    </div>
  </Card>
);

export default Associations;

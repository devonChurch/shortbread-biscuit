import React, { SFC } from "react";
import { Card } from "antd";
import { createArrayOfLength } from "./helpers";

interface IBlobProps {
  isInline?: boolean;
  style?: {
    [key: string]: number | string;
  };
}

const SkeletonBlob: SFC<IBlobProps> = ({ style, isInline }) => (
  <div
    // className="ant-skeleton ant-skeleton-active"
    style={{ display: isInline ? "inline-block" : "block", width: "auto" }}
  >
    <span className="ant-skeleton-content" style={{ display: "block" }}>
      <span
        className="ant-skeleton-title"
        style={{
          height: "20px",
          margin: 0,
          display: "block",
          width: "100%",
          ...style
        }}
      />
    </span>
  </div>
);

export const SkeletonInput: SFC<{}> = () => (
  <SkeletonBlob
    style={{
      height: "40px"
    }}
  />
);

interface ICardProps {
  totalColumns?: number;
  totalRows?: number;
  totalCells?: number;
  isTitleHidden?: boolean;
}

export const SkeletonCard: SFC<ICardProps> = ({
  totalColumns = 1,
  totalRows = 1,
  totalCells = 1,
  isTitleHidden = false
}) => (
  <Card
    title={!isTitleHidden && <SkeletonBlob style={{ maxWidth: "120px" }} />}
  >
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gridRowGap: "40px"
      }}
    >
      {createArrayOfLength(totalColumns).map((_, columnIndex) => (
        <div key={columnIndex}>
          {createArrayOfLength(totalRows).map((_, rowIndex) => (
            <div
              key={rowIndex}
              style={{
                display: "flex",
                justifyContent: "flex-start"
              }}
            >
              {createArrayOfLength(totalCells).map((_, cellIndex) => (
                <SkeletonBlob
                  key={`${rowIndex},${cellIndex}`}
                  isInline
                  style={{
                    margin: "5px 5px 5px 0",
                    width: "42px"
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  </Card>
);

export const SkeletonBaseBalls: SFC<{}> = () => <SkeletonCard totalRows={40} />;

export const SkeletonCombinations: SFC<{}> = () => (
  <SkeletonCard totalRows={20} totalCells={4} />
);

export const SkeletonAssociations: SFC<{}> = () => (
  <SkeletonCard totalColumns={4} totalRows={20} totalCells={4} isTitleHidden />
);

export const SkeletonPowerBalls: SFC<{}> = () => (
  <SkeletonCard totalRows={10} totalCells={4} />
);

export const SkeletonDraws: SFC<{}> = () => (
  <SkeletonCard totalRows={50} totalCells={8} />
);

export default SkeletonBlob;

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
    className="ant-skeleton ant-skeleton-active"
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
  totalRows: number;
  totalCells: number;
}

export const SkeletonCard: SFC<ICardProps> = ({ totalRows, totalCells }) => (
  <Card title={<SkeletonBlob style={{ maxWidth: "120px" }} />}>
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
  </Card>
);

export const SkeletonBaseBalls: SFC<{}> = () => (
  <SkeletonCard totalRows={40} totalCells={1} />
);

export const SkeletonCombinations: SFC<{}> = () => (
  <SkeletonCard totalRows={10} totalCells={4} />
);

export const SkeletonPowerBalls: SFC<{}> = () => (
  <SkeletonCard totalRows={10} totalCells={4} />
);

export const SkeletonDraws: SFC<{}> = () => (
  <SkeletonCard totalRows={50} totalCells={8} />
);

export default SkeletonBlob;

import React, { Fragment, SFC } from "react";
import moize from "moize";
import moment from "moment";
import { Card, DatePicker, Alert, Spin } from "antd";
import { dateFormat } from "./statics";
import { SkeletonInput } from "./Skeleton";

interface ITime {
  absoluteOldestDate: number;
  absoluteNewestDate: number;
  currentOldestDate: number;
  currentNewestDate: number;
  handleChange: (_: any, fromToStrings: [string, string]) => void;
  totalCurrentDraws: number;
  totalPossibleDraws: number;
  isLoading: boolean;
}

const Time: SFC<ITime> = ({
  absoluteOldestDate,
  absoluteNewestDate,
  currentOldestDate,
  currentNewestDate,
  handleChange,
  totalCurrentDraws,
  totalPossibleDraws,
  isLoading
}) => (
  <Card title="Time" style={{ height: "100%" }}>
    <div style={{ maxWidth: "560px" }}>
      {isLoading || (!currentOldestDate || !currentNewestDate) ? (
        <SkeletonInput />
      ) : (
        <Fragment>
          <DatePicker.RangePicker
            style={{ width: "100%" }}
            size="large"
            defaultValue={[
              moment(new Date(currentOldestDate)),
              moment(new Date(currentNewestDate))
            ]}
            format={dateFormat}
            onChange={handleChange}
          />
          <Alert
            style={{ margin: "18px 0 0" }}
            type="info"
            showIcon
            message={
              <span>
                Showing <strong>{totalCurrentDraws}</strong> from a possible{" "}
                <strong>{totalPossibleDraws}</strong> draws.
              </span>
            }
          />
          {currentOldestDate < absoluteOldestDate && (
            <Alert
              style={{ margin: "18px 0 0" }}
              type="warning"
              showIcon
              message={
                <span>
                  The <strong>oldest</strong> <em>Lotto draw</em> record is{" "}
                  <strong>
                    {moment(new Date(absoluteOldestDate)).format(dateFormat)}
                  </strong>
                  .
                </span>
              }
            />
          )}
          {currentNewestDate > absoluteNewestDate && (
            <Alert
              style={{ margin: "18px 0 0" }}
              type="warning"
              showIcon
              message={
                <span>
                  The <strong>latest</strong> <em>Lotto draw</em> record is{" "}
                  <strong>
                    {moment(new Date(absoluteNewestDate)).format(dateFormat)}
                  </strong>
                  .
                </span>
              }
            />
          )}
        </Fragment>
      )}
    </div>
  </Card>
);

export default moize.reactSimple(Time);

import React, { Fragment, SFC } from "react";
import moize from "moize";
import moment from "moment";
import { Card, DatePicker, Alert, Spin } from "antd";
import { dateFormat } from "./statics";

interface ITime {
  dateRangeMin: number;
  dateRangeMax: number;
  fromDate: number;
  toDate: number;
  handleChange: (_: any, fromToStrings: [string, string]) => void;
  currentDraws: number;
  totalDraws: number;
}

const Time: SFC<ITime> = ({
  dateRangeMin,
  dateRangeMax,
  fromDate,
  toDate,
  handleChange,
  currentDraws,
  totalDraws
}) => (
  <Card title="Time" style={{ height: "100%" }}>
    {!Boolean(fromDate && toDate) ? (
      <Spin size="large" />
    ) : (
      <div style={{ maxWidth: "560px" }}>
        <DatePicker.RangePicker
          style={{ width: "100%" }}
          size="large"
          defaultValue={[moment(new Date(fromDate)), moment(new Date(toDate))]}
          format={dateFormat}
          onChange={handleChange}
        />
        <Alert
          style={{ margin: "18px 0 0" }}
          type="info"
          showIcon
          message={
            <span>
              Showing <strong>{currentDraws}</strong> from a possible{" "}
              <strong>{totalDraws}</strong> draws.
            </span>
          }
        />
        {fromDate < dateRangeMin && (
          <Alert
            style={{ margin: "18px 0 0" }}
            type="warning"
            showIcon
            message={
              <span>
                The <strong>oldest</strong> <em>Lotto draw</em> record is{" "}
                <strong>
                  {moment(new Date(dateRangeMin)).format(dateFormat)}
                </strong>
                .
              </span>
            }
          />
        )}
        {toDate > dateRangeMax && (
          <Alert
            style={{ margin: "18px 0 0" }}
            type="warning"
            showIcon
            message={
              <span>
                The <strong>latest</strong> <em>Lotto draw</em> record is{" "}
                <strong>
                  {moment(new Date(dateRangeMax)).format(dateFormat)}
                </strong>
                .
              </span>
            }
          />
        )}
      </div>
    )}
  </Card>
);

export default moize.reactSimple(Time);

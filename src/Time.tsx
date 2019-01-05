import React, { Fragment, SFC } from "react";
import moment from "moment";
import { Card, DatePicker } from "antd";
import { dateFormat } from "./statics";

interface ITime {
  fromDate: number;
  toDate: number;
  handleChange: (_: any, fromToStrings: [string, string]) => void;
  currentDraws: number;
  totalDraws: number;
}

const Time: SFC<ITime> = ({
  fromDate,
  toDate,
  handleChange,
  currentDraws,
  totalDraws
}) => (
  <Card title="Time" style={{ height: "100%" }}>
    {Boolean(fromDate && toDate) && (
      <Fragment>
        <DatePicker.RangePicker
          size="large"
          defaultValue={[moment(new Date(fromDate)), moment(new Date(toDate))]}
          format={dateFormat}
          onChange={handleChange}
        />
        <h3 style={{ margin: "18px 0 0" }}>
          Showing <strong>{currentDraws}</strong> from a possible{" "}
          <strong>{totalDraws}</strong> draws.
        </h3>
      </Fragment>
    )}
  </Card>
);

export default Time;

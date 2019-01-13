import React, { SFC } from "react";
import moize from "moize";
import { Spin, Col } from "antd";

interface IContentSpinner {}

const ContentSpinner: SFC<IContentSpinner> = () => (
  <Col span={24} xs={24} style={{ margin: "8px 0" }}>
    <Spin size="large" />
  </Col>
);

export default moize.reactSimple(ContentSpinner);

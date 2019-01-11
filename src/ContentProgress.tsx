import React, { SFC } from "react";
import { Progress, Alert, Col } from "antd";

interface IContentProgress {
  percent: number;
}

const ContentProgress: SFC<IContentProgress> = ({ percent }) => (
  <Col span={24} xs={24} style={{ margin: "8px 0" }}>
    <div style={{ maxWidth: "900px" }}>
      <Progress percent={percent} status="active" />
      <Alert
        style={{ marginTop: "16px" }}
        message={
          <span>
            Calculating <em>Lotto Ball</em> combinations is a time consuming
            process. The larger the <strong>date range</strong> you have chosen
            the longer this calculation will take.
          </span>
        }
        type="info"
        showIcon
      />
    </div>
  </Col>
);

export default ContentProgress;

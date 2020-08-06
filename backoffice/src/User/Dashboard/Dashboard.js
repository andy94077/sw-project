import React from "react";
import { Row, Col, Statistic } from "antd";

export default function Dashboard() {
  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <Statistic title="Active Users" value={123456} />
        </Col>
        <Col span={12}>
          <Statistic title="Current Posts" value={123456} />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Statistic title="Online Users" value={878} />
        </Col>
        <Col span={12}>
          <Statistic title="Daily Posts" value={878} />
        </Col>
      </Row>
    </>
  );
}

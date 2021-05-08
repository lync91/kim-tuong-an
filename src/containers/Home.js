import React from 'react';
import { Card, Col, Row } from 'antd';

function Home() {
  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="ĐÃ CHUỘC" bordered={false}>
            Card content
          </Card>
        </Col>
        <Col span={8}>
          <Card title="CÒN HẠN" bordered={false}>
            Card content
          </Card>
        </Col>
        <Col span={8}>
          <Card title="HẾT HẠN" bordered={false}>
            Card content
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Home;

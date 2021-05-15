import React from 'react';
import { Card, Col, Row, Form, PageHeader } from 'antd';

function Home() {
  const {form} = Form.useForm();
  const onKeyChange = () => {

  }
  return (
    <div>
      <PageHeader className="site-page-header"
        onBack={
          () => null}
        title="Báo cáo số liệu"
        subTitle=""
        extra={
          (<Form form={form} onValuesChange={onKeyChange} layout="inline" >
            <Form.Item name="key">
            </Form.Item>
          </Form>
          )}
      />
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
    </div>
  );
}

export default Home;

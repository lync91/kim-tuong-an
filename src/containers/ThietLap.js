import React, { useEffect } from 'react';
import { PageHeader, Form, Row, Col } from 'antd';
import Button from 'antd-button-color';
import { dropCamDo, createCamDo } from '../utils/init';

function ThietLap(props) {
  const {form} = Form.useForm();
  const onKeyChange = () => {

  }
  const resetData = () => {
    dropCamDo(() => createCamDo());
    // createCamDo()
  }
  return (
    <div>
      <PageHeader className="site-page-header"
        onBack={
          () => null}
        title="Cài đặt"
        subTitle=""
        extra={
          (<Form form={form} onValuesChange={onKeyChange} layout="inline" >
            <Form.Item name="key">
            </Form.Item>
          </Form>
          )}
      />
      <Row>
        <Col span={4}>
        </Col>
        <Col span={16}>
          <Form form={form} >
            <Form.Item name='resetData'>
              <Button onClick={resetData}>Xóa dữ liệu</Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={4}>
        </Col>
      </Row>
    </div>
  )
}
export default ThietLap;

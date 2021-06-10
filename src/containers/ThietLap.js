import React, { useEffect } from 'react';
import { PageHeader, Form, Row, Col, Input, message } from 'antd';
import Button from 'antd-button-color';
import { resetData } from '../utils/init';
import { createSettings, getSettings, setSettings } from '../utils/db';

function ThietLap() {
  const [form] = Form.useForm();
  useEffect(async () => {
    getSettings()
    .then(res => {
      form.setFieldsValue(res)
    })
    return () => {

    }
  }, [])
  const onClickresetData = () => {
    // dropCamDo(() => createCamDo());
    // createCamDo()
    resetData();
  }
  const onSaveClick = () => {
    const values = form.getFieldsValue();
    setSettings(values).then(res => console.log(res));
    message.success('Cập nhật cài đặt thành công');
  }
  const onClickcreateSettings = () => {
    // console.log('OK');
    createSettings();
  }
  return (
    <div>
      <PageHeader className="site-page-header"
        onBack={
          () => null}
        title="Cài đặt"
        subTitle=""
        extra={(<Button type="primary" onClick={onSaveClick} >Lưu</Button>)}
      />
      <Row>
        <Col span={4}>
        </Col>
        <Col span={18}>
          <Form form={form}
            labelCol={
              {
                span: 4,
              }
            }
            wrapperCol={
              {
                span: 6,
              }
            }
          >
            <Form.Item label="Lãi dưới 10 ngày" name="lai10" >
              <Input></Input>
            </Form.Item>
            <Form.Item label="Lãi từ 10 - 20 ngày" name="lai20" >
              <Input></Input>
            </Form.Item>
            <Form.Item label="Lãi trên 30 ngày" name="lai30" >
              <Input></Input>
            </Form.Item>
            <Form.Item label="Tiền lãi tối thiểu" name="tienToiThieu" >
              <Input></Input>
            </Form.Item>
            <Form.Item hidden label="" name='resetData'>
              <Button onClick={onClickresetData}>Xóa dữ liệu</Button>
            </Form.Item>
            <Form.Item label="Khác" name='createThietLap'>
              <Button onClick={onClickcreateSettings}>Tạo lại dữ liệu thiết lập</Button>
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

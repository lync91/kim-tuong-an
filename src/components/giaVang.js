import { any } from 'prop-types';
import React from 'react';
import { Button, Form, Input } from 'antd';

function GiaVang(props) {
    const [form] = Form.useForm();
    const { data, onUpdate} = props;
    const _Click = () => {
        onUpdate(form.getFieldsValue());
    }
    return (
        <Form
            form={form}
            labelCol={
                {
                    span: 4,
                }
            }
            wrapperCol={
                {
                    span: 16,
                }
            }
            initialValues={data}
            layout="horizontal" >
            <Form.Item name="gia18K" label="18K" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="gia23K" label="23K" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="gia9999" label="9999" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="laisuat" label="Lãi suất" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 16, span: 8 }}>
                <Button type="primary" htmlType="submit" onClick={_Click} >Lưu</Button>
            </Form.Item>
        </Form>
    );
}

GiaVang.propTypes = any;

export default GiaVang;

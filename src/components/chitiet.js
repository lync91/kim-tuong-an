import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker } from 'antd';
import Button from 'antd-button-color';
const { RangePicker } = DatePicker;
import moment from 'moment';

import { camdoTypes } from '../types/camdo';

const dateFormat = 'DD/MM/YYYY, h:mm:ss A';
const dateFormat1 = 'DD/MM/YYYY';

function ChiTiet(props) {
  const { data } = props;
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});
  const [currentInput, setCurrentInput] = useState('tenkhach');
  const inputRef = React.useRef(null);
  const calc = () => {
    const giatinh = Number(form.getFieldValue(`gia${form.getFieldValue('loaivang')}`));
    form.setFieldsValue({ giatinh: giatinh });
    const tongtrongluong = Number(form.getFieldValue('tongtrongluong'));
    const trongluonghot = Number(form.getFieldValue('trongluonghot'));
    const trongluongthuc = tongtrongluong - trongluonghot;
    const tiencam = Math.round(trongluongthuc * giatinh);
    form.setFieldsValue({ trongluongthuc: trongluongthuc, tiencam: tiencam });
    setFormData({ ...formData, ...form.getFieldsValue() });
  };
  useEffect(() => {
    data.ngaycam = moment(data.ngaycam).format('DD/MM/YYYY');
    data.ngayCamChuoc = [moment(moment(data.ngaycam).format(dateFormat), dateFormat), moment(moment(data.ngayhethan).add(30, 'days').format(dateFormat), dateFormat)];
    setFormData(data);
    form.setFieldsValue(data);
    return () => {

    };
  }, []);
  const _onValuesChange = (value, vs) => {
    setFormData(vs);
    calc();
  };
  const onGiaUpdate = (data) => {
    form.setFieldsValue(data);
    setFormData({ ...formData, ...{ gia18K: Number(data.gia18K) } });
    const tmp = form.getFieldValue('loaivang');
    console.log(tmp);
    calc();
  };
  const _selectGia = (e) => {
    switch (e) {
      default:
      case '18K':
        onGiaUpdate({ giatinh: form.getFieldValue('gia18K') });
        return;
      case '24K':
        onGiaUpdate({ giatinh: form.getFieldValue('gia24K') });
        return;
      case '9999':
        onGiaUpdate({ giatinh: form.getFieldValue('gia9999') });
    }
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  return (
    <Form
      form={form}
      labelCol={
        {
          span: 8,
        }
      }
      wrapperCol={
        {
          span: 16,
        }
      }
      layout="horizontal"
      onValuesChange={(v, vs) => _onValuesChange(v, vs)} >
      <Form.Item label="Mã số phiếu" name="sophieu" >
        <Input disabled />
      </Form.Item>
      <Form.Item onClick={() => setCurrentInput('tenkhach')} label="Tên khách hàng" name="tenkhach" >
        <Input className={currentInput === 'tenkhach' ? 'input-focused' : ''} ref={inputRef} />
      </Form.Item>
      <Form.Item onClick={() => setCurrentInput('dienthoai')} label="Điện thoại" name="dienthoai" >
        <Input className={currentInput === 'dienthoai' ? 'input-focused' : ''} />
      </Form.Item>
      <Form.Item onClick={() => setCurrentInput('monhang')} label="Món hàng" name="monhang">
        <Input className={currentInput === 'monhang' ? 'input-focused' : ''} />
      </Form.Item>
      <Form.Item label="Loại vàng" name="loaivang" >
        <Select onChange={_selectGia}>
          <Select.Option value="18K" >18K</Select.Option>
          <Select.Option value="24K" >24K</Select.Option>
          <Select.Option value="9999" >9999</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Trọng lượng" >
        <Form.Item name="tongtrongluong"
          rules={
            [{ required: true }]}
          style={
            { display: 'inline-block', width: 'calc(32% - 4px)' }}
          className={currentInput === 'tongtrongluong' ? 'input-focused' : ''}
          onClick={() => setCurrentInput('tongtrongluong')} >
          <Input placeholder="Tổng" />
        </Form.Item>
        <Form.Item name="trongluonghot"
          rules={
            [{ required: true }]}
          style={
            { display: 'inline-block', width: 'calc(32% - 4px)', margin: '0 4px' }}
          className={currentInput === 'trongluonghot' ? 'input-focused' : ''}
          onClick={() => setCurrentInput('trongluonghot')} >
          <Input placeholder="Hột" />
        </Form.Item>
        <Form.Item name="trongluongthuc"
          rules={
            [{ required: true }]}
          style={
            { display: 'inline-block', width: 'calc(32% - 4px)', margin: '0 0px' }}
          className={currentInput === 'truongluongthuc' ? 'input-focused' : ''}
          onClick={() => setCurrentInput('trongluongthuc')} >
          <Input placeholder="Thực" disabled />
        </Form.Item>
      </Form.Item>
      <Form.Item label="Tiền cầm" name="tiencam" disabled>
        <Input className={currentInput === 'tiencam' ? 'input-focused' : ''} />
      </Form.Item>
      <Form.Item label="Ngày cầm - chuộc" name="ngayCamChuoc" >
        <RangePicker
          format={dateFormat1}
        />
      </Form.Item>
      <Form.Item hidden name="gia18K">
        <Input />
      </Form.Item>
      <Form.Item hidden name="gia24K">
        <Input />
      </Form.Item>
      <Form.Item hidden name="gia9999">
        <Input />
      </Form.Item>
      <Form.Item hidden name="laisuat">
        <Input />
      </Form.Item>
      <Form.Item className="chitiet-btn" label="" {...tailLayout} >
        <Button > Thoát </Button>
        <Button > Hủy phiếu </Button>
        <Button > Gia hạn </Button>
        <Button > Chuộc </Button>
        <Button > Lưu </Button>
      </Form.Item>
    </Form>
  );
}
ChiTiet.propTypes = camdoTypes
export default ChiTiet;

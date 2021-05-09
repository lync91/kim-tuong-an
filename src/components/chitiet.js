import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, Modal, message, Tag } from 'antd';
import Button from 'antd-button-color';
const { RangePicker } = DatePicker;
import moment from 'moment';

import { camdoTypes } from '../types/camdo';

import { updateCamDo } from '../utils/db';

const dateFormat = 'DD/MM/YYYY, h:mm:ss A';
const dateFormat1 = 'DD/MM/YYYY';

const pass = 'KIM TUONG AN';

function ChiTiet(props) {
  const { data, close } = props;
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});
  const [modalChuoc, setModalChuoc] = useState(false)
  const [modalHuy, setModalHuy] = useState(false)
  const [currentInput, setCurrentInput] = useState('tenkhach');
  const [inputXacNhan, setInputXacNhan] = useState('')
  const inputRef = React.useRef(null);
  const calc = () => {
    const ngayCamChuoc = form.getFieldValue('ngayCamChuoc');
    const gianhap = form.getFieldValue('gianhap');
    const tongtrongluong = Number(form.getFieldValue('tongtrongluong'));
    const trongluonghot = Number(form.getFieldValue('trongluonghot'));
    const trongluongthuc = tongtrongluong - trongluonghot;
    const tiencam = Math.round(trongluongthuc * gianhap);
    const laisuat = Number(form.getFieldValue('laisuat'));
    const songay = Math.round((moment().format('x') - ngayCamChuoc[0].format('x')) / (1000 * 60 * 60 * 24));
    const tienlai = Math.round(tiencam * ((laisuat / 30) * songay / 100));
    const tienchuoc = Number(data.tienchuoc) > 0 ? Number(data.tienchuoc) : Math.round(tiencam + tienlai);
    form.setFieldsValue({
      trongluongthuc: trongluongthuc,
      tiencam: tiencam,
      tienlai: tienlai,
      songay: songay,
      tienchuoc: tienchuoc
    });
    setFormData({ ...formData, ...form.getFieldsValue() });
  };
  useEffect(() => {
    data.ngayCamChuoc = [moment(moment(data.ngaycam).format(dateFormat), dateFormat), moment(moment(data.ngayhethan).add(30, 'days').format(dateFormat), dateFormat)];
    setFormData(data);
    form.setFieldsValue(data);
    calc();
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
        onGiaUpdate({ gianhap: form.getFieldValue('gia18K') });
        return;
      case '24K':
        onGiaUpdate({ gianhap: form.getFieldValue('gia24K') });
        return;
      case '9999':
        onGiaUpdate({ gianhap: form.getFieldValue('gia9999') });
    }
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  const save = () => {
    const values = form.getFieldsValue();
    data.dachuoc <= 0 ? delete values.tienchuoc : '';
    updateCamDo(data.id, values, () => message.success('Lưu phiếu cầm thàng công'));
    close();
  }
  const chuoc = () => {
    setModalChuoc(true);
  };

  const huyphieu = () => {
    setModalHuy(true);
  }

  const handleOk = () => {
    const values = form.getFieldsValue();
    updateCamDo(data.id, { ...values, ...{ dachuoc: 1 } })
    setModalChuoc(false);
  };

  const handleCancel = () => {
    setModalChuoc(false);
    setInputXacNhan('');
  };
  const handleOkHuy = () => {
    updateCamDo(data.id, { dahuy: 1 })
    setModalHuy(false);
    setInputXacNhan('');
  };

  const handleCancelHuy = () => {
    setModalHuy(false);
  };
  const labelRender = (c) => {
    let text = '';
    let color = ''
    // var start = moment(c.ngaycam).format('X');
    var end = moment(c.ngayhethan).format('X');
    var now = moment().format('X');
    const han = (end - now) / (60 * 60 * 24);
    if (han > 0) {
      text = 'Còn hạn',
        color = '#87d068'
    }
    if (han <= 0) {
      text = 'Quá hạn',
        color = '#f50'
    }
    if (c.dachuoc > 0) {
      text = 'Đã chuộc',
        color = '#108ee9'
    }
    return (<Tag color={color} >{text}</Tag>)
  }
  return (
    <div>
      <Modal title="Xác nhận chuộc đồ"
        visible={modalChuoc}
        onOk={handleOk}
        okText="Xác nhận"
        cancelText="Hủy"
        onCancel={handleCancel}
      >
        <p>Số ngày cầm: <b>{form.getFieldValue('songay')}</b></p>
        <p>lãi suất: <b>{form.getFieldValue('laisuat')}%</b></p>
        <p>Tiền cầm: <b>{`${form.getFieldValue('tiencam')}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ</b></p>
        <p>Tiền lãi: <b>{`${form.getFieldValue('tienlai')}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ</b></p>
        <p>Tiền chuộc: <b>{`${form.getFieldValue('tienchuoc')}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ</b></p>
      </Modal>
      <Modal
        title="Xác nhận hủy phiếu"
        visible={modalHuy}
        onOk={handleOkHuy}
        okText="Xác nhận"
        onCancel={handleCancelHuy}
        cancelText="Hủy"
        okButtonProps={{ disabled: inputXacNhan === pass ? false : true }}
        >
        <p>{`Gõ "${pass}" để xác nhận hủy phiếu này`}</p>
        <p><Input type="text" onChange={(e) => setInputXacNhan(e.target.value)} /></p>
      </Modal>
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
        <Form.Item label="Tình trạng" >
          {labelRender(data)}
        </Form.Item>
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
          <Select disabled onChange={_selectGia}>
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
        <Form.Item label="Giá nhập" name="gianhap" disabled>
          <Input className={currentInput === 'gianhap' ? 'input-focused' : ''} />
        </Form.Item>
        <Form.Item label="Tiền cầm" name="tiencam" disabled>
          <Input disabled className={currentInput === 'tiencam' ? 'input-focused' : ''} />
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
        <Form.Item label="Số ngày" name="songay">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Lãi suất" name="laisuat">
          <Input />
        </Form.Item>
        <Form.Item label="Tiền lãi" name="tienlai">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Tiền chuộc" name="tienchuoc">
          <Input />
        </Form.Item>
        <Form.Item className="chitiet-btn" label="" {...tailLayout} >
          <Button type="danger" disabled={data.dachuoc ? true : false} onClick={huyphieu} > Hủy phiếu </Button>
          <Button type="info" disabled={data.dachuoc ? true : false} onClick={chuoc} > Chuộc </Button>
          <Button type="success" disabled={data.dachuoc ? true : false} onClick={save}> Lưu </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
ChiTiet.propTypes = camdoTypes
export default ChiTiet;

import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, Modal, message, Tag, notification } from 'antd';
import Button from 'antd-button-color';
const { RangePicker } = DatePicker;
import moment from 'moment';

import { SmileOutlined, CloseCircleOutlined, CheckCircleOutlined, SaveOutlined, PrinterOutlined } from '@ant-design/icons';

const { Search } = Input;

import { updateCamDo, deleteCamDo, timPhieu, timPhieubyID } from '../utils/db';
import { printPreview } from '../utils/print';
import { any } from 'prop-types';
// import { set } from 'electron-settings';

const dateFormat = 'DD/MM/YYYY, h:mm:ss A';
const dateFormat1 = 'DD/MM/YYYY';

const pass = 'KIM TUONG AN';

function ChiTiet(props) {
  const { data, close, quetphieu, onSearched } = props;
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});
  const [modalChuoc, setModalChuoc] = useState(false)
  const [modalHuy, setModalHuy] = useState(false)
  const [currentInput, setCurrentInput] = useState('');
  const [inputXacNhan, setInputXacNhan] = useState('')
  const inputRef = React.useRef(null);
  const calc = () => {
    const ngayCamChuoc = form.getFieldValue('ngayCamChuoc');
    const gianhap = form.getFieldValue('gianhap');
    const tongtrongluong = Number(form.getFieldValue('tongtrongluong'));
    const trongluonghot = Number(form.getFieldValue('trongluonghot'));
    const trongluongthuc = tongtrongluong - trongluonghot;
    const tiencam = form.getFieldValue('tiencam') ? form.getFieldValue('tiencam') : Math.round(trongluongthuc * gianhap);
    const laisuat = Number(form.getFieldValue('laisuat'));
    const songay = ngayCamChuoc ? Math.round((moment().format('x') - ngayCamChuoc[0].format('x')) / (1000 * 60 * 60 * 24)) : '';
    const tienlai = Math.round(tiencam * ((laisuat / 30) * songay / 100));
    const tienchuoc = Number(data.tienchuoc) > 0 ? Number(data.tienchuoc) : Math.round(tiencam + tienlai);
    form.setFieldsValue({
      trongluongthuc: trongluongthuc | '',
      tiencam: tiencam | '',
      tienlai: tienlai | '',
      songay: songay | '',
      tienchuoc: tienchuoc | ''
    });
    setFormData({ ...formData, ...form.getFieldsValue() });
  };
  const dateParser = (res) => {
    const tmp = res;
    const ngaychuoc = data.ngaychuoc ? moment(moment(data.ngaychuoc).format(dateFormat), dateFormat) : ''
    const ngayCamChuoc = [moment(moment(tmp.ngaycam).format(dateFormat), dateFormat), moment(moment(tmp.ngayhethan).format(dateFormat), dateFormat)]
    // form.setFieldsValue(res[0]);
    return { ...res, ...{ ngayCamChuoc: ngayCamChuoc, ngaychuoc: ngaychuoc } };
  }
  useEffect(() => {
    data.ngayCamChuoc = data.ngaycam ? [
      moment(moment(data.ngaycam).format(dateFormat),
        dateFormat), moment(moment(data.ngayhethan).add(30, 'days').format(dateFormat), dateFormat)
    ] : '';
    const ngaychuoc = data.ngaychuoc ? moment(moment(data.ngaychuoc).format(dateFormat), dateFormat) : ''
    setFormData(data);
    form.setFieldsValue({ ...data, ...{ ngaychuoc: ngaychuoc } });
    calc();
    return () => {
      console.log('OLL');
    };
  }, [data]);
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
    close(true);
  }
  const chuoc = () => {
    setModalChuoc(true);
  };

  const huyphieu = () => {
    setModalHuy(true);
  }

  const handleOk = () => {
    const values = form.getFieldsValue();
    const ngaychuoc = values.ngaychuoc ? values.ngaychuoc.format('x') : moment().format('x');
    values.ngaychuoc ? '' : form.setFieldsValue({ ngaychuoc: moment(moment().format(dateFormat), dateFormat) });
    updateCamDo(data.id, { ...values, ...{ dachuoc: 1, ngaychuoc: ngaychuoc } }, () => {
      timPhieubyID(form.getFieldValue('id'), res => {
        onSearched(dateParser(res[0]));
      })
      setModalChuoc(false)
    });
    setInputXacNhan('');
  };

  const handleCancel = () => {
    setModalChuoc(false);
    setInputXacNhan('');
  };
  const handleOkHuy = () => {
    deleteCamDo(data.id, () => {
      setModalHuy(false);
      setInputXacNhan('');
    });
    message.success('Hủy phiếu cầm đồ thành công')
    close(true);
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
    if (!formData.id) {
      text = 'Chưa quét phiếu',
        color = ''
    }
    return (<Tag color={color} >{text}</Tag>)
  }
  const onSearch = (e) => {
    timPhieu(e, res => {
      if (res.length <= 0) {
        notification.open({
          message: 'Không tìm thấy phiếu trong cơ sở dữ liệu',
          description:
            'Hãy cẩn trọng kiểm tra một lần nữa',
          icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        });
        return;
      }
      else {
        const data = dateParser(res[0])
        onSearched(data);
      }
    });
  }
  const print = () => {
    timPhieubyID(form.getFieldValue('id'), res => {
      printPreview(dateParser(res[0]), false)
    })
  }
  const onKeyPress = (e) => {
    e.code === 'Enter' ? handleOkHuy() : '';
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
        <p><Input type="text" value={inputXacNhan} onKeyPress={onKeyPress} onChange={(e) => setInputXacNhan(e.target.value)} /></p>
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
        onValuesChange={(v, vs) => _onValuesChange(v, vs)}
        className="form-chi-tiet"
      >
        <Form.Item label="Mã số phiếu" name="sophieu" >
          {/* <Input disabled={!quetphieu} /> */}
          <Search
            placeholder="Nhập mã số phiếu"
            allowClear
            size="large"
            onSearch={onSearch}
            disabled={!quetphieu}
          />
        </Form.Item>
        <Form.Item label="Tình trạng" >
          {labelRender(data)}
        </Form.Item>
        <Form.Item label="Id" name="id" >
          <Input />
        </Form.Item>
        <Form.Item onClick={() => setCurrentInput('tenkhach')} label="Tên khách hàng" name="tenkhach" >
          <Input className={currentInput === 'tenkhach' ? 'input-focused' : ''} ref={inputRef} disabled={quetphieu} />
        </Form.Item>
        <Form.Item onClick={() => setCurrentInput('dienthoai')} label="Điện thoại" name="dienthoai" >
          <Input className={currentInput === 'dienthoai' ? 'input-focused' : ''} disabled={quetphieu} />
        </Form.Item>
        <Form.Item onClick={() => setCurrentInput('monhang')} label="Món hàng" name="monhang">
          <Input className={currentInput === 'monhang' ? 'input-focused' : ''} disabled={quetphieu} />
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
            <Input placeholder="Tổng" disabled={quetphieu} />
          </Form.Item>
          <Form.Item name="trongluonghot"
            rules={
              [{ required: true }]}
            style={
              { display: 'inline-block', width: 'calc(32% - 4px)', margin: '0 4px' }}
            className={currentInput === 'trongluonghot' ? 'input-focused' : ''}
            onClick={() => setCurrentInput('trongluonghot')} >
            <Input placeholder="Hột" disabled={quetphieu} />
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
          <Input className={currentInput === 'gianhap' ? 'input-focused' : ''} disabled={quetphieu} />
        </Form.Item>
        <Form.Item label="Tiền cầm" name="tiencam" disabled>
          <Input disabled className={currentInput === 'tiencam' ? 'input-focused' : ''} />
        </Form.Item>
        <Form.Item label="Ngày cầm - chuộc" name="ngayCamChuoc" >
          <RangePicker
            format={dateFormat1}
            disabled={quetphieu}
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
          <Input disabled={quetphieu} />
        </Form.Item>
        <Form.Item label="Ngày chộc" name="ngaychuoc">
          <DatePicker format={dateFormat1} disabled={formData.dachuoc ? true : false} />
        </Form.Item>
        <Form.Item className="chitiet-btn" label="" {...tailLayout} >
          <Button type="danger" disabled={data.dachuoc ? true : false} onClick={huyphieu} ><CloseCircleOutlined /> Hủy phiếu </Button>
          <Button type="info" disabled={data.dachuoc ? true : false} onClick={chuoc} ><CheckCircleOutlined /> Chuộc </Button>
          <Button type="success" hidden={quetphieu} disabled={data.dachuoc ? true : false} onClick={save}><SaveOutlined /> Lưu </Button>
          <Button type="" hidden={quetphieu} disabled={data.dachuoc ? true : false} onClick={print}><PrinterOutlined /> In phiếu </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
ChiTiet.propTypes = any;
export default ChiTiet;

import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, Modal, message, Tag, notification, InputNumber } from 'antd';
import Button from 'antd-button-color';
const { RangePicker } = DatePicker;
import moment from 'moment';
import BarcodeReader from 'react-barcode-reader';
import { getSettings } from '../utils/db';
import { round, evaluate } from 'mathjs';

import { SmileOutlined, CloseCircleOutlined, CheckCircleOutlined, SaveOutlined, PrinterOutlined, PlusCircleOutlined } from '@ant-design/icons';

const { Search } = Input;

import { updateCamDo, huyPhieuCam, timPhieubyID, giahanCamDo, chuocDo, camThemTien } from '../utils/db';
import { printPreview } from '../utils/print';
import { any } from 'prop-types';
// import { set, getSync } from 'electron-settings';

const dateFormat = 'DD/MM/YYYY, h:mm:ss A';
const dateFormat1 = 'DD/MM/YYYY';

const pass = 'KIM TUONG AN';

const defData = {
  lai10: 5,
  lai20: 4,
  lai30: 3,
  tienToiThieu: 5000
}

function ChiTiet(props) {
  const { data, close, quetphieu, onSearched } = props;
  const [form] = Form.useForm();
  const [formCamThem] = Form.useForm();
  const [formData, setFormData] = useState({});
  const [modalChuoc, setModalChuoc] = useState(false)
  const [modalHuy, setModalHuy] = useState(false)
  const [modalGiaHan, setModalGiaHan] = useState(false)
  const [currentInput, setCurrentInput] = useState('');
  // const [inputXacNhan, setInputXacNhan] = useState('');
  const [dataLaiSuat, setDataLaiSuat] = useState({});
  const [modalCamThem, setModalCamThem] = useState(false);
  const inputRef = React.useRef(null);
  const calc = () => {
    const ngayCamChuoc = form.getFieldValue('ngayCamChuoc');
    const gianhap = form.getFieldValue('gianhap');
    const tongtrongluong = form.getFieldValue('tongtrongluong');
    const trongluonghot = form.getFieldValue('trongluonghot');
    const trongluongthuc = round(evaluate(`${tongtrongluong} - ${trongluonghot}`), 3);
    console.log(trongluongthuc);
    const tiencam = form.getFieldValue('tiencam') ? form.getFieldValue('tiencam') : round(trongluongthuc * gianhap);
    let laisuat = Number(form.getFieldValue('laisuat'));
    const songay = ngayCamChuoc ? round((moment().format('x') - moment(data.ngaytinhlai ? data.ngaytinhlai : data.ngaycam).format('x')) / (1000 * 60 * 60 * 24) + 1) : '';
    if (songay < 10) {
      laisuat = dataLaiSuat.lai10
    } else if (songay > 10 && songay < 20) {
      laisuat = dataLaiSuat.lai20
    } else {
      laisuat = dataLaiSuat.lai30
    }
    const tienlaidukien = Math.round(tiencam * ((laisuat / 30) * songay / 100) / 1000) * 1000;
    console.log(tienlaidukien);
    const tienchuocdukien = Number(data.tienchuoc) > 0 ? Number(data.tienchuoc) : Math.round(tiencam + tienlaidukien);
    form.setFieldsValue({
      trongluongthuc: trongluongthuc,
      // tiencam: tiencam | '',
      // tienlaidukien: tienlaidukien | '',
      songay: songay | '',
      tienchuocdukien: tienchuocdukien | '',
      laisuat: laisuat | ''
    });
    setFormData({ ...formData, ...form.getFieldsValue() });
  };
  const dateParser = (res) => {
    const tmp = res;
    const ngaychuoc = data.ngaychuoc ? moment(moment(tmp.ngaychuoc).format(dateFormat), dateFormat) : ''
    const ngayCamChuoc = [moment(moment(tmp.ngaycam).format(dateFormat), dateFormat), moment(moment(tmp.ngayhethan).format(dateFormat), dateFormat)]
    // form.setFieldsValue(res[0]);
    return { ...res, ...{ ngayCamChuoc: ngayCamChuoc, ngaychuoc: ngaychuoc } };
  }
  useEffect(() => {
    console.log('data', data);
    getSettings()
      .then(res => {
        console.log('settings', res);
        setDataLaiSuat(res);
        const ngayCamChuoc = data.ngaycam ? [
          moment(moment(data.ngaycam).format(dateFormat),
            dateFormat), moment(moment(data.ngayhethan).format(dateFormat), dateFormat)
        ] : '';
        const ngaychuoc = data.ngaychuoc ? moment(moment(data.ngaychuoc).format(dateFormat), dateFormat) : '';
        const ngaytinhlai = data.ngaytinhlai ? moment(moment(data.ngaytinhlai).format(dateFormat), dateFormat) : '';
        setFormData(data);
        if (data.ngaychuoc) {
          form.setFieldsValue({ ...data, ...{ ngayCamChuoc: ngayCamChuoc, ngaychuoc: ngaychuoc, ngaytinhlai: ngaytinhlai } });
        } else {
          form.setFieldsValue({ ...data, ...{ ngayCamChuoc: ngayCamChuoc, ngaytinhlai: ngaytinhlai } });
        }
        calc();
      });
    return () => {
      console.log('OLL');
    };
  }, [data]);
  const _onValuesChange = (value, vs) => {
    setFormData(vs);
    calc();
    console.log(value);
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
    calc();
    setModalChuoc(true);
  };
  const giahan = () => {
    calc();
    setModalGiaHan(true);
  };
  const camthem = () => {
    calc();
    setModalCamThem(true);
  };

  const huyphieu = () => {
    setModalHuy(true);
  }

  const handleOk = () => {
    const values = form.getFieldsValue();
    const tienchuoc = form.getFieldValue('tienchuocdukien');
    const tienlai = form.getFieldValue('tienlai');
    const tienlaidukien = form.getFieldValue('tienlaidukien');
    const ngaychuoc = values.ngaychuoc ? values.ngaychuoc.format('x') : moment().format('x');
    console.log('ngaychuoc', ngaychuoc);
    chuocDo(data.id, tienlaidukien + tienlai, tienchuoc, ngaychuoc, () => {
      timPhieubyID(form.getFieldValue('id'), res => {
        onSearched(dateParser(res));
      })
      setModalChuoc(false)
    });
  };

  const handleCancel = () => {
    setModalChuoc(false);
  };
  const giaHanCancel = () => {
    setModalGiaHan(false);
    // setInputXacNhan('');
  };
  const camThemCancel = () => {
    setModalCamThem(false);
    // setInputXacNhan('');
  };
  const giaHanOK = () => {
    console.log(data.tienlai);
    const laihientai = data.tienlai | 0;
    const laidukien = form.getFieldValue('tienlaidukien');
    giahanCamDo(data.id, laihientai + laidukien, 30, () => {
      timPhieubyID(data.id, res => {
        const data = dateParser(res)
        onSearched(data);
      })
    })
    setModalGiaHan(false);
    // setInputXacNhan('');
  };
  const camThemOK = () => {
    console.log(data.tienlai);
    const laihientai = data.tienlai | 0;
    const laidukien = form.getFieldValue('tienlaidukien');
    const tiencam = Number(form.getFieldValue('tiencam'));
    const tiencamthem = Number(formCamThem.getFieldValue('tiencamthem'));
    console.log(tiencam);
    console.log(tiencamthem);
    camThemTien(data.id, laihientai + laidukien, tiencam + tiencamthem, () => {
      timPhieubyID(data.id, res => {
        const data = dateParser(res)
        onSearched(data);
      })
    })
    setModalCamThem(false);
    formCamThem.setFieldsValue({ tiencamthem: '' })
    // setInputXacNhan('');
  };
  const handleOkHuy = () => {
    huyPhieuCam(data.id, () => {
      setModalHuy(false);
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
    if (c.dahuy > 0) {
      text = 'Đã hủy',
        color = '#f50'
    }
    if (!formData.id) {
      text = 'Chưa quét phiếu',
        color = ''
    }
    return (<Tag color={color} >{text}</Tag>)
  }
  const onSearch = (e) => {
    const id = Number(e);
    timPhieubyID(id, res => {
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
        console.log(data);
        const data = dateParser(res)
        onSearched(data);
      }
    });
  }
  const print = () => {
    timPhieubyID(form.getFieldValue('id'), res => {
      printPreview(dateParser(res), false)
    })
  }
  const onKeyPress = (e) => {
    e.code === 'Enter' ? handleOkHuy() : '';
  }
  const handleScan = (data) => {
    console.log(data);
    form.setFieldsValue({ sophieu: data });
    onSearch(data);
  }
  const handleError = (err) => {
    console.error(err)
  }
  return (
    <div>
      <BarcodeReader
        onError={handleError}
        onScan={handleScan}
      />
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
        <p>Tiền lãi: <b>{`${form.getFieldValue('tienlaidukien')}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ</b></p>
        <p>Tiền chuộc: <b>{`${form.getFieldValue('tienchuocdukien')}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ</b></p>
      </Modal>
      <Modal title="Gia hạn phiếu chuộc"
        visible={modalGiaHan}
        onOk={giaHanOK}
        okText="Xác nhận"
        cancelText="Hủy"
        onCancel={giaHanCancel}
      >
        <p>Số ngày cầm: <b>{form.getFieldValue('songay')}</b></p>
        <p>lãi suất: <b>{form.getFieldValue('laisuat')}%</b></p>
        <p>Tiền cầm: <b>{`${form.getFieldValue('tiencam')}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ</b></p>
        <p>Tiền lãi: <b>{`${form.getFieldValue('tienlaidukien')}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ</b></p>
        {/* <p>Tiền chuộc: <b>{`${form.getFieldValue('tienchuoc')}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ</b></p> */}
        Số ngày gia hạn: <b></b><InputNumber defaultValue={30} />
      </Modal>
      <Modal title="Cầm thêm tiền"
        visible={modalCamThem}
        onOk={camThemOK}
        okText="Xác nhận"
        cancelText="Hủy"
        onCancel={camThemCancel}
      >
        <p>Số ngày cầm: <b>{form.getFieldValue('songay')}</b></p>
        <p>lãi suất: <b>{form.getFieldValue('laisuat')}%</b></p>
        <p>Tiền cầm: <b>{`${form.getFieldValue('tiencam')}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ</b></p>
        <p>Tiền lãi: <b>{`${form.getFieldValue('tienlaidukien')}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ</b></p>
        {/* <p>Tiền chuộc: <b>{`${form.getFieldValue('tienchuoc')}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ</b></p> */}
        Số tiền cầm thêm: <b></b>
        <Form form={formCamThem}>
          <Form.Item name="tiencamthem">
            <Input></Input>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Xác nhận hủy phiếu"
        visible={modalHuy}
        onOk={handleOkHuy}
        okText="Xác nhận"
        onCancel={handleCancelHuy}
        cancelText="Hủy"
      // okButtonProps={{ disabled: inputXacNhan === pass ? false : true }}
      >
        <p>{`Phiếu cầm này sẽ chuyển sang trạng thái đã hủy`}</p>
        {/* <p>{`Gõ "${pass}" để xác nhận hủy phiếu này`}</p> */}
        {/* <p><Input type="text" value={inputXacNhan} onKeyPress={onKeyPress} onChange={(e) => setInputXacNhan(e.target.value)} /></p> */}
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
        <Form.Item label="Tủ đồ" name="tudo">
          <Input />
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
        <Form.Item label="Ngày tính lãi" name="ngaychuoc">
          <DatePicker format={dateFormat1} disabled={formData.dachuoc ? true : false} />
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
        <Form.Item label="Tiền lãi dự kiến" name="tienlaidukien">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Tiền lãi" name="tienlai">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Tiền chuộc" name="tienchuoc">
          <Input disabled={quetphieu} />
        </Form.Item>
        <Form.Item hidden label="Tiền chuộc dự kiến" name="tienchuocdukien">
          <Input disabled={quetphieu} />
        </Form.Item>
        <Form.Item label="Ngày chuộc" name="ngaychuoc">
          <DatePicker format={'DD/MM/YYYY HH:mm'} disabled={formData.dachuoc ? true : false} />
        </Form.Item>
        <Form.Item className="chitiet-btn" label="" {...tailLayout} >
          <Button type="danger" disabled={data.dachuoc ? true : false} hidden={quetphieu} onClick={huyphieu} ><CloseCircleOutlined /> Hủy phiếu </Button>
          <Button type="info" disabled={data.dachuoc ? true : false} onClick={chuoc} ><CheckCircleOutlined /> Chuộc </Button>
          <Button type="success" hidden={quetphieu} disabled={data.dachuoc ? true : false} onClick={save}><SaveOutlined /> Lưu </Button>
          <Button type="warning" hidden={!quetphieu} disabled={data.dachuoc ? true : false} onClick={giahan}><PlusCircleOutlined /> Đóng lãi </Button>
          <Button type="info" hidden={!quetphieu} disabled={data.dachuoc ? true : false} onClick={camthem}><PlusCircleOutlined /> Cầm thêm </Button>
          <Button type="" disabled={data.dachuoc ? true : false} onClick={print}><PrinterOutlined /> In phiếu </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
ChiTiet.propTypes = any;
export default ChiTiet;

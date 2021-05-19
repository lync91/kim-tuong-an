import React, { useState, useEffect } from 'react';
import {
  PageHeader,
  Layout,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Tag,
  Drawer,
  message
} from 'antd';
import Button from 'antd-button-color';
const { RangePicker } = DatePicker;
import moment from 'moment';
// import { crc16 } from 'js-crc';
// import { generate } from 'generate-serial-number';
import { SaveTwoTone, PrinterTwoTone, ProjectOutlined } from '@ant-design/icons';
import Keyboard from 'react-simple-keyboard';
import settings from 'electron-settings';
import {
  getLastId,
  insertCamdo,
} from '../utils/db';
import { padDigits } from '../utils/tools';
// const { PosPrinter } = remote.require('electron-pos-printer');

import { printPreview } from '../utils/print'
import Phieu from './Phieu';
import GiaVang from '../components/giaVang';

const dateFormat = 'DD/MM/YYYY, h:mm:ss A';
const dateFormat1 = 'DD/MM/YYYY';

// const genkey = (key) => {
//     return `${crc16('1999009090909')}${generate(4)}`;
// };

const defData = {
  sophieu: '0000000000',
  tenkhach: '',
  dienthoai: '',
  monhang: '',
  loaivang: '18K',
  tongtrongluong: '1',
  trongluonghot: '',
  trongluongthuc: '',
  giatoida: '',
  tiencam: '',
  ngayCamChuoc: [moment(moment().format(dateFormat), dateFormat), moment(moment().add(30, 'days').format(dateFormat), dateFormat)],
  ngaychuoc: '',
  ngaycam: '',
  laisuat: 5,
  gia18K: 2900000,
  gia23K: 4900000,
  gia9999: 4900000,
  gianhap: 0
};

function TaoPhieu() {
  const [form] = Form.useForm();
  const inputRef = React.useRef(null);
  const [formData, setFormData] = useState(defData);
  const [currentInput, setCurrentInput] = useState('tenkhach');
  const [visible, setVisible] = useState(false);

  const calc = () => {
    const gianhap = Number(form.getFieldValue(`gia${form.getFieldValue('loaivang')}`));
    form.setFieldsValue({ gianhap: gianhap });
    const tongtrongluong = Number(form.getFieldValue('tongtrongluong'));
    const trongluonghot = Number(form.getFieldValue('trongluonghot'));
    const trongluongthuc = tongtrongluong - trongluonghot;
    const giatoida = Math.round(trongluongthuc * gianhap);
    form.setFieldsValue({ trongluongthuc: trongluongthuc, giatoida: giatoida });
    setFormData({ ...formData, ...form.getFieldsValue() });
  };
  const genKey = () => {
    getLastId((res) => {
      const key = `${padDigits(res + 1, 9)}`;
      // const ngayCamChuoc = [moment().format(dateFormat), moment().add(30, 'days').format(dateFormat)];
      // console.log(ngayCamChuoc);
      form.setFieldsValue({ ...defData, ...{ sophieu: key, gianhap: defData.gia18K } });
    });
  };
  useEffect(async () => {
    genKey();
    console.log(defData);
    // console.log(await settings.get('giavang'));
    const giavang = await settings.get('giavang');
    console.log(giavang);
    form.setFieldsValue(giavang);
    setFormData({ ...formData, ...giavang });

    // setFormData({ ...defData, ...{ key: key } });
    // calc();
  }, []);
  const _onValuesChange = (value, vs) => {
    setFormData(vs);
    calc();
  };
  const btnClick = (key, addspace) => {
    const tmp = {};
    tmp[currentInput] = `${form.getFieldValue(currentInput)}${key}${addspace ? ' ' : ''}`;
    form.setFieldsValue(tmp);
    setFormData({ ...formData, ...form.getFieldsValue() });
    calc();
  };
  const btnXoaClick = () => {
    const tmp = {};
    tmp[currentInput] = ``;
    form.setFieldsValue(tmp);
    setFormData({ ...formData, ...form.getFieldsValue() });
    calc();
  };
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  const onGiaUpdate = (data) => {
    form.setFieldsValue(data);
    settings.set({ giavang: data });
    setFormData({ ...formData, ...{ gia18K: Number(data.gia18K) } });
    const tmp = form.getFieldValue('loaivang');
    console.log(tmp);
    calc();
    onClose();
  };
  const _selectGia = (e) => {
    switch (e) {
      default:
      case '18K':
        onGiaUpdate({ gianhap: form.getFieldValue('gia18K') });
        return;
      case '23K':
        onGiaUpdate({ gianhap: form.getFieldValue('gia23K') });
        return;
      case '9999':
        onGiaUpdate({ gianhap: form.getFieldValue('gia9999') });
    }
  };
  const save = () => {
    insertCamdo(form.getFieldsValue(), () => {
      message.success('Thêm thành công phiếu cầm đồ')
    });
  };
  const print = () => {
    printPreview(form.getFieldsValue(), false);
  }
  const saveAndPrint = () => {
    insertCamdo(form.getFieldsValue(), () => {
      message.success('Thêm thành công phiếu cầm đồ');
      printPreview(form.getFieldsValue(), false);
    });
  }
  const testdate = (e, v) => {
    console.log(e)
    console.log(v);
  }
  const onkeyboardChange = (e) => {
    console.log(e);
  }
  const onkeyboardKeyPress = (e) => {
    console.log(e);
  }
  return (
    <div >
      <PageHeader className="site-page-header"
        onBack={
          () => null}
        title="Tạo phiếu cầm"
        subTitle=""
        extra={
          [
            <Tag key="7" className="tag-gia" color="volcano" onClick={showDrawer}>Lãi suất: <b>{`${formData.laisuat}%`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</b></Tag>,
            <Tag key="4" className="tag-gia" color="volcano" onClick={showDrawer}>Vàng 18K: <b>{`${formData.gia18K}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</b></Tag>,
            <Tag key="5" className="tag-gia" color="orange" onClick={showDrawer}>Vàng 23K: <b>{`${formData.gia23K}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</b></Tag>,
            <Tag key="6" className="tag-gia" color="gold" onClick={showDrawer}>Vàng 9999: <b>{`${formData.gia9999}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</b></Tag>,
            <Button key="3" hidden onClick={save} ><SaveTwoTone />Lưu</Button>,
            <Button key="2" hidden onClick={print}><PrinterTwoTone /> In </Button>,
            <Button key="1" type="primary" onClick={saveAndPrint} ><ProjectOutlined />Lưu và in</Button>,
          ]
        }
      />
      <Layout >
        <Drawer
          title="Thiết lập giá vàng"
          placement="right"
          width={520}
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <GiaVang data={formData} onUpdate={onGiaUpdate} onClose={onClose} />
        </Drawer>
        <Row >
          <Col className="panel1" >
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
              className="form-tao-phieu"
            >
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
                  <Select.Option value="23K" >23K</Select.Option>
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
              <Form.Item label="Giá nhập" name="gianhap">
                <Input disabled className={currentInput === 'gianhap' ? 'input-focused' : ''} />
              </Form.Item>
              <Form.Item label="Giá tối đa" name="giatoida">
                <Input disabled onClick={() => setCurrentInput('giatoida')} className={currentInput === 'giatoida' ? 'input-focused' : ''} />
              </Form.Item>
              <Form.Item label="Tiền cầm" name="tiencam">
                <Input onClick={() => setCurrentInput('tiencam')} className={currentInput === 'tiencam' ? 'input-focused' : ''} />
              </Form.Item>
              <Form.Item label="Ngày cầm - chuộc" name="ngayCamChuoc" >
                <RangePicker
                  format={dateFormat1}
                  onChange={testdate}
                // defaultValue={[moment(moment().format(dateFormat), dateFormat), moment(moment().add(30, 'days').format(dateFormat), dateFormat)]}
                />
              </Form.Item>
              <Form.Item hidden name="gia18K">
                <Input />
              </Form.Item>
              <Form.Item hidden name="gia23K">
                <Input />
              </Form.Item>
              <Form.Item hidden name="gia9999">
                <Input />
              </Form.Item>
              <Form.Item hidden name="laisuat">
                <Input />
              </Form.Item>
              <Form.Item hidden label="Button" >
                <Button > Button </Button>
              </Form.Item>
            </Form>
            <Row >
              <Col className="num-pad" >
                <Row >
                  <Button type="success" size="large" onClick={() => btnClick('1')} > 1 </Button>
                  <Button type="success" size="large" onClick={() => btnClick('2')} > 2 </Button>
                  <Button type="success" size="large" onClick={() => btnClick('3')} > 3 </Button>
                  <Button type="warning" size="large" onClick={() => btnClick('L', true)} > L </Button>
                  <Button type="default" size="large" onClick={() => btnClick('N', true)} > N </Button>
                </Row>
                <Row >
                  <Button type="success" size="large" onClick={() => btnClick('4')} > 4 </Button>
                  <Button type="success" size="large" onClick={() => btnClick('5')} > 5 </Button>
                  <Button type="success" size="large" onClick={() => btnClick('6')} > 6 </Button>
                  <Button type="warning" size="large" onClick={() => btnClick('')} >  </Button>
                  <Button type="default" size="large" onClick={() => btnClick('V', true)} > V </Button>
                </Row>
                <Row >
                  <Button type="success" size="large" onClick={() => btnClick('7')} > 7 </Button>
                  <Button type="success" size="large" onClick={() => btnClick('8')} > 8 </Button>
                  <Button type="success" size="large" onClick={() => btnClick('9')} > 9 </Button>
                  <Button type="warning" size="large" onClick={() => btnClick('')} >  </Button>
                  <Button type="default" size="large" onClick={() => btnClick('D', true)} > D </Button>
                </Row>
                <Row >
                  <Button type="danger" size="large" onClick={() => btnXoaClick()} > Xóa </Button>
                  <Button type="success" size="large" onClick={() => btnClick('0')} > 0 </Button>
                  <Button type="success" size="large" onClick={() => btnClick('.')} > . </Button>
                  <Button type="primary" size="large" onClick={() => btnClick('D')} > Enter </Button>
                  <Button type="default" size="large" onClick={() => btnClick('M', true)} > M </Button>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col className="panel2">
            <Phieu formData={formData} />
          </Col>
        </Row>
        <Row hidden>
          <Keyboard
            onChange={onkeyboardChange}
            onKeyPress={onkeyboardKeyPress}
            layoutName="shift"
          />
        </Row>
      </Layout>
    </div>
  );
}
export default TaoPhieu;

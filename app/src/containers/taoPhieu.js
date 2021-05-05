import React, { useState, useEffect } from 'react';
import { remote } from 'electron';
import {
    PageHeader,
    Layout,
    Form,
    Input,
    Radio,
    Select,
    // Cascader,
    DatePicker,
    // InputNumber,
    // TreeSelect,
    // Switch,
    Row,
    Col,
    Tag,
    Drawer
} from 'antd';
import moment from 'moment';
import { crc16 } from 'js-crc';
import { generate } from 'generate-serial-number';

const db = remote.require('./db');
// const { PosPrinter } = remote.require('electron-pos-printer');

import Button from 'antd-button-color';
import { SaveTwoTone, PrinterTwoTone, ProjectOutlined } from '@ant-design/icons';
const { RangePicker } = DatePicker;

import Phieu from './Phieu';
import GiaVang from '../components/giaVang';

const dateFormat = 'DD/MM/YYYY';

const genkey = (key) => {
    return `${crc16('1999009090909')}${generate(4)}`;
};

const defData = {
    key: genkey(),
    tenkhach: 'Mã Đại Phúc',
    dienthoai: '',
    monhang: '1N 2V',
    loaivang: '18K',
    tongtrongluong: '1',
    trongluonghot: '',
    trongluongthuc: '',
    tiencam: '',
    ngaychuoc: moment().add(30, 'days').format(dateFormat),
    ngaycam: moment().format(dateFormat),
    gia18K: 2900000,
    gia24K: 4900000,
    gia9999: 4900000,
    giatinh: 0
};

function TaoPhieu() {
    const [form] = Form.useForm();
    const inputRef = React.useRef(null);
    const [formData, setFormData] = useState(defData);
    const [currentInput, setCurrentInput] = useState('tenkhach');
    const [visible, setVisible] = useState(false);

    const calc = () => {
        const tongtrongluong = Number(form.getFieldValue('tongtrongluong'));
        const trongluonghot = Number(form.getFieldValue('trongluonghot'));
        const trongluongthuc = tongtrongluong - trongluonghot;
        const tiencam = Math.round(trongluongthuc * Number(form.getFieldValue('giatinh')));
        form.setFieldsValue({ trongluongthuc: trongluongthuc, tiencam: tiencam });
        setFormData({...formData, ...form.getFieldsValue()});
    };

    useEffect(() => {
        const key = `${crc16('1999009090909')}${generate(4)}`;
        // setFormData({ ...defData, ...{ key: key } });
        form.setFieldsValue({ ...defData, ...{ key: key, giatinh: defData.gia18K} });
        calc();
    }, []);
    const [componentSize, setComponentSize] = useState('default');
    const printPhieu = () => {
        // const { BrowserWindow, dialog, shell } = remote;
        // const printWindow = new BrowserWindow({ 'auto-hide-menu-bar': true, show: false });
        // const list = printWindow.webContents.getPrinters();
        // // console.log('All printer available are ', list);
    };
    const _onValuesChange = (value, vs) => {
        setFormData(vs);
        calc();
    };
    const btnClick = (key, addspace) => {
        const tmp = {};
        tmp[currentInput] = `${form.getFieldValue(currentInput)}${key}${addspace ? ' ' : ''}`;
        form.setFieldsValue(tmp);
        setFormData({...formData, ...form.getFieldsValue()});
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
        calc();
    };
    const _selectGia = (e) => {
        switch (e) {
            default:
            case '18K':
                onGiaUpdate({giatinh: form.getFieldValue('gia18K')});
                return;
            case '24K':
                onGiaUpdate({giatinh: form.getFieldValue('gia24K')});
                return;
            case '9999':
                onGiaUpdate({giatinh: form.getFieldValue('gia9999')});
        }
    };
    const save = () => {
        // db.initdb.dropCamDo();
        // db.initdb.createCamDo();
        // ipcRenderer.send('addPhieuCam', form.getFieldsValue());
        db.insertPhieuCam(form.getFieldsValue());
    };
    return (
        <div >
            <PageHeader className="site-page-header"
                onBack={
                    () => null}
                title="Tạo phiếu cầm"
                subTitle=""
                extra={
                    [
                        <Tag key="4" className="tag-gia" color="volcano" onClick={showDrawer}>Vàng 18K: <b>{`${formData.gia18K}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</b></Tag>,
                        <Tag key="5" className="tag-gia" color="orange" onClick={showDrawer}>Vàng 24K: <b>{`${formData.gia24K}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</b></Tag>,
                        <Tag key="6" className="tag-gia" color="gold" onClick={showDrawer}>Vàng 9999: <b>{`${formData.gia9999}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</b></Tag>,
                        <Button key="3"onClick={save} ><SaveTwoTone />Lưu</Button>,
                        <Button key="2" onClick={printPhieu}><PrinterTwoTone /> In </Button>,
                        <Button key="1" type="primary" ><ProjectOutlined />Lưu và in</Button>,
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
                            size={componentSize} >
                            <Form.Item hidden label="Form Size"
                                name="size" >
                                <Radio.Group >
                                    <Radio.Button value="small" > Small </Radio.Button>
                                    <Radio.Button value="default" > Default </Radio.Button>
                                    <Radio.Button value="large" > Large </Radio.Button>
                                </Radio.Group> </Form.Item>
                            <Form.Item label="Mã số phiếu" name="key" >
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
                                </Form.Item> <Form.Item name="trongluongthuc"
                                    rules={
                                        [{ required: true }]}
                                    style={
                                        { display: 'inline-block', width: 'calc(32% - 4px)', margin: '0 0px' }}
                                    className={currentInput === 'truongluongthuc' ? 'input-focused' : ''}
                                    onClick={() => setCurrentInput('trongluongthuc')} >
                                    <Input placeholder="Thực" disabled />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item label="Tiền cầm" name="tiencam">
                                <Input className={currentInput === 'tiencam' ? 'input-focused' : ''} />
                            </Form.Item>
                            <Form.Item label="Ngày cầm - chuộc" name="ngayChuocCam" >
                                <RangePicker defaultValue={[moment(`${moment().format(dateFormat)}`), moment(`${moment().add(30, 'days')}`)]} format={dateFormat} />
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
                                    <Button type="warning" size="large" onClick={() => btnClick('18K')} > 18K </Button>
                                    <Button type="default" size="large" onClick={() => btnClick('N', true)} > N </Button>
                                </Row>
                                <Row >
                                    <Button type="success" size="large" onClick={() => btnClick('4')} > 4 </Button>
                                    <Button type="success" size="large" onClick={() => btnClick('5')} > 5 </Button>
                                    <Button type="success" size="large" onClick={() => btnClick('6')} > 6 </Button>
                                    <Button type="warning" size="large" onClick={() => btnClick('24K')} > 24K </Button>
                                    <Button type="default" size="large" onClick={() => btnClick('V', true)} > V </Button>
                                </Row>
                                <Row >
                                    <Button type="success" size="large" onClick={() => btnClick('7')} > 7 </Button>
                                    <Button type="success" size="large" onClick={() => btnClick('8')} > 8 </Button>
                                    <Button type="success" size="large" onClick={() => btnClick('9')} > 9 </Button>
                                    <Button type="warning" size="large" onClick={() => btnClick('9999')} > 9999 </Button>
                                    <Button type="default" size="large" onClick={() => btnClick('D', true)} > D </Button>
                                </Row>
                                <Row >
                                    <Button type="danger" size="large" onClick={() => btnClick('D')} > Xóa </Button>
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

            </Layout>
        </div>
    );
}
export default TaoPhieu;

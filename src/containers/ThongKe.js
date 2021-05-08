import React, { useState, useEffect } from 'react';
import { PageHeader, Layout, Radio, Form, Drawer } from 'antd';
// import { SaveTwoTone, PrinterTwoTone, ProjectOutlined } from '@ant-design/icons';
import BangThongKe from '../components/bangThongKe';
import { getCamDo } from '../utils/db';
import ChiTiet from '../components/chitiet';

const defData = {
  key: 'tatca'
}

function ThongKe() {
  const [table, updateTable] = useState([]);
  const [curRow, setCurRow] = useState({});
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const getData = (key) => {
    getCamDo(key, (res) => updateTable(res));
  }
  useEffect(() => {
    getData('tatca');
    form.setFieldsValue(defData)
  }, []);
  const onKeyChange = (e) => {
    getCamDo(e.key, (res) => updateTable(res));
  }
  const _selectRow = (r) => {
    setCurRow(r);
    setVisible(true);
    console.log(r);
  }
  const onClose = () => {
    setVisible(false);
  };
  return (
    <div>
      <Drawer
        title="Thông tin cầm đồ"
        placement="right"
        closable={false}
        visible={visible}
        onClose={onClose}
        width={720}
      >
        <ChiTiet data={curRow} />
      </Drawer>
      <PageHeader className="site-page-header"
        onBack={
          () => null}
        title="Quản lý dữ liệu"
        subTitle=""
        extra={
          (<Form form={form} onValuesChange={onKeyChange} >
            <Form.Item name="key">
                <Radio.Group key='1' >
                <Radio.Button key='5' value="tatca">Tất cả</Radio.Button>
                <Radio.Button key='2' value="conhan">Còn hạn</Radio.Button>
                <Radio.Button key='3' value="quahan">Quá hạn</Radio.Button>
                <Radio.Button key='4' value="dachuoc">Đã chuộc</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Form>
          )}
      />
      <Layout style={{ padding: 5 }}>
        <BangThongKe data={table} onSelectRow={_selectRow} />
      </Layout>
    </div>
  );
}

export default ThongKe;

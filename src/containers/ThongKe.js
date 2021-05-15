import React, { useState, useEffect } from 'react';
import { PageHeader, Layout, Radio, Form, Drawer, Input } from 'antd';
// import { SaveTwoTone, PrinterTwoTone, ProjectOutlined } from '@ant-design/icons';
import BangThongKe from '../components/bangThongKe';
import { getCamDo, timKiem } from '../utils/db';
import ChiTiet from '../components/chitiet';


const { Search } = Input;

const defData = {
  key: 'tatca'
}

function ThongKe() {
  const [table, updateTable] = useState([]);
  const [curRow, setCurRow] = useState({});
  const [curKey, setCurKey] = useState('tatca')
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
    setCurKey(e.key);
    getCamDo(e.key, (res) => updateTable(res));
  }
  const _selectRow = async (r) => {
    await setCurRow(r);
    setVisible(true);
  }
  const onClose = (reload) => {
    console.log(reload);
    if (reload) getData(curKey);
    setVisible(false);
  };
  const onSearch = (e) => {
    console.log(e);
    timKiem(e, res => {
      updateTable(res)
    })
  }
  const onSearched = (data) => {
    setCurRow(data)
  }
  return (
    <div>
      <Drawer
        title="Thông tin cầm đồ"
        placement="right"
        closable={true}
        visible={visible}
        onClose={onClose}
        width={720}
      >
        <ChiTiet data={curRow} close={onClose} quetphieu={false} onSearched={onSearched} />
      </Drawer>
      <PageHeader className="site-page-header"
        onBack={
          () => null}
        title="Quản lý dữ liệu"
        subTitle=""
        extra={
          (<Form form={form} onValuesChange={onKeyChange} layout="inline" >
            <Form.Item name="search" >
              <Search
                placeholder="Tìm kiếm"
                allowClear
                onSearch={onSearch} />
            </Form.Item>
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

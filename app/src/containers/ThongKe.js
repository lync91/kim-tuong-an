import React, {useState, useEffect} from 'react';
import { PageHeader, Layout, Tag, Button } from 'antd';
import { SaveTwoTone, PrinterTwoTone, ProjectOutlined } from '@ant-design/icons';
import BangThongKe from '../components/bangThongKe';

const { ipcRenderer } = window.require('electron');

function ThongKe() {
    const [count, setCount] = useState(0);
    const [table, updateTable] = useState([]);
    useEffect(() => {
        console.log('mounted');
        ipcRenderer.send('getData', '');
    }, []);
    ipcRenderer.on('tableResult', (e, ar) => {
        console.log(ar);
        updateTable(ar);
    });
    return (
        <div>
            <PageHeader className="site-page-header"
                onBack={
                    () => null}
                title="Tạo phiếu cầm"
                subTitle=""
                extra={
                    [
                        <Tag key="4" className="tag-gia" color="volcano">Vàng 18K: <b>2.900.000</b></Tag>,
                        <Tag key="5" className="tag-gia" color="orange">Vàng 24K: <b>4.900.000</b></Tag>,
                        <Tag key="6" className="tag-gia" color="gold">Vàng 9999: <b>4.900.000</b></Tag>,
                        <Button key="3" ><SaveTwoTone />Lưu</Button>,
                        <Button key="2" ><PrinterTwoTone /> In </Button>,
                        <Button key="1" ><ProjectOutlined />Lưu và in</Button>,
                    ]
                }
            />
            <Layout>
                <BangThongKe data={table}/>
            </Layout>
        </div>
    );
}

export default ThongKe;

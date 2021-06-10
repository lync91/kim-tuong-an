import React from 'react';
import { Table, Space, Tag } from 'antd';
import moment from 'moment';
import { any } from 'prop-types';
const { Column, ColumnGroup } = Table;
const labelRender = (e, c) => {
  let text = '';
  let color = ''
  // var start = moment(c.ngaycam).format('X');
  var end = moment(c.ngayhethan).format('X');
  var now = moment().format('X');
  const han = (end - now) / (60*60*24);
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
  return (<Tag color={color} >{text}</Tag>)
}
const loaiVang = [
  {
    text: '18K',
    value: '18K',
  },
  {
    text: '23K',
    value: '23K',
  },
  {
    text: '9999',
    value: '9999',
  },
]
function BangThongKe(props) {
  const { data, onSelectRow } = props;
  return (
    <div>
      <Table className="bang-thong-ke"
        dataSource={data}
        pagination={{
          pageSize: 26,
        }}
        bordered
      >
        <Column title="id" dataIndex="id" key="id" />
        <Column title="Số phiếu" dataIndex="sophieu" key="sophieu" />
        <Column title="Tên khách" dataIndex="tenkhach" key="tenkhach" />
        <Column title="Món hàng" dataIndex="monhang" key="monhang" />
        <Column title="Loại vàng" dataIndex="loaivang" key="loaivang" filters={loaiVang} onFilter={(value, record) => record.loaivang.indexOf(value) === 0} />
        <ColumnGroup title="Khối lượng">
          <Column title="Tổng" dataIndex="tongtrongluong" key="tongtrongluong" />
          <Column title="Hột" dataIndex="trongluonghot" key="trongluonghot" />
          <Column title="Thực" dataIndex="trongluongthuc" key="trongluongthuc" />
        </ColumnGroup>
        <Column title="Ngày cầm" dataIndex="ngaycam" key="ngaycam" render={e => e ? moment(e).format('DD/MM/YYYY') : ''} />
        <Column title="Ngày gia hạn" dataIndex="ngaytinhlai" key="ngayhethan" render={e => e ? moment(e).format('DD/MM/YYYY') : ''} />
        <Column title="Ngày hết hạn" dataIndex="ngayhethan" key="ngayhethan" render={e => e ? moment(e).format('DD/MM/YYYY') : ''} />
        <Column title="Tiền cầm" render={e => `${e}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} dataIndex="tiencam" key="tiencam" />
        <Column title="Lãi suất" dataIndex="laisuat" key="laisuat" />
        <Column title="Tiền lãi" render={e => e ? `${e}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''} dataIndex="tienlai" key="tienlai" />
        <Column title="Tiền chuộc" render={e => e ? `${e}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''} dataIndex="tienchuoc" key="tienchuoc" />
        <Column title="Ngày chuộc" dataIndex="ngaychuoc" key="ngaychuoc" render={e => e ? moment(e).format('DD/MM/YYYY hh:mm a') : ''} />
        <Column title="Tủ đồ" dataIndex="tudo" key="tudo" />
        <Column
          title="Tình trạng"
          dataIndex="tags"
          key="tags"
          render={labelRender}
        />
        <Column
          title="Thao tác"
          key="action"
          render={(text, record) => (
            <Space size="middle">
              <a onClick={() => onSelectRow(record)}>Chi tiết</a>
            </Space>
          )}
        />
      </Table>
    </div>
  );
}
BangThongKe.propTypes = any;
export default BangThongKe;

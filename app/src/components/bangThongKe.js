import React, {useState, useEffect} from 'react';
import { Table, Tag, Space } from 'antd';
const { Column, ColumnGroup } = Table;

function BangThongKe(props) {
    const {data} = props;
    console.log(data);
    return (
        <div>
            <Table className="bang-thong-ke" dataSource={data}>
                <Column title="Số phiếu" dataIndex="firstName" key="firstName" />
                <Column title="Tên khách" dataIndex="firstName" key="firstName" />
                <Column title="Món hàng" dataIndex="firstName" key="firstName" />
                <Column title="Loại vàng" dataIndex="firstName" key="firstName" />
                <ColumnGroup title="Khối lượng">
                    <Column title="Tổng" dataIndex="firstName" key="firstName" />
                    <Column title="Hột" dataIndex="lastName" key="lastName" />
                    <Column title="Thực" dataIndex="lastName" key="lastName" />
                </ColumnGroup>
                <Column title="Giá nhập" dataIndex="firstName" key="firstName" />
                <Column title="Lãi suất" dataIndex="address" key="address" />
                <Column title="Lãi suất" dataIndex="address" key="address" />
                <Column title="Tiền lãi" dataIndex="address" key="address" />
                <Column title="Tiền chuộc" dataIndex="address" key="address" />
                {/* <Column
                    title="Tags"
                    dataIndex="tags"
                    key="tags"
                    render={tags => (
                        <>
                            {tags.map(tag => (
                                <Tag color="blue" key={tag}>
                                    {tag}
                                </Tag>
                            ))}
                        </>
                    )}
                /> */}
                <Column
                    title="Action"
                    key="action"
                    render={(text, record) => (
                        <Space size="middle">
                            <a>Invite {record.lastName}</a>
                            <a>Delete</a>
                        </Space>
                    )}
                />
            </Table>
        </div>
    )
}

export default BangThongKe;

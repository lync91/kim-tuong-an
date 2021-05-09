import React from 'react';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';

import {
  Layout,
  Button,
  Menu,
} from 'antd';

const { Header, Footer, Sider, Content } = Layout;

import Home from './Home';
import TaoPhieu from './taoPhieu';
import ThongKe from './ThongKe';
import {
  PieChartOutlined,
  FormatPainterOutlined,
  ScanOutlined,
  DatabaseOutlined
} from '@ant-design/icons';

import '../assets/css/App.css'

function App() {
  return (
    <Router>
      <Layout>
        <Header hidden>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Sider className="p-5">
            <Link to="/"><Button type="primary" className="m-t-10" size="large" block><PieChartOutlined />Báo cáo</Button></Link>
            <Link to="/taophieu"><Button type="primary" className="m-t-10" size="large" block><FormatPainterOutlined />Tạo phiếu cầm</Button></Link>
            <Link to="/about"><Button type="primary" className="m-t-10" size="large" block><ScanOutlined />Quét phiếu cầm</Button></Link>
            <Link to="/thongKe"><Button type="primary" className="m-t-10" size="large" block><DatabaseOutlined />Quản lý dữ liệu</Button></Link>
          </Sider>
          <Content>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/about">
                <Home />
              </Route>
              <Route path="/dashboard">
                <Home />
              </Route>
              <Route path="/taophieu">
                <TaoPhieu />
              </Route>
              <Route path="/thongKe">
                <ThongKe />
              </Route>
            </Switch>
          </Content>
        </Layout>
        <Footer hidden>Footer</Footer>
      </Layout>
    </Router>
  )
}

export default App

import React, { Component } from 'react';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { remote } from 'electron';

import {
    Layout,
    Button,
    // Col,
    // Row,
    Menu } from 'antd';
import Home from './Home';
import TaoPhieu from './taoPhieu';
import ThongKe from './ThongKe';
import MainRedux from './Main_copy';
import {
    PieChartOutlined,
    FormatPainterOutlined,
    ScanOutlined,
    SearchOutlined,
    DatabaseOutlined
} from '@ant-design/icons';

const { Header, Footer, Sider, Content } = Layout;

// const mainWindow = remote.getCurrentWindow();

class Main extends Component {
    static propTypes = {
        dispatch: PropTypes.func,
        settings: PropTypes.object
    };
    constructor() {
        super();
        this.state = {
            counter: 0
        };
    }
    btnAbout() {
    }
    render() {
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
                            <Link to="/"><Button type="primary" className="m-t-10" size="large" block><SearchOutlined />Tìm kiếm</Button></Link>
                            <Link to="/thongKe"><Button type="primary" className="m-t-10" size="large" block><DatabaseOutlined />Thống kê</Button></Link>
                            <Link to="/redux"><Button type="primary" className="m-t-10" size="large" block><DatabaseOutlined />Test</Button></Link>
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
                                <Route path="/redux">
                                    <MainRedux />
                                </Route>
                            </Switch>
                        </Content>
                    </Layout>
                    <Footer hidden>Footer</Footer>
                </Layout>
            </Router>
        );
    }
}

const mapStateToProps = (state) => { return { ...state }; };
export default connect(mapStateToProps)(Main);

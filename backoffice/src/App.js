import React, { useState } from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import "./App.css";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Switch, Route, useHistory, useLocation, Link } from "react-router-dom";

import Post from "./Post/Post";
import User from "./User/User";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default function App() {
  const [state, setState] = useState({ collapsed: false });
  const location = useLocation();

  const onCollapse = (collapsed) => {
    console.log(collapsed);
    setState({ collapsed });
  };
  console.log(location.pathname);
  return (
    <Layout className="base-layout">
      <Header className="header">
        <div className="logo">pinterest-server</div>
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
      </Header>
      <Layout className="site-layout">
        <Sider collapsible collapsed={state.collapsed} onCollapse={onCollapse}>
          <Menu
            theme="dark"
            defaultSelectedKeys={[
              location.pathname === "/"
                ? "dashboard"
                : location.pathname.split("/")[1],
            ]}
            mode="inline"
          >
            <Menu.Item
              key="dashboard"
              icon={<PieChartOutlined />}
              className="first-menu-item"
            >
              <Link to="/">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="user" icon={<UserOutlined />}>
              <Link to="/user">Users</Link>
            </Menu.Item>
            <Menu.Item key="post" icon={<TeamOutlined />}>
              <Link to="/post">Posts</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <Content className="content">
            <Switch>
              <Route exact path="/" component={() => <div>Dashboard</div>} />
              <Route exact path="/user" component={User} />
              <Route exact path="/post" component={Post} />
            </Switch>
          </Content>
          <Footer className="footer">
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
}

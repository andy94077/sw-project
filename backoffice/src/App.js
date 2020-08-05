import React, { useState } from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import "./App.css";
import {
  PieChartOutlined,
  TeamOutlined,
  FileTextOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Switch, Route, useLocation, Link } from "react-router-dom";

import Post from "./Post/Post";
import User from "./User/User";

const { Header, Content, Footer, Sider } = Layout;

export default function App() {
  const [user, setUser] = useState({ username: "admin", userId: null });
  const location = useLocation();

  return (
    <Layout className="base-layout">
      <Header className="header">
        <div className="logo">sw-project-backoffice</div>
        <Menu
          theme="dark"
          mode="horizontal"
          className="horizontal-menu"
          selectable={false}
          triggerSubMenuAction="click"
        >
          <Menu.SubMenu icon={<UserOutlined />} title={user.username}>
            <Menu.Item>Log out</Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Header>
      <Layout className="site-layout">
        <Sider collapsible>
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
            <Menu.Item key="user" icon={<TeamOutlined />}>
              <Link to="/user">Users</Link>
            </Menu.Item>
            <Menu.Item key="post" icon={<FileTextOutlined />}>
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
            sw-project ©2020 Created by Funpodium
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
}

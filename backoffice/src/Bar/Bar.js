import React from "react";
import { Layout, Menu } from "antd";
import "./Bar.css";
import {
  PieChartOutlined,
  TeamOutlined,
  FileTextOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useLocation, useHistory, Link } from "react-router-dom";

import { deleteCookie } from "../cookieHelper";

const { Header, Content, Footer, Sider } = Layout;

export default function Bar(props) {
  const { username, content } = props;
  const history = useHistory();
  const location = useLocation();

  const logOut = () => {
    deleteCookie();
    history.push("/");
  };

  return (
    <Layout className="base-layout">
      <Header className="header">
        <div className="logo">{"sw-project back office"}</div>
        <Menu
          theme="dark"
          mode="horizontal"
          className="horizontal-menu"
          selectable={false}
          triggerSubMenuAction="click"
        >
          <Menu.SubMenu icon={<UserOutlined />} title={username}>
            <Menu.Item onClick={logOut}>Log out</Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Header>
      <Layout className="site-layout">
        <Sider collapsible>
          <Menu
            theme="dark"
            defaultSelectedKeys={[location.pathname.split("/").slice(-1)[0]]}
            mode="inline"
          >
            <Menu.Item
              key="dashboard"
              icon={<PieChartOutlined />}
              className="first-menu-item"
            >
              <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="user" icon={<TeamOutlined />}>
              <Link to="/user">Users</Link>
            </Menu.Item>
            <Menu.Item key="post" icon={<FileTextOutlined />}>
              <Link to="/post">Posts</Link>
            </Menu.Item>
            <Menu.Item key="BOUser" icon={<TeamOutlined />}>
              <Link to="/BOUser">BO Users</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content className="content">
            <div style={{ margin: "0 16px" }}>{content}</div>
          </Content>
          <Footer className="footer">
            sw-project ©2020 Created by Funpodium
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
}

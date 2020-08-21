import React from "react";
import { useSelector } from "react-redux";
import { Layout, Menu } from "antd";
import "./Container.css";
import {
  PieChartOutlined,
  TeamOutlined,
  FileTextOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useLocation, useHistory, Link } from "react-router-dom";

import { selectUser } from "../redux/userSlice";
import { deleteCookie } from "../cookieHelper";

const { Header, Content, Footer, Sider } = Layout;

export default function Container(props) {
  const { content } = props;
  const { username, roles, permissions } = useSelector(selectUser);
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
          <Menu.Item className="role">{`Role: ${roles.join(", ")}`}</Menu.Item>
          <Menu.SubMenu icon={<UserOutlined />} title={username}>
            <Menu.Item onClick={logOut}>Log out</Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Header>
      <Layout className="site-layout">
        <Sider collapsible className="site-sider">
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
            {permissions.includes("view_BO_user") && (
              <Menu.Item key="BOUser" icon={<TeamOutlined />}>
                <Link to="/BOUser">BO Users</Link>
              </Menu.Item>
            )}
            {permissions.includes("make_announcement") && (
              <Menu.Item key="Announcement" icon={<TeamOutlined />}>
                <Link to="/Announcement">Announcement</Link>
              </Menu.Item>
            )}
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

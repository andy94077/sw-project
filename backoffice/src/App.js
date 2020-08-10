import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Menu } from "antd";
import "./App.css";
import {
  PieChartOutlined,
  TeamOutlined,
  FileTextOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Switch, Route, useLocation, useHistory, Link } from "react-router-dom";

import Post from "./Post/Post";
import User from "./User/User";
import LoginPage from "./Login/LoginPage";
import BOUser from "./BOUser/BOUser";
import ErrorMsg from "./components/ErrorMsg";
import Loading from "./components/Loading";

import { getCookie, deleteCookie } from "./cookieHelper";
import { CONCAT_SERVER_URL } from "./constants";
import Dashboard from "./Dashboard/Dashboard";

const { Header, Content, Footer, Sider } = Layout;

export default function App() {
  const [user, setUser] = useState({ username: null, userId: null });
  const [isReady, setIsReady] = useState(true);
  const [error, setError] = useState({ message: "", url: "" });
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const accessToken = getCookie();
    setError({ message: "", url: "" });
    setUser({ username: null, userId: null });
    if (location.pathname !== "/" || accessToken !== null) {
      setIsReady(false);
      axios
        .post(CONCAT_SERVER_URL("/api/v1/superUser/authentication"), {
          accessToken,
        })
        .then((res) => {
          if (res.data.isValid === true) {
            setUser({ username: res.data.username, userId: res.data.user_id });
            if (location.pathname === "/") history.push("/dashboard");
          } else {
            deleteCookie();
            history.push("/");
          }
        })
        .catch(() => {
          setError({
            message: "Connection Error",
            url: "/pictures/connection-error.svg",
          });
        })
        .finally(() => setIsReady(true));
    }
  }, [location, history]);

  const logOut = () => {
    deleteCookie();
    history.push("/");
  };

  if (isReady) {
    if (error.message !== "") {
      return <ErrorMsg message={error.message} imgUrl={error.url} />;
    }
    if (location.pathname === "/") {
      return (
        <Switch>
          <Route exact path="/" component={LoginPage} />
        </Switch>
      );
    }
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
                <Link to={"/"}>Dashboard</Link>
              </Menu.Item>
              <Menu.Item key="user" icon={<TeamOutlined />}>
                <Link to={"/user"}>Users</Link>
              </Menu.Item>
              <Menu.Item key="post" icon={<FileTextOutlined />}>
                <Link to={"/post"}>Posts</Link>
              </Menu.Item>
              <Menu.Item key="BOUser" icon={<TeamOutlined />}>
                <Link to={"/BOUser"}>BO Users</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Content className="content">
              <Switch>
                <Route exact path={"/dashboard"} component={Dashboard} />
                <Route exact path={"/user"} component={User} />
                <Route exact path={"/post"} component={Post} />
                <Route exact path={"/BOUser"} component={BOUser} />
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
  return <Loading />;
}

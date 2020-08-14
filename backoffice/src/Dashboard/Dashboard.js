import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Typography, List, message } from "antd";
import {
  UserOutlined,
  UserAddOutlined,
  TeamOutlined,
  FileDoneOutlined,
  FileAddOutlined,
  MessageOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { format } from "date-fns";
import sha256 from "js-sha256";

import "./Dashboard.css";
import { CONCAT_SERVER_URL, REDIS_URL } from "../constants";

import Echo from "laravel-echo";
import io from "socket.io-client";

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState({ valid: 0, online: 0, new: 0 });
  const [postInfo, setPostInfo] = useState({ valid: 0, new: 0 });
  const [commentUnfo, setCommentInfo] = useState({ valid: 0, new: 0 });
  const [latestPosts, setLatestPosts] = useState([]);
  const [latestComments, setLatestComments] = useState([]);
  const [latestLikes, setLatestLikes] = useState([]);
  const [isCardLoading, setIsCardLoading] = useState(false);
  const [isListLoading, setIsListLoading] = useState(false);
  const [onlineUser, setOnlineUser] = useState({});

  // Broadcast
  useEffect(() => {
    window.io = io;
    window.Echo = new Echo({
      broadcaster: "socket.io",
      host: REDIS_URL, // this is laravel-echo-server host
      auth: {
        headers: {
          Authorization: `Bearer ${sha256("admin")}`,
        },
      },
    });

    window.Echo.join("Online")
      .here((users) =>
        setOnlineUser((prevUsers) => ({
          ...prevUsers,
          ...Object.fromEntries(users.map((user) => [user.id, user])),
        }))
      )
      .joining((user) =>
        setOnlineUser((prevUsers) => ({ ...prevUsers, [user.id]: user }))
      )
      .leaving((user) =>
        setOnlineUser((prevUsers) => {
          const newUsers = { ...prevUsers };
          delete newUsers[user.id];
          return newUsers;
        })
      );

    window.Echo.channel("Dashboard").listen("PostChanged", () => {
      const timer1 = setTimeout(() => setIsCardLoading(true), 1000);
      axios
        .get(CONCAT_SERVER_URL("/api/v1/posts/info"))
        .then((res) => {
          setPostInfo(res.data);
        })
        .finally(() => {
          clearTimeout(timer1);
          setIsCardLoading(false);
        });

      const timer2 = setTimeout(() => setIsListLoading(true), 1000);
      axios
        .get(CONCAT_SERVER_URL("/api/v1/posts/latest"))
        .then((res) => {
          setLatestPosts(res.data);
        })
        .finally(() => {
          clearTimeout(timer2);
          setIsListLoading(false);
        });
    });

    window.Echo.channel("Dashboard").listen("CommentChanged", () => {
      const timer1 = setTimeout(() => setIsCardLoading(true), 1000);
      axios
        .get(CONCAT_SERVER_URL("/api/v1/comments/info"))
        .then((res) => {
          setCommentInfo(res.data);
        })
        .finally(() => {
          clearTimeout(timer1);
          setIsCardLoading(false);
        });

      const timer2 = setTimeout(() => setIsListLoading(true), 1000);
      axios
        .get(CONCAT_SERVER_URL("/api/v1/comments/latest"))
        .then((res) => {
          setLatestComments(res.data);
        })
        .finally(() => {
          clearTimeout(timer2);
          setIsListLoading(false);
        });
    });
  }, []);

  useEffect(() => {
    setIsCardLoading(true);
    const user = axios.get(CONCAT_SERVER_URL("/api/v1/users/info"));
    const comment = axios.get(CONCAT_SERVER_URL("/api/v1/comments/info"));
    const post = axios.get(CONCAT_SERVER_URL("/api/v1/posts/info"));
    Promise.all([user, comment, post])
      .then((res) => {
        setUserInfo((info) => ({
          ...info,
          valid: res[0].data.valid,
          new: res[0].data.new,
        }));
        setCommentInfo(res[1].data);
        setPostInfo(res[2].data);
      })
      .finally(() => {
        setIsCardLoading(false);
      });

    setIsListLoading(true);
    const postLatest = axios.get(CONCAT_SERVER_URL("/api/v1/posts/latest"));
    const commentLatest = axios.get(
      CONCAT_SERVER_URL("/api/v1/comments/latest")
    );
    const likeLatest = axios.get(CONCAT_SERVER_URL("/api/v1/likes/latest"));
    Promise.all([postLatest, commentLatest, likeLatest])
      .then((res) => {
        setLatestPosts(res[0].data);
        setLatestComments(res[1].data);
        setLatestLikes(res[2].data);
      })
      .finally(() => {
        setIsListLoading(false);
      });
  }, []);

  useEffect(
    () =>
      setUserInfo((info) => ({
        ...info,
        online: Math.max(Object.keys(onlineUser).length - 1, 0), // exclude admin user
      })),
    [onlineUser]
  );

  return (
    <div style={{ backgroundColor: "rgb(0, 0 , 0, 0.0)" }}>
      {message.loading({
        key: "loading",
        content: "Loading...",
        duration: 0,
        style: {
          display: isCardLoading || isListLoading ? "block" : "none",
        },
      })}
      <Card style={{ backgroundColor: "rgb(0, 0 , 0, 0.0)" }} bordered={false}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <div
              style={{
                background: "rgb(200, 200 , 200, 0.4)",
                padding: "7px",
              }}
            >
              <Card hoverable bodyStyle={{ display: "flex" }}>
                <UserOutlined
                  style={{ display: "inline-block", fontSize: "55px" }}
                />
                <div style={{ width: "10%" }} />
                <Statistic
                  title="Valid Users"
                  value={userInfo.valid}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </div>
          </Col>
          <Col span={8}>
            <div
              style={{
                background: "rgb(200, 200 , 200, 0.4)",
                padding: "7px",
              }}
            >
              <Card hoverable bodyStyle={{ display: "flex" }}>
                <TeamOutlined
                  style={{ display: "inline-block", fontSize: "55px" }}
                />
                <div style={{ width: "10%" }} />
                <Statistic
                  title="Online Users"
                  value={userInfo.online}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </div>
          </Col>
          <Col span={8}>
            <div
              style={{
                background: "rgb(200, 200 , 200, 0.4)",
                padding: "7px",
              }}
            >
              <Card hoverable bodyStyle={{ display: "flex" }}>
                <UserAddOutlined
                  style={{ display: "inline-block", fontSize: "55px" }}
                />
                <div style={{ width: "10%" }} />
                <Statistic
                  title="New Users(in 1 day)"
                  value={userInfo.new}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </div>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div
              style={{
                background: "rgb(200, 200 , 200, 0.4)",
                padding: "7px",
              }}
            >
              <Card hoverable bodyStyle={{ display: "flex" }}>
                <FileDoneOutlined
                  style={{ display: "inline-block", fontSize: "55px" }}
                />
                <div style={{ width: "10%" }} />
                <Statistic
                  title="Valid Posts"
                  value={postInfo.valid}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </div>
          </Col>
          <Col span={12}>
            <div
              style={{
                background: "rgb(200, 200 , 200, 0.4)",
                padding: "7px",
              }}
            >
              <Card hoverable bodyStyle={{ display: "flex" }}>
                <FileAddOutlined
                  style={{ display: "inline-block", fontSize: "55px" }}
                />
                <div style={{ width: "10%" }} />
                <Statistic
                  title="New Posts(in 1 day)"
                  value={postInfo.new}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </div>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div
              style={{
                background: "rgb(200, 200 , 200, 0.4)",
                padding: "7px",
              }}
            >
              <Card hoverable bodyStyle={{ display: "flex" }}>
                <MessageOutlined
                  style={{ display: "inline-block", fontSize: "55px" }}
                />
                <div style={{ width: "10%" }} />
                <Statistic
                  title="Valid Comments"
                  value={commentUnfo.valid}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </div>
          </Col>
          <Col span={12}>
            <div
              style={{
                background: "rgb(200, 200 , 200, 0.4)",
                padding: "7px",
              }}
            >
              <Card hoverable bodyStyle={{ display: "flex" }}>
                <CloudUploadOutlined
                  style={{ display: "inline-block", fontSize: "55px" }}
                />
                <div style={{ width: "10%" }} />
                <Statistic
                  title="New Comments(in 1 hour)"
                  value={commentUnfo.new}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </div>
          </Col>
        </Row>
      </Card>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card hoverable style={{ backgroundColor: "rgb(255, 255 , 253)" }}>
            <List
              header="Latest Post Change"
              bordered
              dataSource={latestPosts}
              renderItem={(item) => {
                return (
                  <List.Item>
                    <Typography.Text mark>
                      [{item.created_at === item.updated_at ? "NEW" : "EDIT"}]
                    </Typography.Text>
                    {`\t${item.username} send "${item.content}" at ${format(
                      new Date(item.updated_at),
                      "yyyy-MM-dd HH:mm:ss"
                    )}`}
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card hoverable style={{ backgroundColor: "rgb(255, 255 , 253)" }}>
            <List
              header="Latest Comment Change"
              bordered
              style={{ backgroundColor: "rgb(0, 0 ,0 ,0)" }}
              dataSource={latestComments}
              renderItem={(item) => (
                <List.Item>
                  <Typography.Text mark>
                    [{item.created_at === item.updated_at ? "NEW" : "EDIT"}]
                  </Typography.Text>
                  {`\t${item.username} send "${item.content}" on post ${
                    item.post_id
                  }  at ${format(
                    new Date(item.updated_at),
                    "yyyy-MM-dd HH:mm:ss"
                  )}`}
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card hoverable style={{ backgroundColor: "rgb(255, 255 , 253)" }}>
            <List
              header="Latest Likes Change"
              bordered
              dataSource={latestLikes}
              renderItem={(item) => {
                return (
                  <List.Item>
                    {`\t${item.username} likes post ${item.post_id} at ${format(
                      new Date(item.updated_at),
                      "yyyy-MM-dd HH:mm:ss"
                    )}`}
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

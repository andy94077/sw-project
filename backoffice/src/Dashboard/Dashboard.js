import React, { useState } from "react";
import { Row, Col, Card, Statistic, Typography, List, message } from "antd";
import Axios from "axios";
import { CONCAT_SERVER_URL, REDIS_URL, SERVER_URL } from "../constants";

import { useEffect } from "react";
import { format } from "date-fns";
import "./Dashboard.css";

import Echo from "laravel-echo";
import io from "socket.io-client";

export default function Dashboard(props) {
  const { user } = props;
  const [userInfo, setUserInfo] = useState({ valid: 0, online: 0, new: 0 });
  const [postInfo, setPostInfo] = useState({ valid: 0, new: 0 });
  const [commentUnfo, setCommentInfo] = useState({ valid: 0, new: 0 });
  const [latestPosts, setLatestPosts] = useState([]);
  const [latestComments, setLatestComments] = useState([]);
  const [isCardLoading, setIsCardLoading] = useState(false);
  const [isListLoading, setIsListLoading] = useState(false);

  // Broadcast
  useEffect(() => {
    window.io = io;
    window.Echo = new Echo({
      broadcaster: "socket.io",
      host: REDIS_URL, // this is laravel-echo-server host
      authEndpoint: "/super/broadcasting/auth",
      auth: {
        headers: {
          Authorization: `Bearer ${user.apiToken}`,
        },
      },
    });
    console.log(window.Echo);

    window.Echo.join("Online")
      .here(() => console.log(user.username, "join"))
      .joining((user) => console.log(user, "join"))
      .leaving((user) => console.log(user, "leave"));

    window.Echo.channel("Dashboard").listen("PostChanged", () => {
      const timer1 = setTimeout(() => setIsCardLoading(true), 1000);
      Axios.get(CONCAT_SERVER_URL("/api/v1/posts/info"))
        .then((res) => {
          setPostInfo(res.data);
        })
        .finally(() => {
          clearTimeout(timer1);
          setIsCardLoading(false);
        });

      const timer2 = setTimeout(() => setIsListLoading(true), 1000);
      Axios.get(CONCAT_SERVER_URL("/api/v1/posts/latest"))
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
      Axios.get(CONCAT_SERVER_URL("/api/v1/comments/info"))
        .then((res) => {
          setCommentInfo(res.data);
        })
        .finally(() => {
          clearTimeout(timer1);
          setIsCardLoading(false);
        });

      const timer2 = setTimeout(() => setIsListLoading(true), 1000);
      Axios.get(CONCAT_SERVER_URL("/api/v1/comments/latest"))
        .then((res) => {
          setLatestComments(res.data);
        })
        .finally(() => {
          clearTimeout(timer2);
          setIsListLoading(false);
        });
    });
  }, [user.apiToken, user.username]);

  useEffect(() => {
    getInfo();
    getLatestInfo();
  }, []);

  async function getInfo() {
    setIsCardLoading(true);
    const user = Axios.get(CONCAT_SERVER_URL("/api/v1/users/info"));
    const comment = Axios.get(CONCAT_SERVER_URL("/api/v1/comments/info"));
    const post = Axios.get(CONCAT_SERVER_URL("/api/v1/posts/info"));
    Promise.all([user, comment, post])
      .then((res) => {
        setUserInfo(res[0].data);
        setCommentInfo(res[1].data);
        setPostInfo(res[2].data);
      })
      .finally(() => {
        setIsCardLoading(false);
      });
  }

  async function getLatestInfo() {
    setIsListLoading(true);
    const post = Axios.get(CONCAT_SERVER_URL("/api/v1/posts/latest"));
    const comment = Axios.get(CONCAT_SERVER_URL("/api/v1/comments/latest"));
    Promise.all([post, comment])
      .then((res) => {
        setLatestPosts(res[0].data);
        setLatestComments(res[1].data);
      })
      .finally(() => {
        setIsListLoading(false);
      });
  }

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
              <Card hoverable>
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
              <Card hoverable>
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
              <Card hoverable>
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
              <Card hoverable>
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
              <Card hoverable>
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
              <Card hoverable>
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
              <Card hoverable>
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
                  {`\t${item.username} send "${item.content}" at ${format(
                    new Date(item.updated_at),
                    "yyyy-MM-dd HH:mm:ss"
                  )}`}
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

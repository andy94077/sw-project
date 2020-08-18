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
import { REDIS_URL } from "../constants";
import { CONCAT_SERVER_URL } from "../utils";

import Echo from "laravel-echo";
import io from "socket.io-client";

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState({ valid: 0, online: 0, new: 0 });
  const [postInfo, setPostInfo] = useState({ valid: 0, new: 0 });
  const [commentUnfo, setCommentInfo] = useState({ valid: 0, new: 0 });
  const [latestPosts, setLatestPosts] = useState([]);
  const [latestComments, setLatestComments] = useState([]);
  const [latestLikes, setLatestLikes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [onlineUser, setOnlineUser] = useState({});

  useEffect(() => {
    document.title = "Dashboard";
  }, []);

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
      socketio: { pingTimeout: 30000 },
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
      const timer = setTimeout(() => setIsLoading(true), 1000);
      axios
        .all([
          axios.get(CONCAT_SERVER_URL("/api/v1/posts/info")),
          axios.get(CONCAT_SERVER_URL("/api/v1/posts/latest")),
        ])
        .then(
          axios.spread((postResponse, latestPostResponse) => {
            setPostInfo(postResponse.data);
            setLatestPosts(latestPostResponse.data);
          })
        )
        .finally(() => {
          clearTimeout(timer);
          setIsLoading(false);
        });
    });

    window.Echo.channel("Dashboard").listen("CommentChanged", () => {
      const timer = setTimeout(() => setIsLoading(true), 1000);
      axios
        .all([
          axios.get(CONCAT_SERVER_URL("/api/v1/comments/info")),
          axios.get(CONCAT_SERVER_URL("/api/v1/comments/latest")),
        ])
        .then(
          axios.spread((commentResponse, latestCommentResponse) => {
            setCommentInfo(commentResponse.data);
            setLatestComments(latestCommentResponse.data);
          })
        )
        .finally(() => {
          clearTimeout(timer);
          setIsLoading(false);
        });
    });

    window.Echo.channel("Dashboard").listen("LikeChanged", () => {
      const timer = setTimeout(() => setIsLoading(true), 1000);
      axios
        .get(CONCAT_SERVER_URL("/api/v1/likes/latest"))
        .then((res) => setLatestLikes(res.data))
        .finally(() => {
          clearTimeout(timer);
          setIsLoading(false);
        });
    });

    return () => window.Echo.disconnect();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const user = axios.get(CONCAT_SERVER_URL("/api/v1/users/info"));
    const comment = axios.get(CONCAT_SERVER_URL("/api/v1/comments/info"));
    const post = axios.get(CONCAT_SERVER_URL("/api/v1/posts/info"));
    const postLatest = axios.get(CONCAT_SERVER_URL("/api/v1/posts/latest"));
    const commentLatest = axios.get(
      CONCAT_SERVER_URL("/api/v1/comments/latest")
    );
    const likeLatest = axios.get(CONCAT_SERVER_URL("/api/v1/likes/latest"));
    axios
      .all([user, comment, post, postLatest, commentLatest, likeLatest])
      .then(
        axios.spread(
          (
            userResponse,
            commentResponse,
            PostResponse,
            latestPostResponse,
            latestCommentResponse,
            latestLikeResponse
          ) => {
            setUserInfo((info) => ({
              ...info,
              valid: userResponse.data.valid,
              new: userResponse.data.new,
            }));
            setCommentInfo(commentResponse.data);
            setPostInfo(PostResponse.data);
            setLatestPosts(latestPostResponse.data);
            setLatestComments(latestCommentResponse.data);
            setLatestLikes(latestLikeResponse.data);
          }
        )
      )
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(
    () =>
      setUserInfo((info) => ({
        ...info,
        online: Math.max(Object.keys(onlineUser).length - 1, 0), // exclude the admin user
      })),
    [onlineUser]
  );

  return (
    <div style={{ backgroundColor: "rgb(0, 0 , 0, 0.0)" }}>
      {message.loading({
        // This component will produce a warning: Cannot update during an existing state transition (such as within `render`)
        key: "loading",
        content: "Loading...",
        duration: 0,
        style: { display: isLoading === true ? "block" : "none" },
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

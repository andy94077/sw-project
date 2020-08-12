import React, { useState } from "react";
import { Row, Col, Card, Statistic, Button, Typography, List } from "antd";
import Axios from "axios";
import { CONCAT_SERVER_URL } from "../constants";
import { useEffect } from "react";
import { format } from "date-fns";
import "./Dashboard.css";

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState({ valid: 0, online: 0, new: 0 });
  const [postInfo, setPostInfo] = useState({ valid: 0, new: 0 });
  const [commentUnfo, setCommentInfo] = useState({ valid: 0, new: 0 });
  const [latestPosts, setLatestPosts] = useState([]);
  const [latestComments, setLatestComments] = useState([]);
  const [isCardLoading, setIsCardLoading] = useState(true);
  const [isListLoading, setIsListLoading] = useState(true);

  useEffect(() => {
    refreshInfo();
    refreshLatestInfo();
    const timer = setInterval(() => {
      refreshInfo();
      refreshLatestInfo();
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  async function refreshInfo() {
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

  async function refreshLatestInfo() {
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
      <Button
        onClick={() => {
          setIsCardLoading(true);
          setIsListLoading(true);
          refreshInfo();
          refreshLatestInfo();
        }}
        loading={isCardLoading || isListLoading}
      >
        refresh
      </Button>
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

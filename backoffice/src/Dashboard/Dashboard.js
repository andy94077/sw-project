import React, { useState } from "react";
import { Row, Col, Statistic, Button, Typography, List } from "antd";
import Axios from "axios";
import { CONCAT_SERVER_URL } from "../constants";
import { useEffect } from "react";
import { Card } from "@material-ui/core";

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
    }, 30000);
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
    <>
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={2}></Col>
          <Col span={6}>
            <Statistic title="Valid Users" value={userInfo.valid} />
          </Col>
          <Col span={2}></Col>
          <Col span={6}>
            <Statistic title="Online Users" value={userInfo.online} />
          </Col>
          <Col span={2}></Col>
          <Col span={6}>
            <Statistic title="New Users(in 1 day)" value={userInfo.new} />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={3}></Col>
          <Col span={9}>
            <Statistic title="Valid Posts" value={postInfo.valid} />
          </Col>
          <Col span={3}></Col>
          <Col span={9}>
            <Statistic title="New Posts(in 1 day)" value={postInfo.new} />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={3}></Col>
          <Col span={9}>
            <Statistic title="Valid Comments" value={commentUnfo.valid} />
          </Col>
          <Col span={3}></Col>
          <Col span={9}>
            <Statistic
              title="New Comments(in 1 hour)"
              value={commentUnfo.new}
            />
          </Col>
        </Row>
        <Button
          onClick={() => {
            setIsCardLoading(true);
            refreshInfo();
          }}
          loading={isCardLoading}
        >
          refresh
        </Button>
      </Card>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card>
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
                    {`${item.username} send "${item.content}" at ${item.updated_at}`}
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <List
              header="Latest Comment Change"
              bordered
              dataSource={latestComments}
              renderItem={(item) => (
                <List.Item>
                  <Typography.Text mark>
                    [{item.created_at === item.updated_at ? "NEW" : "EDIT"}]
                  </Typography.Text>
                  {`${item.username} send "${item.content}" on post${item.post_id} at ${item.updated_at}`}
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
      <Button
        onClick={() => {
          setIsListLoading(true);
          refreshLatestInfo();
        }}
        loading={isListLoading}
      >
        refresh
      </Button>
    </>
  );
}

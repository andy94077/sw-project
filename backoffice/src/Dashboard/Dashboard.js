import React, { useState } from "react";
import { Row, Col, Statistic, Button } from "antd";
import Axios from "axios";
import { CONCAT_SERVER_URL } from "../constants";
import { useEffect } from "react";

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState({ valid: 0, online: 0, new: 0 });
  const [postInfo, setPostInfo] = useState({ valid: 0, new: 0 });
  const [commentUnfo, setCommentInfo] = useState({ valid: 0, new: 0 });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    refresh();
    const timer = setInterval(() => {
      refresh();
    }, 300000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  async function refresh() {
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
        setIsLoading(false);
      });
  }
  return (
    <>
      <Row gutter={16}>
        <Col span={8}>
          <Statistic title="Valid Users" value={userInfo.valid} />
        </Col>
        <Col span={8}>
          <Statistic title="Online Users" value={userInfo.online} />
        </Col>
        <Col span={8}>
          <Statistic title="New Users(in 1 day)" value={userInfo.new} />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Statistic title="Valid Posts" value={postInfo.valid} />
        </Col>
        <Col span={12}>
          <Statistic title="New Posts(in 1 day)" value={postInfo.new} />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Statistic title="Valid Comments" value={commentUnfo.valid} />
        </Col>
        <Col span={12}>
          <Statistic title="New Comments(in 1 hour)" value={commentUnfo.new} />
        </Col>
      </Row>
      <Button
        onClick={() => {
          setIsLoading(true);
          refresh();
        }}
        loading={isLoading}
      >
        refresh
      </Button>
    </>
  );
}

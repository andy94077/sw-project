import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Avatar, Tag } from "antd";
import { CONCAT_SERVER_URL } from "../constants";

export default function List() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .request({
        method: "GET",
        url: CONCAT_SERVER_URL("/api/v1/posts/admin"),
      })
      .then((res) => {
        setData(res.data["data"]);
      })
      .catch((error) => console.log(error));
  }, []);

  const columns = [
    {
      title: "Post",
      dataIndex: "id",
      render: (id, row) => (
        <a href={`http://localhost:3000/picture/${id}`}>
          <Avatar shape="square" src={CONCAT_SERVER_URL(row.url)} />
        </a>
      ),
    },
    {
      title: "Id",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Position",
      dataIndex: "url",
      render: (url) => <a href={CONCAT_SERVER_URL(url)}>{url}</a>,
      onCell: () => ({
        style: {
          maxWidth: "135px",
        },
      }),
    },
    {
      title: "User id",
      dataIndex: "user_id",
      sorter: (a, b) => a.user_id - b.user_id,
    },
    {
      title: "Username",
      dataIndex: "username",
      render: (username) => (
        <a href={`http://localhost:3000/profile/${username}`}>{username}</a>
      ),
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Content",
      dataIndex: "content",
      onCell: () => ({
        style: {
          padding: "10px",
          minWidth: "300px",
        },
      }),
      render: (content) => (
        <div style={{ maxHeight: "100px", overflow: "auto" }}>{content}</div>
      ),
    },
    {
      title: "Tag",
      dataIndex: "tag",
      sorter: (a, b) => a.tag.localeCompare(b.tag),
    },
    {
      title: "Publish time",
      dataIndex: "publish_time",
      onCell: () => ({
        style: {
          minWidth: "150px",
        },
      }),
      sorter: (a, b) => a.publish_time.localeCompare(b.publish_time),
    },
    {
      title: "Updated time",
      dataIndex: "updated_at",
      sorter: (a, b) => a.updated_at.localeCompare(b.updated_at),
    },
    {
      title: "Deleted time",
      dataIndex: "deleted_at",
      render: (deleted_at) =>
        deleted_at === null ? <Tag color="geekblue">NULL</Tag> : deleted_at,
      sorter: (a, b) => {
        const A = a.deleted_at === null ? "null" : a.deleted_at;
        const B = b.deleted_at === null ? "null" : b.deleted_at;
        A.localeCompare(B);
      },
    },
  ];

  return (
    <Table
      dataSource={data}
      bordered
      scroll={{ x: 1200 }}
      columns={columns}
      simple
      rowKey={(record) => record.id}
    />
  );
}

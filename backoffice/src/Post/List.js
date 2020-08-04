import React from "react";
import { Table, Avatar } from "antd";
import styles from "./List.less";

export default function List() {
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      render: (text) => <Avatar shape="square" src={text} />,
    },
    {
      title: "Id",
      dataIndex: "id",
    },
    {
      title: "Url",
      dataIndex: "url",
    },
    {
      title: "User id",
      dataIndex: "user_id",
    },
    {
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "Content",
      dataIndex: "content",
    },
    {
      title: "Tag",
      dataIndex: "tag",
    },
    {
      title: "Publish time",
      dataIndex: "publish_time",
    },
    {
      title: "Updated time",
      dataIndex: "updated_at",
    },
    {
      title: "Deleted time",
      dataIndex: "deleted_at",
    },
  ];

  const data = [
    {
      image: "/pictures/avatar.jpeg",
      id: "1",
      url: "http://pinterest-server.test/uploads/image/1/original/1.jpg",
      user_id: "2",
      username: "user2",
      content: "hello world",
      tag: "cat",
      publish_time: "2020-07-30 07:54:59",
      updated_at: "2020-07-30 07:54:59",
      deleted_at: null,
    },
  ];

  return (
    <Table
      dataSource={data}
      bordered
      scroll={{ x: 1200 }}
      className={styles.table}
      columns={columns}
      simple
      rowKey={(record) => record.id}
    />
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Avatar, Button, Input, Modal, Space, Table, Tag, Tooltip } from "antd";
import {
  DeleteOutlined,
  DownOutlined,
  SearchOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { CONCAT_SERVER_URL } from "../constants";

export default function List() {
  const [data, setData] = useState([]);
  const [motion, setMotion] = useState(false);
  const columnTitle = {
    id: "Id",
    url: "Position",
    user_id: "User id",
    username: "Username",
    content: "Content",
    tag: "Tag",
  };
  const columnObj = {
    id: "",
    url: "",
    user_id: "",
    username: "",
    content: "",
    tag: "",
  };
  const [searchText, setSearchText] = useState({ ...columnObj });

  useEffect(() => {
    setMotion(false);

    axios
      .request({
        method: "GET",
        url: CONCAT_SERVER_URL("/api/v1/posts/admin"),
      })
      .then((res) => {
        setData(res.data["data"]);
      })
      .catch(() =>
        Modal.error({
          title: "Loading failed.",
          content: "Connection error.",
        })
      );
  }, [motion]);

  const handleDeletePost = (event) => {
    const id = event.currentTarget.value;
    Modal.confirm({
      title: "Are you sure you want to delete this post?",
      content: "(Image id = " + id + ")",
      onOk() {
        const jsonData = { id };

        axios
          .request({
            method: "DELETE",
            url: CONCAT_SERVER_URL("/api/v1/post"),
            data: jsonData,
          })
          .then(() => {
            setMotion(true);
            Modal.success({
              title: "Deleted successfully.",
              content: "(Image id = " + id + ")",
            });
          })
          .catch(() =>
            Modal.error({
              title: "Deleted failed.",
              content: "Connection error.",
            })
          );
      },
    });
  };

  const handleRecoverPost = (event) => {
    const id = event.currentTarget.value;
    Modal.confirm({
      title: "Are you sure you want to recover this post?",
      content: "(Image id = " + id + ")",
      onOk() {
        const jsonData = { id };

        axios
          .request({
            method: "POST",
            url: CONCAT_SERVER_URL("/api/v1/post/recovery"),
            data: jsonData,
          })
          .then(() => {
            setMotion(true);
            Modal.success({
              title: "Recovered successfully.",
              content: "(Image id = " + id + ")",
            });
          })
          .catch(() =>
            Modal.error({
              title: "Recovered failed.",
              content: "Connection error.",
            })
          );
      },
    });
  };

  const getColumnSearchProps = (dataIndex) => ({
    render: (text) =>
      ["url", "username"].includes(dataIndex)
        ? [
            searchText[dataIndex] !== "" ? (
              <a href={CONCAT_SERVER_URL(text)}>
                <Highlighter
                  highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                  searchWords={[searchText[dataIndex]]}
                  autoEscape
                  textToHighlight={text}
                />
              </a>
            ) : (
              <a key={dataIndex} href={CONCAT_SERVER_URL(text)}>
                {text}
              </a>
            ),
          ]
        : [
            searchText[dataIndex] !== "" ? (
              <Highlighter
                highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                searchWords={[searchText[dataIndex]]}
                autoEscape
                textToHighlight={`${text}`}
              />
            ) : (
              text
            ),
          ],
  });

  const handleSearch = () => {
    console.log(searchText);
  };

  const handleReset = () => {
    setSearchText({ ...columnObj });
  };

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
      ...getColumnSearchProps("id"),
    },
    {
      title: "Position",
      dataIndex: "url",
      onCell: () => ({
        style: {
          maxWidth: "135px",
        },
      }),
      ...getColumnSearchProps("url"),
    },
    {
      title: "User id",
      dataIndex: "user_id",
      sorter: (a, b) => a.user_id - b.user_id,
      ...getColumnSearchProps("user_id"),
    },
    {
      title: "Username",
      dataIndex: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
      ...getColumnSearchProps("username"),
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
        <div>
          <div
            style={{
              float: "left",
              maxHeight: "100px",
              overflow: "auto",
            }}
          >
            {searchText["content"] !== "" ? (
              <Highlighter
                highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                searchWords={[searchText["content"]]}
                autoEscape
                textToHighlight={`${content}`}
              />
            ) : (
              content
            )}
          </div>
          <Tooltip title="Comments">
            <Button
              type="primary"
              shape="circle"
              icon={<DownOutlined />}
              size="small"
              style={{ float: "right" }}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Tag",
      dataIndex: "tag",
      sorter: (a, b) => a.tag.localeCompare(b.tag),
      ...getColumnSearchProps("tag"),
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
    {
      title: "Options",
      onHeaderCell: () => ({
        style: {
          background: "#fafafa",
          boxShadow: "-2px 0px 3px -1.5px #ddd",
          position: "sticky",
          right: "0",
        },
      }),
      onCell: () => ({
        style: {
          background: "#fff",
          boxShadow: "-2px 0px 3px -1.5px #ddd",
          position: "sticky",
          right: "0",
        },
      }),
      render: (_, row) => (
        <div style={{ textAlign: "center" }}>
          {row.deleted_at === null ? (
            <Tooltip title="Delete">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleDeletePost}
                shape="circle"
                size="small"
                type="primary"
                value={row.id}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Recover">
              <Button
                icon={<UndoOutlined />}
                onClick={handleRecoverPost}
                shape="circle"
                size="small"
                type="primary"
                value={row.id}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  const searchFields = [];
  Object.keys(columnObj).forEach(function (key) {
    searchFields.push(
      <Input
        key={key}
        placeholder={`Search ${columnTitle[key]}`}
        value={searchText[key]}
        onChange={(event) =>
          setSearchText({
            ...searchText,
            [key]: event.target.value,
          })
        }
        onPressEnter={handleSearch}
        style={{ width: 188, margin: 8, display: "inline" }}
      />
    );
  });

  return (
    <div>
      <div style={{ padding: 8 }}>
        {searchFields}
        <Space>
          <Button onClick={handleReset} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="primary"
            onClick={handleSearch}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
        </Space>
      </div>
      <Table
        dataSource={data}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        simple
        rowKey={(record) => record.id}
      />
    </div>
  );
}

import React, { useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import axios from "axios";
import {
  message,
  Avatar,
  Button,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";
import { CONCAT_SERVER_URL } from "../constants";
import Comment from "./Comment";

export default function Post() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
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
  const [searchText, setSearchText] = useState(columnObj);
  const [filter, setFilter] = useState({
    ...columnObj,
    page: 1,
    size: 10,
  });
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    setMotion(false);

    axios
      .request({
        method: "GET",
        url: CONCAT_SERVER_URL("/api/v1/posts/admin"),
        params: filter,
      })
      .then((res) => {
        setData(
          res.data["data"].map((item) => {
            item.deleted_at =
              item.deleted_at === null
                ? null
                : String(
                    format(new Date(item.deleted_at), "yyyy-MM-dd HH:mm:ss", {
                      timeZone: "Asia/Taipei",
                    })
                  );
            item.updated_at =
              item.updated_at === null
                ? null
                : String(
                    format(new Date(item.updated_at), "yyyy-MM-dd HH:mm:ss", {
                      timeZone: "Asia/Taipei",
                    })
                  );
            return item;
          })
        );
        setTotal(res.data["total"]);
      })
      .catch(() => message.error("Loading failed! (Connection error.)"));
  }, [motion, filter]);

  const handleDeletePost = (event) => {
    const id = event.currentTarget.value;
    const modal = Modal.confirm({
      title: "Are you sure you want to delete this post?",
      content: `(Post id = ${id})`,
      onOk() {
        const jsonData = { id };
        modal.update({ cancelButtonProps: { disabled: true } });

        return axios
          .request({
            method: "DELETE",
            url: CONCAT_SERVER_URL("/api/v1/post"),
            data: jsonData,
          })
          .then(() => {
            setMotion(true);
            message.success(`Deleted successfully! (Post id = ${id})`);
          })
          .catch(() => message.error("Deleted failed! (Connection error.)"));
      },
    });
  };

  const handleRecoverPost = (event) => {
    const id = event.currentTarget.value;
    const modal = Modal.confirm({
      title: "Are you sure you want to recover this post?",
      content: `(Post id = ${id})`,
      onOk() {
        const jsonData = { id };
        modal.update({ cancelButtonProps: { disabled: true } });

        return axios
          .request({
            method: "POST",
            url: CONCAT_SERVER_URL("/api/v1/post/recovery"),
            data: jsonData,
          })
          .then(() => {
            setMotion(true);
            message.success(`Recovered successfully! (Post id = ${id})`);
          })
          .catch(() => message.error("Recovered failed! (Connection error.)"));
      },
    });
  };

  const getRenderProps = (dataIndex) => ({
    render: (text) =>
      ["url", "username"].includes(dataIndex)
        ? [
            filter[dataIndex] !== "" ? (
              <a href={CONCAT_SERVER_URL(text)}>
                <Highlighter
                  highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                  searchWords={[filter[dataIndex]]}
                  autoEscape
                  textToHighlight={`${text}`}
                />
              </a>
            ) : (
              <a key={dataIndex} href={CONCAT_SERVER_URL(text)}>
                {text}
              </a>
            ),
          ]
        : [
            filter[dataIndex] !== "" ? (
              <Highlighter
                key={dataIndex}
                highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                searchWords={[filter[dataIndex]]}
                autoEscape
                textToHighlight={`${text}`}
              />
            ) : (
              text
            ),
          ],
  });

  const handleSetSearchText = (key) => (event) => {
    setSearchText({
      ...searchText,
      [key]: event.target.value,
    });
  };

  const handleSearch = () => {
    setFilter({
      ...searchText,
      page: 1,
      size: 10,
    });
  };

  const handleReset = () => {
    setSearchText(columnObj);
    setFilter({
      ...columnObj,
      page: 1,
      size: 10,
    });
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
      ...getRenderProps("id"),
      title: "Id",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      ...getRenderProps("url"),
      title: "Position",
      dataIndex: "url",
      onCell: () => ({
        style: {
          maxWidth: "135px",
        },
      }),
    },
    {
      ...getRenderProps("user_id"),
      title: "User id",
      dataIndex: "user_id",
      sorter: (a, b) => a.user_id - b.user_id,
    },
    {
      ...getRenderProps("username"),
      title: "Username",
      dataIndex: "username",
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
        <div
          style={{
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
      ),
    },
    {
      ...getRenderProps("tag"),
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
        return A.localeCompare(B);
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

  const searchFields = Object.keys(columnObj).map((key) => (
    <Input
      key={key}
      placeholder={`Search ${columnTitle[key]}`}
      value={searchText[key]}
      onChange={handleSetSearchText(key)}
      onPressEnter={handleSearch}
      style={{ width: 188, margin: 8 }}
    />
  ));

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
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ["10", "20", "30"],
          total,
          showTotal: (total) => `Total result: ${total} `,
          onChange: (page, pageSize) => {
            if (filter.size === pageSize) {
              setFilter({ ...filter, page: page });
            } else {
              setFilter({ ...filter, page: 1, size: pageSize });
            }
          },
        }}
        expandable={{
          expandIconColumnIndex: 6,
          expandedRowRender: (record) => (
            <div
              style={{
                padding: 10,
                paddingRight: 20,
                border: "#001529 2px solid",
                borderRadius: 10,
              }}
            >
              <Comment post_id={record["id"]} />
            </div>
          ),
        }}
        columns={columns}
        rowKey={(record) => record.id}
        scroll={{ x: 1200 }}
      />
    </div>
  );
}

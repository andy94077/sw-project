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
  Tooltip,
  DatePicker,
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
    created_at: "Publish Time",
    updated_at: "Update Time",
    deleted_at: "Delete Time",
  };
  const columnObj = {
    id: "",
    url: "",
    user_id: "",
    username: "",
    content: "",
    tag: "",
    created_at: ["", ""],
    updated_at: ["", ""],
    deleted_at: ["", ""],
  };
  const [searchText, setSearchText] = useState(columnObj);
  const [filter, setFilter] = useState({
    ...columnObj,
    page: 1,
    size: 10,
  });
  const [motion, setMotion] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMotion(false);
    setLoading(true);

    axios
      .request({
        method: "GET",
        url: CONCAT_SERVER_URL("/api/v1/posts/admin"),
        params: {
          ...filter,
          ...Object.fromEntries(
            ["created_at", "updated_at", "deleted_at"].map((time) => [
              time,
              filter[time] === null
                ? ["", ""]
                : filter[time].map((item) =>
                    item === "" || item === null ? "" : item.format()
                  ),
            ])
          ),
        },
      })
      .then((res) => {
        setData(
          res.data["data"].map((item) => {
            ["created_at", "updated_at", "deleted_at"].map((time) => {
              item[time] =
                item[time] === null
                  ? ""
                  : format(new Date(item[time]), "yyyy-MM-dd HH:mm:ss", {
                      timeZone: "Asia/Taipei",
                    });
              return time;
            });
            return item;
          })
        );
        setTotal(res.data["total"]);
      })
      .catch(() => message.error("Loading failed! (Connection error.)"))
      .finally(() => setLoading(false));
  }, [motion, filter]);

  const handleDeletePost = (event) => {
    const id = event.currentTarget.value;
    const modal = Modal.confirm({
      title: "Are you sure you want to delete this post?",
      content: `(Post id = ${id})`,
      onOk() {
        const jsonData = { id };
        modal.update({ cancelButtonProps: { disabled: true } });
        setLoading(true);

        axios
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
        setLoading(true);

        axios
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

  const getLinkRenderProps = (dataIndex) => ({
    // for "url" & "username"
    render: (text) =>
      dataIndex === "url"
        ? [
            loading === false ? (
              <a key={dataIndex} href={CONCAT_SERVER_URL(text)}>
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
            loading === false ? (
              <a key={dataIndex} href={`http://localhost:3000/profile/${text}`}>
                <Highlighter
                  highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                  searchWords={[filter[dataIndex]]}
                  autoEscape
                  textToHighlight={text}
                />
              </a>
            ) : (
              <a key={dataIndex} href={`http://localhost:3000/profile/${text}`}>
                {text}
              </a>
            ),
          ],
  });

  const getRenderProps = (dataIndex) => ({
    render: (text) => [
      loading === false ? (
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

  const handleSetSearchText = (key) => (event) =>
    setSearchText({ ...searchText, [key]: event.target.value });

  const handleSearchDateChange = (key) => (value) =>
    setSearchText({ ...searchText, [key]: value });

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
      ...getLinkRenderProps("url"),
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
      ...getLinkRenderProps("username"),
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
          {loading === false ? (
            <Highlighter
              highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
              searchWords={[filter["content"]]}
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
      dataIndex: "created_at",
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
      // render: (deleted_at) =>
      //   deleted_at === null ? <Tag color="geekblue">NULL</Tag> : deleted_at,
      sorter: (a, b) => a.deleted_at.localeCompare(b.deleted_at),
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
          {row.deleted_at === "" ? (
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

  const searchFields = Object.keys(columnObj).map((key) =>
    columnObj[key] instanceof Array ? (
      <DatePicker.RangePicker
        key={key}
        placeholder={["Search", columnTitle[key]]}
        allowEmpty={[true, true]}
        value={searchText[key]}
        onChange={handleSearchDateChange(key)}
        showTime
        style={{
          width: 250,
          margin: 8,
          borderRadius: "15px",
        }}
      />
    ) : (
      <Input
        key={key}
        placeholder={`Search ${columnTitle[key]}`}
        value={searchText[key]}
        onChange={handleSetSearchText(key)}
        onPressEnter={handleSearch}
        style={{ width: 188, margin: 8, borderRadius: 15 }}
      />
    )
  );

  return (
    <div>
      <div style={{ padding: 8 }}>
        {searchFields}
        <Space style={{ margin: 8 }}>
          <Button
            onClick={handleReset}
            size="small"
            style={{ width: 90, height: 30, borderRadius: 15, marginRight: 10 }}
          >
            Reset
          </Button>
          <Button
            type="primary"
            onClick={handleSearch}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, height: 30, borderRadius: 15 }}
          >
            Search
          </Button>
        </Space>
      </div>
      <Table
        dataSource={data}
        bordered
        loading={loading}
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

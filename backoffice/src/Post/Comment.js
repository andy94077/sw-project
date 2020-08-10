import React, { useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import axios from "axios";
import {
  message,
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

export default function Comment(props) {
  const { post_id } = props;
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const columnTitle = {
    id: "Id",
    user_id: "User id",
    content: "Content",
  };
  const columnObj = {
    id: "",
    post_id,
    user_id: "",
    content: "",
  };
  const [searchText, setSearchText] = useState(columnObj);
  const [filter, setFilter] = useState({
    ...columnObj,
    page: 1,
    size: 10,
  });
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    if (motion) {
      setMotion(false);
      return;
    }

    axios
      .request({
        method: "GET",
        url: CONCAT_SERVER_URL("/api/v1/comments/admin"),
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
            item.created_at =
              item.created_at === null
                ? null
                : String(
                    format(new Date(item.created_at), "yyyy-MM-dd HH:mm:ss", {
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

  const handleDeleteComment = (event) => {
    const id = event.currentTarget.value;
    const modal = Modal.confirm({
      title: "Are you sure you want to delete this comment?",
      content: "(Comment id = " + id + ")",
      onOk() {
        const jsonData = { id };
        modal.update({ cancelButtonProps: { disabled: true } });

        return axios
          .request({
            method: "DELETE",
            url: CONCAT_SERVER_URL("/api/v1/comment"),
            data: jsonData,
          })
          .then(() => {
            setMotion(true);
            message.success(`Deleted successfully! (Comment id = ${id})`);
          })
          .catch(() => message.error("Deleted failed! Connection error."));
      },
    });
  };

  const handleRecovercomment = (event) => {
    const id = event.currentTarget.value;
    const modal = Modal.confirm({
      title: "Are you sure you want to recover this comment?",
      content: "(Comment id = " + id + ")",
      onOk() {
        const jsonData = { id };
        modal.update({ cancelButtonProps: { disabled: true } });

        return axios
          .request({
            method: "POST",
            url: CONCAT_SERVER_URL("/api/v1/comment/recovery"),
            data: jsonData,
          })
          .then(() => {
            setMotion(true);
            message.success(`Recovered successfully! (Comment id = ${id})`);
          })
          .catch(() => message.error("Recovered failed! Connection error."));
      },
    });
  };

  const getRenderProps = (dataIndex) => ({
    render: (text) =>
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
  });

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
      ...getRenderProps("id"),
      title: "Id",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      ...getRenderProps("user_id"),
      title: "User id",
      dataIndex: "user_id",
      sorter: (a, b) => a.user_id - b.user_id,
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
          {filter["content"] !== "" ? (
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
      title: "Publish time",
      dataIndex: "created_at",
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
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
                onClick={handleDeleteComment}
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
                onClick={handleRecovercomment}
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
    if (key !== "post_id") {
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
    }
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
        columns={columns}
        simple
        rowKey={(record) => record.id}
      />
    </div>
  );
}
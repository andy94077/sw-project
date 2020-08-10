import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Table, Modal, Space, Button, Input, Tooltip } from "antd";
import {
  ExclamationCircleOutlined,
  DeleteOutlined,
  SearchOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { CONCAT_SERVER_URL } from "../../constants";
import styles from "./List.less";
import { format } from "date-fns";

export default function List(props) {
  const { refresh, setRefresh } = props;
  const initialSearchText = {
    id: "",
    name: "",
    email: "",
    deleted_at: "",
    created_at: "",
    updated_at: "",
  };
  const [searchText, setSearchText] = useState(initialSearchText);
  const [filter, setFilter] = useState({
    ...initialSearchText,
    page: 1,
    size: 10,
  });

  const [data, setData] = useState({
    info: [],
    length: 0,
  });

  const columnTitle = {
    id: "Id",
    name: "Name",
    email: "Email",
    deleted_at: "Delete Time",
    created_at: "Create Time",
    updated_at: "Updated Time",
  };

  const tableColumns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: 70,
        sorter: (a, b) => Number(a.id > b.id),
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: 120,
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        sorter: (a, b) => a.email.localeCompare(b.email),
      },
      {
        title: "created_at",
        dataIndex: "created_at",
        key: "created_at",
        sorter: (a, b) => a.created_at.localeCompare(b.created_at),
        timeFormat: "yyyy-MM-dd HH:mm:ss",
        timeZone: "Asia/China",
      },
      {
        title: "deleted_at",
        dataIndex: "deleted_at",
        key: "deleted_at",
        sorter: (a, b) =>
          a.deleted_at === null
            ? 1
            : b.deleted_at === null
            ? -1
            : Number(a.deleted_at > b.deleted_at),
        timeFormat: "yyyy-MM-dd HH:mm:ss",
        timeZone: "Asia/China",
      },
      {
        title: "updated_at",
        dataIndex: "updated_at",
        key: "updated_at",
        sorter: (a, b) =>
          a.updated_at === null
            ? 1
            : b.updated_at === null
            ? -1
            : Number(a.updated_at > b.updated_at),
        timeFormat: "yyyy-MM-dd HH:mm:ss",
        timeZone: "Asia/China",
      },
    ],
    []
  );

  const handleDeleteUser = (event) => {
    const id = event.currentTarget.value;
    const modal = Modal.confirm({
      title: "Do you want to delete this user?",
      content: `(User id = ${id})`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        modal.update({ cancelButtonProps: { disabled: true } });
        return axios
          .delete(CONCAT_SERVER_URL("/api/v1/superUser/admin"), {
            data: { id },
          })
          .then(() =>
            Modal.success({
              title: "Deleted successfully.",
              content: `(User id = ${id})`,
            })
          )
          .catch(() =>
            Modal.error({
              title: "Deleted failed.",
              content: "Connection error.",
            })
          )
          .finally(setRefresh);
      },
    });
  };

  const handleRecoverUser = (event) => {
    const id = event.currentTarget.value;
    const modal = Modal.confirm({
      title: "Do you want to recover this user?",
      icon: <ExclamationCircleOutlined />,
      content: `(User id = ${id})`,
      onOk() {
        modal.update({ cancelButtonProps: { disabled: true } });
        return axios
          .post(CONCAT_SERVER_URL("/api/v1/superUser/admin"), { id })
          .then(() =>
            Modal.success({
              title: "Recovered successfully.",
              content: `(User id = ${id})`,
            })
          )
          .catch(() =>
            Modal.error({
              title: "Recovered failed.",
              content: "Connection error.",
            })
          )
          .finally(setRefresh);
      },
    });
  };

  const columns = [
    ...tableColumns,
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
                onClick={handleDeleteUser}
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
                onClick={handleRecoverUser}
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

  useEffect(() => {
    axios
      .get(CONCAT_SERVER_URL("/api/v1/superUser/admin"), {
        params: filter,
      })
      .then((res) => {
        if (res.data.data !== null) {
          if (res.data.length !== 0) {
            setData({
              info: res.data.data.map((item) => ({
                ...item,
                ...Object.fromEntries(
                  tableColumns
                    .filter(
                      (col) =>
                        col.hasOwnProperty("timeFormat") &&
                        col.hasOwnProperty("timeZone")
                    )
                    .map(({ dataIndex, timeFormat, timeZone }) => [
                      dataIndex,
                      item[dataIndex] === null
                        ? null
                        : format(new Date(item[dataIndex]), timeFormat, {
                            timeZone,
                          }),
                    ])
                ),
              })),
              length: res.data.total,
            });
          }
        }
      })
      .catch((error) => {
        alert("There are some problems during loading");
        console.log(error);
      });
  }, [refresh, filter, tableColumns]);

  const handleSearch = () => {
    setFilter({
      ...searchText,
      page: 1,
      size: 10,
    });
  };

  const handleReset = () => {
    setSearchText({ ...initialSearchText });
    setFilter({
      ...initialSearchText,
      page: 1,
      size: 10,
    });
  };

  const handleSearchTextChange = (key) => (event) =>
    setSearchText({ ...searchText, [key]: event.target.value });

  const searchFields = Object.keys(initialSearchText).map((key) => (
    <Input
      key={key}
      placeholder={`Search ${columnTitle[key]}`}
      value={searchText[key]}
      onChange={handleSearchTextChange(key)}
      onPressEnter={handleSearch}
      style={{ width: 188, margin: 8, display: "inline" }}
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
        dataSource={data.info}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ["10", "20", "30"],
          total: data.length,
          showTotal: (total) => `Total result: ${total} `,
          onChange: (page, pageSize) => {
            if (filter.size === pageSize) {
              setFilter({ ...filter, page: page });
            } else {
              setFilter({ ...filter, page: 1, size: pageSize });
            }
          },
        }}
        className={styles.table}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        simple
        rowKey={(record) => record.id}
      />
    </div>
  );
}

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Table,
  Modal,
  Space,
  Button,
  Input,
  Tooltip,
  message,
  DatePicker,
} from "antd";
import {
  ExclamationCircleOutlined,
  DeleteOutlined,
  SearchOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { CONCAT_SERVER_URL } from "../../utils";
import styles from "./List.less";
import { format } from "date-fns";

export default function List(props) {
  const { refresh, setRefresh } = props;
  const initialSearchText = {
    id: "",
    name: "",
    email: "",
    created_at: ["", ""],
    deleted_at: ["", ""],
    updated_at: ["", ""],
  };
  const [isLoading, setIsLoading] = useState(false);
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

  const tableColumns = useMemo(
    () => [
      {
        title: "Id",
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
        title: "Create Time",
        dataIndex: "created_at",
        key: "created_at",
        sorter: (a, b) => a.created_at.localeCompare(b.created_at),
        timeFormat: "yyyy-MM-dd HH:mm:ss",
        timeZone: "Asia/Taipei",
      },
      {
        title: "Delete Time",
        dataIndex: "deleted_at",
        key: "deleted_at",
        sorter: (a, b) => a.deleted_at.localeCompare(b.deleted_at),
        timeFormat: "yyyy-MM-dd HH:mm:ss",
        timeZone: "Asia/Taipei",
      },
      {
        title: "Update Time",
        dataIndex: "updated_at",
        key: "updated_at",
        sorter: (a, b) => a.updated_at.localeCompare(b.updated_at),
        timeFormat: "yyyy-MM-dd HH:mm:ss",
        timeZone: "Asia/Taipei",
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
        setIsLoading(true);
        axios
          .delete(CONCAT_SERVER_URL("/api/v1/superUser/admin"), {
            data: { id },
          })
          .then(() =>
            message.success(`Deleted successfully. (User id = ${id})`)
          )
          .catch(() => message.error(`Deleted failed. Please try again later.`))
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
        setIsLoading(true);
        axios
          .post(CONCAT_SERVER_URL("/api/v1/superUser/admin"), { id })
          .then(() =>
            message.success(`Recovered successfully. (User id = ${id})`)
          )
          .catch(() =>
            message.error(`Recovered failed. Please try again later.`)
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
          {row.deleted_at === "" ? (
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
    setIsLoading(true);
    axios
      .get(CONCAT_SERVER_URL("/api/v1/superUser/admin"), {
        params: {
          ...filter,
          ...Object.fromEntries(
            tableColumns
              .filter((col) => col.hasOwnProperty("timeFormat"))
              .map((col) => [
                col.dataIndex,
                filter[col.dataIndex] === null
                  ? ["", ""]
                  : filter[col.dataIndex].map((item) =>
                      item === "" || item === null ? "" : item.format()
                    ),
              ])
          ),
        },
      })
      .then((res) => {
        if (res.data.data !== null) {
          if (res.data.length !== 0) {
            setData({
              info: res.data.data.map((item) => ({
                ...item,
                ...Object.fromEntries(
                  tableColumns
                    .filter((col) => col.hasOwnProperty("timeFormat"))
                    .map(({ dataIndex, timeFormat, timeZone }) => [
                      dataIndex,
                      item[dataIndex] === null
                        ? ""
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
      })
      .finally(() => setIsLoading(false));
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

  const handleSearchDateChange = (key) => (value) =>
    setSearchText({ ...searchText, [key]: value });

  const searchFields = tableColumns.map((col) =>
    col.hasOwnProperty("timeFormat") ? (
      <DatePicker.RangePicker
        key={col.dataIndex}
        placeholder={["Search", col.title]}
        allowEmpty={[true, true]}
        value={searchText[col.dataIndex]}
        onChange={handleSearchDateChange(col.dataIndex)}
        showTime
        style={{
          width: 250,
          margin: 8,
          borderRadius: "15px",
        }}
      />
    ) : (
      <Input
        key={col.dataIndex}
        placeholder={`Search ${col.title}`}
        value={searchText[col.dataIndex]}
        onChange={handleSearchTextChange(col.dataIndex)}
        onPressEnter={handleSearch}
        style={{
          width: 188,
          margin: 8,
          display: "inline",
          borderRadius: "15px",
        }}
      />
    )
  );

  return (
    <div>
      <div style={{ padding: 8 }}>
        {searchFields}
        <Space style={{ margin: "8px" }}>
          <Button
            onClick={handleReset}
            size="small"
            style={{
              width: 90,
              height: "30px",
              borderRadius: "15px",
              marginRight: "10px",
            }}
          >
            Reset
          </Button>
          <Button
            type="primary"
            onClick={handleSearch}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, height: "30px", borderRadius: "15px" }}
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
        loading={isLoading}
        rowKey={(record) => record.id}
      />
    </div>
  );
}

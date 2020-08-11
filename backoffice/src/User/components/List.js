import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
import { SearchOutlined } from "@ant-design/icons";
import {
  message,
  Avatar,
  Button,
  Input,
  Modal,
  Space,
  Table,
  DatePicker,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { CONCAT_SERVER_URL } from "../../constants";
import styles from "./List.less";
import { format } from "date-fns";
import DropOption from "./DropOption";
import BucketForm from "./BucketForm";

export default function List(props) {
  const [state, setState] = useState({
    loading: false,
    bucketId: null,
    visible: false,
  });
  const [tableLoading, setTableLoading] = useState(false);
  const [data, setData] = useState({
    info: [],
    length: null,
  });
  const [refresh, setRefresh] = useState(false);
  const columnTitle = {
    id: "ID",
    name: "Name",
    email: "Email",
    online_time: "Online Time",
    bucket_time: "Bucket Time",
    created_at: "Create Time",
    deleted_at: "Delete Time",
    updated_at: "Update Time",
  };
  const columnObj = {
    id: "",
    name: "",
    email: "",
    online_time: ["", ""],
    bucket_time: ["", ""],
    created_at: ["", ""],
    deleted_at: ["", ""],
    updated_at: ["", ""],
  };
  const [searchText, setSearchText] = useState({ ...columnObj });
  const [filter, setFilter] = useState({
    ...columnObj,
    page: 1,
    size: 10,
  });

  const errorMessageModal = (text) => {
    Modal.info({
      title: "",
      content: (
        <div>
          <p>{text}</p>
        </div>
      ),
      onOk() {},
    });
  };

  const showUnbucketModal = (id) => {
    const modal = Modal.confirm({
      title: "Do you want to unbucket this user?",
      icon: <ExclamationCircleOutlined />,
      content: "Some descriptions",
      onOk() {
        modal.update({ cancelButtonProps: { disabled: true } });
        setTableLoading(true);
        axios({
          method: "delete",
          url: CONCAT_SERVER_URL("/api/v1/user/bucket"),
          data: { id },
        })
          .then((response) => {
            message.success(`Unbucket successfully! (User id = ${id})`);
          })
          .catch((error) => {
            errorMessageModal("Oops~ Please try again !");
          })
          .finally(() => setRefresh((preRefresh) => !preRefresh));
      },
      onCancel() {},
    });
  };

  const showDeleteModal = (id) => {
    const modal = Modal.confirm({
      title: "Do you want to delete this user?",
      icon: <ExclamationCircleOutlined />,
      content: "Some descriptions",
      onOk() {
        modal.update({ cancelButtonProps: { disabled: true } });
        setTableLoading(true);
        axios({
          method: "delete",
          url: CONCAT_SERVER_URL("/api/v1/user/admin"),
          data: { id },
        })
          .then((response) => {
            message.success(`Deleted successfully! (User id = ${id})`);
          })
          .catch((error) => {
            errorMessageModal("Oops~ Please try again !");
          })
          .finally(() => setRefresh((preRefresh) => !preRefresh));
      },
      onCancel() {},
    });
  };

  const showRecoverModal = (id) => {
    const modal = Modal.confirm({
      title: "Do you want to recover this user?",
      icon: <ExclamationCircleOutlined />,
      content: "Some descriptions",
      onOk() {
        modal.update({ cancelButtonProps: { disabled: true } });
        setTableLoading(true);
        axios({
          method: "post",
          url: CONCAT_SERVER_URL("/api/v1/user/admin"),
          data: { id },
        })
          .then((response) => {
            message.success(`Recover successfully! (User id = ${id})`);
          })
          .catch((error) => {
            errorMessageModal("Oops~ Please try again !");
          })
          .finally(() => setRefresh((preRefresh) => !preRefresh));
      },
      onCancel() {},
    });
  };

  const handleMenuClick = ({ key, id }) => {
    switch (key) {
      case "Bucket":
        setState({
          ...state,
          bucketId: id,
          visible: true,
        });
        break;
      case "Unbucket":
        showUnbucketModal(id);
        break;
      case "Delete":
        showDeleteModal(id);
        break;
      case "Recover":
        showRecoverModal(id);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    setTableLoading(true);
    axios
      .get(CONCAT_SERVER_URL("/api/v1/users/admin"), {
        params: {
          ...filter,
          online_time: filter.online_time.map((item) =>
            item === "" ? "" : item.format()
          ),
          bucket_time: filter.bucket_time.map((item) =>
            item === "" ? "" : item.format()
          ),
          created_at: filter.created_at.map((item) =>
            item === "" ? "" : item.format()
          ),
          deleted_at: filter.deleted_at.map((item) =>
            item === "" ? "" : item.format()
          ),
          updated_at: filter.updated_at.map((item) =>
            item === "" ? "" : item.format()
          ),
        },
      })
      .then((response) => {
        console.log(response.data.data);
        if (response.data.data !== null) {
          if (response.data.length !== 0) {
            setData({
              info: response.data.data.map((item) => {
                item.online_time =
                  item.online_time === null
                    ? ""
                    : format(
                        new Date(item.online_time),
                        "yyyy-MM-dd HH:mm:ss",
                        {
                          timeZone: "Asia/Taipei",
                        }
                      );
                item.bucket_time =
                  item.bucket_time === null
                    ? ""
                    : format(
                        new Date(item.bucket_time),
                        "yyyy-MM-dd HH:mm:ss",
                        { timeZone: "Asia/Taipei" }
                      );
                item.created_at = format(
                  new Date(item.created_at),
                  "yyyy-MM-dd HH:mm:ss",
                  { timeZone: "Asia/Taipei" }
                );
                item.deleted_at =
                  item.deleted_at === null
                    ? ""
                    : format(new Date(item.deleted_at), "yyyy-MM-dd HH:mm:ss", {
                        timeZone: "Asia/Taipei",
                      });
                item.updated_at =
                  item.updated_at === null
                    ? ""
                    : format(new Date(item.updated_at), "yyyy-MM-dd HH:mm:ss", {
                        timeZone: "Asia/Taipei",
                      });
                return item;
              }),
              length: response.data.total,
            });
          }
        }
      })
      .catch((error) => {
        alert("There are some problems during loading");
      })
      .finally(() => setTableLoading(false));
  }, [refresh, filter]);

  const handleOk = () => {
    setState({ ...state, loading: false, visible: false });
  };

  const handleCancel = () => {
    setState({ ...state, visible: false });
  };

  const handleSearch = () => {
    setFilter({
      ...filter,
      ...searchText,
      page: 1,
    });
  };

  const handleReset = () => {
    setSearchText({ ...columnObj });
    setFilter({
      ...filter,
      ...columnObj,
    });
  };

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar_url",
      key: "avatar",
      width: 80,
      render: (text) => (
        <Avatar style={{ marginLeft: 8 }} src={CONCAT_SERVER_URL(text)} />
      ),
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 120,
      render: (name) => (
        <a href={`http://localhost:3000/profile/${name}`}>{name}</a>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Online Time",
      dataIndex: "online_time",
      key: "online_time",
      sorter: (a, b) => a.online_time.localeCompare(b.online_time),
    },
    {
      title: "Bucket Time",
      dataIndex: "bucket_time",
      key: "bucket_time",
      sorter: (a, b) => a.bucket_time.localeCompare(b.bucket_time),
    },
    {
      title: "created_at",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
    },
    {
      title: "deleted_at",
      dataIndex: "deleted_at",
      key: "deleted_at",
      sorter: (a, b) => a.deleted_at.localeCompare(b.deleted_at),
    },
    {
      title: "updated_at",
      dataIndex: "updated_at",
      key: "updated_at",
      sorter: (a, b) => a.updated_at.localeCompare(b.updated_at),
    },
    {
      title: "Operation",
      key: "operation",
      fixed: "right",
      render: (text, record) => {
        return (
          <DropOption
            id={record.id}
            onMenuClick={handleMenuClick}
            menuOptions={[
              { key: "Bucket", name: "Bucket" },
              record.bucket_time
                ? { key: "Unbucket", name: "Unbucket" }
                : { key: "noOption", name: "" },
              record.deleted_at
                ? { key: "Recover", name: "Recover" }
                : { key: "Delete", name: "Delete" },
            ]}
          />
        );
      },
    },
  ];

  const handleSearchTextChange = (key) => (event) =>
    setSearchText({ ...searchText, [key]: event.target.value });
  const handleSearchDateChange = (key) => (value) =>
    setSearchText({ ...searchText, [key]: value });

  const searchFields = Object.keys(columnObj).map((key) =>
    columnObj[key] instanceof Array ? (
      <DatePicker.RangePicker
        key={key}
        placeholder={["Search", columnTitle[key]]}
        allowEmpty={[true, true]}
        value={searchText[key]}
        onChange={handleSearchDateChange(key)}
        showTime
        onOk={(value) => console.log(value)}
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
        onChange={handleSearchTextChange(key)}
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
    <>
      <div style={{ padding: 8 }}>
        {searchFields}
        <Space>
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
            style={{
              width: 90,
              height: "30px",
              borderRadius: "15px",
            }}
          >
            Search
          </Button>
        </Space>
      </div>
      <Table
        dataSource={data.info}
        loading={tableLoading}
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
      <BucketForm
        id={state.bucketId}
        visible={state.visible}
        loading={state.loading}
        handleOk={handleOk}
        handleCancel={handleCancel}
        handleTableLoading={setTableLoading}
        errorMessageModal={errorMessageModal}
        setRefresh={setRefresh}
      />
    </>
  );
}

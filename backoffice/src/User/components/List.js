import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
import { SearchOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, Modal, Space, Table } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { CONCAT_SERVER_URL } from "../../constants";
import styles from "./List.less";
import { format, addHours } from "date-fns";
import DropOption from "./DropOption";
import BucketForm from "./BucketForm";

export default function List(props) {
  const [state, setState] = useState({
    loading: false,
    bucketId: null,
    visible: false,
  });
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
    created_at: "created_at",
    deleted_at: "deleted_at",
    updated_at: "updated_at",
  };
  const columnObj = {
    id: "",
    name: "",
    email: "",
    online_time: "",
    bucket_time: "",
    created_at: "",
    deleted_at: "",
    updated_at: "",
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
    Modal.confirm({
      title: "Do you want to unbucket this user?",
      icon: <ExclamationCircleOutlined />,
      content: "Some descriptions",
      onOk() {
        return axios({
          method: "delete",
          url: CONCAT_SERVER_URL("/api/v1/user/bucket"),
          data: { id },
        })
          .then((response) => {
            errorMessageModal("Success !");
          })
          .catch((error) => {
            errorMessageModal("Oops~ Please try again !");
          })
          .finally(() => setRefresh((preRefresh) => !preRefresh))
          .catch(() => console.log("Oops errors!"));
      },
      onCancel() {},
    });
  };

  const showDeleteModal = (id) => {
    Modal.confirm({
      title: "Do you want to delete this user?",
      icon: <ExclamationCircleOutlined />,
      content: "Some descriptions",
      onOk() {
        return axios({
          method: "delete",
          url: CONCAT_SERVER_URL("/api/v1/user/admin"),
          data: { id },
        })
          .then((response) => {
            errorMessageModal("Success !");
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
    Modal.confirm({
      title: "Do you want to recover this user?",
      icon: <ExclamationCircleOutlined />,
      content: "Some descriptions",
      onOk() {
        return axios({
          method: "post",
          url: CONCAT_SERVER_URL("/api/v1/user/admin"),
          data: { id },
        })
          .then((response) => {
            errorMessageModal("Success !");
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
    axios
      .get(CONCAT_SERVER_URL("/api/v1/users/admin"), {
        params: filter,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.data !== null) {
          if (response.data.length !== 0) {
            setData({
              info: response.data.data.map((item) => {
                item.created_at = format(
                  new Date(item.created_at),
                  "yyyy-MM-dd HH:mm:ss",
                  { timeZone: "Asia/China" }
                );
                item.bucket_time =
                  item.bucket_time === null
                    ? ""
                    : format(
                        addHours(new Date(item.bucket_time), 8),
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
                item.online_time =
                  item.online_time === null
                    ? ""
                    : format(
                        addHours(new Date(item.online_time), 8),
                        "yyyy-MM-dd HH:mm:ss",
                        {
                          timeZone: "Asia/Taipei",
                        }
                      );
                return item;
              }),
              length: response.data.total,
            });
          }
        }
      })
      .catch((error) => {
        alert("There are some problems during loading");
        console.log(error);
      });
  }, [refresh, filter]);

  const handleOk = () => {
    setState({ ...state, loading: true });
  };

  const handleLoad = () => {
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
      //fixed: "left",
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
              { key: "Unbucket", name: "Unbucket" },
              { key: "Delete", name: "Delete" },
              { key: "Recover", name: "Recover" },
            ]}
          />
        );
      },
    },
  ];

  const searchFields = [];
  Object.keys(columnObj).forEach(function (key) {
    searchFields.push(
      <Input
        key={key}
        placeholder={`Search ${columnTitle[key]}`}
        value={searchText[key]}
        onChange={(event) => {
          setSearchText({
            ...searchText,
            [key]: event.target.value,
          });
          console.log(searchText);
        }}
        onPressEnter={handleSearch}
        style={{ width: 188, margin: 8, display: "inline" }}
      />
    );
  });

  return (
    <>
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
              console.log(page, pageSize, "Change page");
            } else {
              setFilter({ ...filter, page: 1, size: pageSize });
              console.log(page, pageSize, "Change size");
            }
          },
          // onShowSizeChange: (current, pageSize) => {
          //   console.log(current, pageSize);
          // },
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
        handleLoad={handleLoad}
        errorMessageModal={errorMessageModal}
        setRefresh={setRefresh}
      />
    </>
  );
}

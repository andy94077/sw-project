import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
import { Form, InputNumber, Table, Avatar, Modal, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { CONCAT_SERVER_URL } from "../../constants";
import styles from "./List.less";
import { format, addHours } from "date-fns";
import DropOption from "./DropOption";

export default function List(props) {
  const [state, setState] = useState({
    loading: false,
    bucketId: null,
    visible: false,
  });
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);

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
        axios({
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
          .finally(() => setRefresh((preRefresh) => !preRefresh));
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
        axios({
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
        axios({
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
    axios({
      method: "GET",
      url: CONCAT_SERVER_URL("/api/v1/users/admin"),
    })
      .then((response) => {
        if (response.data.success !== null) {
          if (response.data.success === true) {
            setData(
              response.data.data.map((item) => {
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
                        { timeZone: "Asia/China" }
                      );
                item.deleted_at =
                  item.deleted_at === null
                    ? ""
                    : format(new Date(item.deleted_at), "yyyy-MM-dd HH:mm:ss", {
                        timeZone: "Asia/China",
                      });
                item.updated_at =
                  item.updated_at === null
                    ? ""
                    : format(new Date(item.updated_at), "yyyy-MM-dd HH:mm:ss", {
                        timeZone: "Asia/China",
                      });
                item.online_time =
                  item.online_time === null
                    ? ""
                    : format(
                        addHours(new Date(item.online_time), 8),
                        "yyyy-MM-dd HH:mm:ss",
                        {
                          timeZone: "Asia/China",
                        }
                      );
                return item;
              })
            );
          }
        }
      })
      .catch((error) => {
        alert("There are some problems during loading");
        console.log(error);
      });
  }, [refresh]);

  const handleOk = () => {
    setState({ ...state, loading: true });
    setTimeout(() => {
      setState({ ...state, loading: false, visible: false });
    }, 3000);
  };

  const handleCancel = () => {
    setState({ ...state, visible: false });
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
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Online Time",
      dataIndex: "online_time",
      key: "online_time",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Bucket Time",
      dataIndex: "bucket_time",
      key: "bucket_time",
      sorter: (a, b) => a.name.localeCompare(b.name),
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
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "updated_at",
      dataIndex: "updated_at",
      key: "updated_at",
      sorter: (a, b) => a.name.localeCompare(b.name),
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

  const onFinish = ({ hour, year, day, month }) => {
    handleOk();
    axios({
      method: "post",
      url: CONCAT_SERVER_URL("/api/v1/user/bucket"),
      data: {
        id: state.bucketId,
        hour,
        day,
        month,
        year,
      },
    })
      .then((response) => {
        //console.log(response.data);
        errorMessageModal("Success !");
      })
      .catch((error) => {
        errorMessageModal("Oops~ Please try again !");
      })
      .finally(() => setRefresh((preRefresh) => !preRefresh));
  };

  return (
    <>
      <Table
        dataSource={data}
        className={styles.table}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        simple
        rowKey={(record) => record.id}
      />
      <Modal
        visible={state.visible}
        title="Bucket Form"
        onOk={onFinish}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button
            form="bucketForm"
            key="submit"
            type="primary"
            htmlType="submit"
            loading={state.loading}
            onClick={handleOk}
          >
            Submit
          </Button>,
        ]}
        // okButtonProps={{ disabled: true }}
        // cancelButtonProps={{ disabled: true }}
      >
        <Form
          id="bucketForm"
          layout={"horizontal"}
          name="nest-messages"
          onFinish={onFinish}
        >
          <Form.Item
            name={["hour"]}
            label="hour"
            rules={[{ type: "number", min: 0, max: 24 }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name={["day"]}
            label="day"
            rules={[{ type: "number", min: 0, max: 31 }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name={["month"]}
            label="month"
            rules={[{ type: "number", min: 0, max: 12 }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name={["year"]}
            label="year"
            rules={[{ type: "number", min: 0, max: 1000 }]}
          >
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

// List.propTypes = {
//   onDeleteItem: PropTypes.func,
//   onEditItem: PropTypes.func,
//   location: PropTypes.object,
// };

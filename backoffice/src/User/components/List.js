import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
import { Table, Avatar, Modal, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { CONCAT_SERVER_URL } from "../../constants";
import styles from "./List.less";
import { format } from "date-fns";
import DropOption from "./DropOption";

export default function List(props) {
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
          .catch(errorMessageModal("Oops~ Please try again !"));
      },
      onCancel() {},
    });
  };

  const showDeleteModal = () => {
    Modal.confirm({
      title: "Do you want to delete this user?",
      icon: <ExclamationCircleOutlined />,
      content: "Some descriptions",
      onOk() {
        axios({}).then().catch();
      },
      onCancel() {},
    });
  };

  const showRecoverModal = () => {
    Modal.confirm({
      title: "Do you want to recover this user?",
      icon: <ExclamationCircleOutlined />,
      content: "Some descriptions",
      onOk() {
        axios({}).then().catch();
      },
      onCancel() {},
    });
  };

  const handleMenuClick = ({ key, id }) => {
    console.log(key);
    switch (key) {
      case "Bucket":
        setState({
          ...state,
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
  const [state, setState] = useState({
    loading: false,
    visible: false,
  });
  const [data, setData] = useState([]);
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
                  "yyyy-mm-dd hh:mm:ss"
                );
                item.bucket_time =
                  item.bucket_time === null
                    ? ""
                    : format(new Date(item.bucket_time), "yyyy-mm-dd hh:mm:ss");
                item.deleted_at =
                  item.deleted_at === null
                    ? ""
                    : format(new Date(item.deleted_at), "yyyy-mm-dd hh:mm:ss");
                item.updated_at =
                  item.updated_at === null
                    ? ""
                    : format(new Date(item.updated_at), "yyyy-mm-dd hh:mm:ss");
                return item;
              })
            );
          }
        }
      })
      .catch((error) => {
        alert("There are some problems during loading");
      });
  }, []);

  const handleOk = () => {
    setState({ ...state, loading: true });
    setTimeout(() => {
      setState({ loading: false, visible: false });
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
        title="Title"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={state.loading}
            onClick={handleOk}
          >
            Submit
          </Button>,
        ]}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
}

// List.propTypes = {
//   onDeleteItem: PropTypes.func,
//   onEditItem: PropTypes.func,
//   location: PropTypes.object,
// };

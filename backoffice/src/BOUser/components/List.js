import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
import { Table, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { CONCAT_SERVER_URL } from "../../constants";
import styles from "./List.less";
import { format } from "date-fns";
import DropOption from "./DropOption";

export default function List(props) {
  const { refresh, setRefresh } = props;
  const [data, setData] = useState({
    info: [],
    length: null,
  });
  // const [refresh, setRefresh] = useState(false);

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

  const showDeleteModal = (id) => {
    Modal.confirm({
      title: "Do you want to delete this user?",
      icon: <ExclamationCircleOutlined />,
      content: "Some descriptions",
      onOk() {
        return axios({
          method: "delete",
          url: CONCAT_SERVER_URL("/api/v1/superUser/admin"),
          data: { id },
        })
          .then((response) => {
            errorMessageModal("Success !");
          })
          .catch((error) => {
            errorMessageModal("Oops~ Please try again !");
          })
          .finally(() => setRefresh());
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
          url: CONCAT_SERVER_URL("/api/v1/superUser/admin"),
          data: { id },
        })
          .then((response) => {
            errorMessageModal("Success !");
          })
          .catch((error) => {
            errorMessageModal("Oops~ Please try again !");
          })
          .finally(() => setRefresh());
      },
      onCancel() {},
    });
  };

  const handleMenuClick = ({ key, id }) => {
    switch (key) {
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
      .get(CONCAT_SERVER_URL("/api/v1/superUser/admin"), {
        params: {
          page: "1",
          size: "15",
        },
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
                return item;
              }),
              length: response.data.length,
            });
          }
        }
      })
      .catch((error) => {
        alert("There are some problems during loading");
        console.log(error);
      });
  }, [refresh]);

  const columns = [
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
        dataSource={data.info}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ["10", "20", "30"],
          total: data.length,
          showTotal: (total) => `Total result: ${total} `,
        }}
        className={styles.table}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        simple
        rowKey={(record) => record.id}
      />
    </>
  );
}

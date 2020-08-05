import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Table, Avatar } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { CONCAT_SERVER_URL } from "../../constants";
import styles from "./List.less";

// const { confirm } = Modal;

// @withI18n()
export default function List(props) {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios({
      method: "GET",
      url: CONCAT_SERVER_URL("/api/v1/users/admin"),
    })
      .then((response) => {
        if (response.data.success !== null) {
          if (response.data.success === true) {
            setData(response.data.data);
          }
        }
      })
      .catch((error) => {
        alert("There are some problems during loading");
      });
  }, []);

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
      render: (text, record) => <Link to={`user/${record.id}`}>{text}</Link>,
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
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "delete_at",
      dataIndex: "delete_at",
      key: "delete_at",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "update_at",
      dataIndex: "update_at",
      key: "update_at",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Operation",
      key: "operation",
      fixed: "right",
      render: (text, record) => {
        return "HaHaHagergwergwergewrg";
      },
    },
  ];

  // const data = [
  //   {
  //     avatar: "/pictures/avatar.jpeg",
  //     id: "rrjwierjw",
  //     name: "erwrwer",
  //     email: "rrjwierjw",
  //     createTime: "rrjwierjw",
  //     lastloginTime: "rrjwierjw",
  //     lastlogoutTime: "rrjwierjw",
  //   },
  // ];
  console.log(data);
  return (
    <Table
      dataSource={data}
      className={styles.table}
      bordered
      scroll={{ x: 1200 }}
      columns={columns}
      simple
      rowKey={(record) => record.id}
    />
  );
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
};

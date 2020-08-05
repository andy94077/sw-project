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
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => <Link to={`user/${record.id}`}>{text}</Link>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Avatar",
      dataIndex: "avatar_url",
      key: "avatar",
      //width: 72,
      //fixed: "left",
      render: (text) => <Avatar style={{ marginLeft: 8 }} src={text} />,
    },
    {
      title: "created_at",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "updated_at",
      dataIndex: "updated_at",
      key: "updated_at",
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

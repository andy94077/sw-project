import React, { useEffect, PureComponent } from "react";
import PropTypes from "prop-types";
import { Table, Modal, Avatar } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { CONCAT_SERVER_URL } from "../../constants";
import styles from "./List.less";

const { confirm } = Modal;

// @withI18n()
export function List(props) {
  useEffect(() => {
    axios
      .post({
        method: "GET",
        url: CONCAT_SERVER_URL(""),
        data: "",
      })
      .then()
      .catch();
  }, []);

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      //width: 72,
      //fixed: "left",
      render: (text) => <Avatar style={{ marginLeft: 8 }} src={text} />,
    },
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
      title: "CreateTime",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "LastLoginTime",
      dataIndex: "lastloginTime",
      key: "lastloginTime",
    },
    {
      title: "LastLogoutTime",
      dataIndex: "lastlogoutTime",
      key: "lastlogoutTime",
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

  const data = [
    {
      avatar: "/pictures/avatar.jpeg",
      id: "rrjwierjw",
      name: "erwrwer",
      email: "rrjwierjw",
      createTime: "rrjwierjw",
      lastloginTime: "rrjwierjw",
      lastlogoutTime: "rrjwierjw",
    },
  ];

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

export default List;

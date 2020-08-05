import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
import { Table, Avatar } from "antd";
import axios from "axios";
import { CONCAT_SERVER_URL } from "../../constants";
import styles from "./List.less";
import { format, addHours } from "date-fns";

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
                        "yyyy-MM-DD HH:mm:ss",
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
        return "HaHaHagergwergwergewrg";
      },
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

// List.propTypes = {
//   onDeleteItem: PropTypes.func,
//   onEditItem: PropTypes.func,
//   location: PropTypes.object,
// };

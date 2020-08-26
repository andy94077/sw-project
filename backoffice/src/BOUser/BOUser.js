import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button } from "antd";
import { UserAddOutlined } from "@ant-design/icons";

import List from "./components/List";
import SignUpForm from "./components/SignUpForm";
import { CONCAT_SERVER_URL } from "../utils";
import { selectUser } from "../redux/userSlice";

export default function BOUser() {
  const { apiToken } = useSelector(selectUser);
  const [visible, setVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const handleVisible = (_visible) => () => setVisible(_visible);
  const handleSetRefresh = () => setRefresh((_refresh) => !_refresh);
  const [allRoles, setAllRoles] = useState([]);

  useEffect(() => {
    document.title = "BO User";
  }, []);

  useEffect(() => {
    if (apiToken === null) return;
    axios
      .get(CONCAT_SERVER_URL("/api/v1/superUser/allRoles"), {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      })
      .then((res) => setAllRoles(res.data));
  }, [apiToken]);

  return (
    <>
      <div style={{ margin: "10px 0" }}>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={handleVisible(true)}
          style={{ marginLeft: "16px", borderRadius: "20px" }}
        >
          New Admin User
        </Button>
      </div>
      <List
        allRoles={allRoles}
        refresh={refresh}
        setRefresh={handleSetRefresh}
      />
      <SignUpForm
        allRoles={allRoles}
        visible={visible}
        onCancel={handleVisible(false)}
        setRefresh={handleSetRefresh}
      />
    </>
  );
}

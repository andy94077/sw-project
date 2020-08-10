import React, { useState } from "react";
import { Button } from "antd";
import { UserAddOutlined } from "@ant-design/icons";

import List from "./components/List";
import SignUpForm from "./components/SignUpForm";

export default function BOUser(props) {
  const [visible, setVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const handleVisible = (_visible) => () => setVisible(_visible);
  const handleSetRefresh = () => setRefresh((_refresh) => !_refresh);

  return (
    <div>
      <div style={{ margin: "10px 0" }}>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={handleVisible(true)}
          style={{ borderRadius: "20px" }}
        >
          New Admin User
        </Button>
      </div>
      <List refresh={refresh} setRefresh={handleSetRefresh} />
      <SignUpForm
        visible={visible}
        onCancel={handleVisible(false)}
        setRefresh={handleSetRefresh}
      />
    </div>
  );
}

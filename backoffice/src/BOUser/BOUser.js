import React, { useState } from "react";
import axios from "axios";
import { Button } from "antd";
import { UserAddOutlined } from "@ant-design/icons";

import List from "./components/List";
import SignUpForm from "./components/SignUpForm";

export default function BOUser(props) {
  const [visible, setVisible] = useState(false);
  const handleVisible = (_visible) => () => setVisible(_visible);
  return (
    <div>
      <Button
        type="primary"
        icon={<UserAddOutlined />}
        onClick={handleVisible(true)}
      >
        New Admin User
      </Button>
      <List />
      <SignUpForm visible={visible} onCancel={handleVisible(false)} />
    </div>
  );
}

import React from "react";
import { BarsOutlined, DownOutlined } from "@ant-design/icons";
import { Dropdown, Button, Menu } from "antd";

export default function DropOption(props) {
  const { id, onMenuClick, menuOptions, buttonStyle } = props;
  const menu = menuOptions.map((item) => {
    return <Menu.Item key={item.key}>{item.name}</Menu.Item>;
  });
  return (
    <Dropdown
      overlay={
        <Menu onClick={(e) => onMenuClick({ id, key: e.key })}>{menu}</Menu>
      }
    >
      <Button style={{ border: "none", ...buttonStyle }}>
        <BarsOutlined style={{ marginRight: 2 }} />
        <DownOutlined />
      </Button>
    </Dropdown>
  );
}

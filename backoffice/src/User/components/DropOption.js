import React from "react";
import { BarsOutlined, DownOutlined } from "@ant-design/icons";
import { Dropdown, Button, Menu, Tooltip } from "antd";

export default function DropOption(props) {
  const { id, onMenuClick, menuOptions, buttonStyle } = props;
  const menu = menuOptions
    .filter((item) => item !== null && item !== undefined && item !== "")
    .map((item) =>
      item.permission ? (
        <Menu.Item key={item.key}>{item.name}</Menu.Item>
      ) : (
        <Menu.Item key={item.key} disabled>
          <Tooltip placement="left" title="Permission Denied">
            {item.name}
          </Tooltip>
        </Menu.Item>
      )
    );

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

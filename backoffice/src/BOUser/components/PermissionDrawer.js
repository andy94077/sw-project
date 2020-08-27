import React from "react";
import { Drawer, Divider, Typography, Tag } from "antd";

export default function PermissionDrawer(props) {
  const { rolesWithPermissions, onClose, visible } = props;
  return (
    <Drawer
      width={400}
      getContainer={false}
      title={<Typography.Title level={3}>Permissions</Typography.Title>}
      placement="right"
      closable={false}
      onClose={onClose}
      visible={visible}
    >
      {Object.entries(rolesWithPermissions).map(([role, permissions]) => (
        <>
          <Typography.Title level={4} key={role}>
            {role}
          </Typography.Title>
          {permissions.map((item, index) => (
            <Tag
              style={{
                borderRadius: 5,
                marginBottom: index === permissions.length - 1 ? 0 : 5,
              }}
              key={item}
            >
              {item}
            </Tag>
          ))}
          <Divider />
        </>
      ))}
    </Drawer>
  );
}

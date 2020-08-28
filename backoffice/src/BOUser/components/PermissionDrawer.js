import React from "react";
import { Drawer, Divider, Typography, Tag } from "antd";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  tag: {
    borderRadius: 5,
    marginBottom: 5,
    "&:last-child": {
      marginBottom: 0,
    },
  },
}));

export default function PermissionDrawer(props) {
  const { rolesWithPermissions, onClose, visible } = props;
  const classes = useStyles();

  return (
    <Drawer
      width={400}
      getContainer={false}
      title={
        <Typography.Title level={3} style={{ marginBottom: 5 }}>
          Permissions
        </Typography.Title>
      }
      placement="right"
      headerStyle={{ paddingBottom: 0 }}
      closable={false}
      onClose={onClose}
      visible={visible}
    >
      {Object.entries(rolesWithPermissions).map(([role, permissions]) => (
        <>
          <Typography.Title level={4} key={role}>
            {role}
          </Typography.Title>
          {permissions.map((item) => (
            <Tag className={classes.tag} key={item}>
              {item}
            </Tag>
          ))}
          <Divider />
        </>
      ))}
    </Drawer>
  );
}

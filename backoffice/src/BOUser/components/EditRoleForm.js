import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import "antd/dist/antd.css";
import { Modal, Form, Select, Tag } from "antd";
import { CONCAT_SERVER_URL } from "../../utils";
import { selectUser } from "../../redux/userSlice";

export default function EditRoleForm(props) {
  const { allRoles, visible, onCancel, setRefresh, id, userRoles } = props;
  const { apiToken } = useSelector(selectUser);

  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();
  const closeForm = () => {
    form.resetFields();
    setIsLoading(false);
    onCancel();
  };

  const onOk = () => {
    setIsLoading(true);
    form.validateFields().then((values) => {
      axios
        .post(
          CONCAT_SERVER_URL("/api/v1/superUser/roles"),
          {
            id,
            roles: values.roles,
          },
          {
            headers: {
              Authorization: `Bearer ${apiToken}`,
            },
          }
        )
        .then(() => {
          setRefresh();
          closeForm();
        })
        .catch(() => {
          setIsLoading(false);
        });
    });
  };

  return (
    <Modal
      visible={visible}
      title={`Change user roles. (User id = ${id})`}
      okText="Submit"
      confirmLoading={isLoading}
      cancelText="Cancel"
      onCancel={closeForm}
      onOk={onOk}
      cancelButtonProps={{ disabled: isLoading }}
      closable={!isLoading}
      maskClosable={!isLoading}
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item name="roles" label="Roles" initialValue={userRoles}>
          <Select
            mode="multiple"
            placeholder="Roles..."
            allowClear
            tagRender={({ label, closable, onClose }) => (
              <Tag
                closable={closable}
                onClose={onClose}
                style={{ borderRadius: 5 }}
              >
                {label}
              </Tag>
            )}
            dropdownStyle={{
              borderRadius: "5px",
            }}
          >
            {allRoles.map((role) => (
              <Select.Option key={role}>{role}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

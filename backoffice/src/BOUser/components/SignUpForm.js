import React, { useState } from "react";
import axios from "axios";
import "./SignUpForm.css";
import { Modal, Form, Input } from "antd";
import { CONCAT_SERVER_URL } from "../../constants";

export default function SignUpForm(props) {
  const { visible, onCancel, setRefresh } = props;

  const initialFormInfo = {
    username: { validateStatus: null, errMsg: "" },
    email: { validateStatus: null, errMsg: "" },
    password: { validateStatus: null, errMsg: "" },
  };
  const [state, setState] = useState({
    isLoading: false,
    formInfo: initialFormInfo,
  });

  const [form] = Form.useForm();
  const closeForm = () => {
    form.resetFields();
    setState({ isLoading: false, formInfo: initialFormInfo });
    onCancel();
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter") onOk();
  };

  const onOk = () => {
    setState({ isLoading: true, formInfo: initialFormInfo });
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
      })
      .catch((info) => {
        setState((prevState) => ({
          isLoading: false,
          formInfo: {
            ...prevState.formInfo,
            ...Object.fromEntries(
              info.errorFields.map((item) => [
                item.name[0],
                { validateStatus: "error", errMsg: item.errors[0] },
              ])
            ),
          },
        }));
      });
  };

  const onSubmit = (values) => {
    axios
      .post(CONCAT_SERVER_URL("/api/v1/superUser/register"), {
        name: values.username,
        email: values.email,
        password: values.password,
      })
      .then((res) => {
        if (res.data.isSignUp === true) {
          setState({
            ...state,
            isLoading: false,
            formInfo: {
              username: { validateStatus: "success", errMsg: "" },
              email: { validateStatus: "success", errMsg: "" },
              password: { validateStatus: "success", errMsg: "" },
            },
          });
          setRefresh();
          closeForm();
        } else {
          setState({
            isLoading: false,
            formInfo: {
              username: {
                validateStatus:
                  res.data.name.valid === true ? "success" : "error",
                errMsg: res.data.name.msg,
              },
              email: {
                validateStatus:
                  res.data.email.valid === true ? "success" : "error",
                errMsg: res.data.email.msg,
              },
              password: {
                validateStatus:
                  res.data.password.valid === true ? "success" : "error",
                errMsg: res.data.password.msg,
              },
            },
          });
        }
      })
      .catch(() => {
        setState({
          isLoading: false,
          formInfo: {
            username: { validateStatus: "error", errMsg: "" },
            email: { validateStatus: "error", errMsg: "" },
            password: { validateStatus: "error", errMsg: "Connection Fail" },
          },
        });
      });
  };

  return (
    <Modal
      visible={visible}
      title="Create a new admin user"
      okText="Create"
      confirmLoading={state.isLoading}
      cancelText="Cancel"
      onCancel={closeForm}
      onOk={onOk}
      cancelButtonProps={{ disabled: state.isLoading }}
      closable={!state.isLoading}
      maskClosable={!state.isLoading}
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          className="signup-form-input"
          name="username"
          label="Username"
          rules={[
            {
              pattern: /^[A-Za-z0-9._]+$/,
              message:
                "The username should only consist of english letters, numbers, ., or _.",
            },
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
          validateStatus={state.formInfo.username.validateStatus}
          help={state.formInfo.username.errMsg}
          hasFeedback
        >
          <Input />
        </Form.Item>
        <Form.Item
          className="signup-form-input"
          name="email"
          label="Email"
          rules={[
            {
              type: "email",
              message: "The email address is invalid!",
            },
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
          validateStatus={state.formInfo.email.validateStatus}
          help={state.formInfo.email.errMsg}
          hasFeedback
        >
          <Input />
        </Form.Item>
        <Form.Item
          className="signup-form-input"
          name="password"
          label="Password"
          rules={[
            {
              pattern: /^[A-Za-z0-9._]+$/,
              message:
                "The password should only consist of english letters, numbers, ., or _.",
            },
            {
              min: 8,
              message: "The password must be at least 8 characters.",
            },
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          validateStatus={state.formInfo.password.validateStatus}
          help={state.formInfo.password.errMsg}
          hasFeedback
        >
          <Input.Password onKeyUp={handleKeyUp} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

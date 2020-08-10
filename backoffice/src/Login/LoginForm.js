import React, { useState } from "react";
import axios from "axios";
import "./LoginForm.css";
import { Form, Input, Button } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { CONCAT_SERVER_URL } from "../constants";
import { setCookie } from "../cookieHelper";

export default function LoginForm() {
  const [state, setState] = useState({
    isLoading: false,
    validateStatus: null,
    errMsgs: "",
  });
  const history = useHistory();

  const onFinish = (values) => {
    setState({ isLoading: true, validateStatus: null, errMsgs: "" });
    axios
      .post(CONCAT_SERVER_URL("/api/v1/superUser/logIn"), {
        email: values.email,
        password: values.password,
      })
      .then((res) => {
        if (res.data.isLogin === true) {
          setCookie("backofficeAccessToken", res.data.token, 1);
          setState({
            isLoading: false,
            validateStatus: "success",
            errMsgs: "",
          });
          history.push("/dashboard");
        } else {
          setState({
            isLoading: false,
            validateStatus: "error",
            errMsg: "Email or Password is not found",
          });
        }
      })
      .catch(() => {
        setState({
          isLoading: false,
          validateStatus: "error",
          errMsgs: "Connection fail",
        });
      });
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      onFinish={onFinish}
      style={{ flex: 1 }}
    >
      <Form.Item name="email" validateStatus={state.validateStatus}>
        <Input prefix={<MailOutlined />} placeholder="email" />
      </Form.Item>
      <Form.Item
        name="password"
        hasFeedback
        validateStatus={state.validateStatus}
        help={state.errMsg}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="password"
        />
      </Form.Item>

      <Form.Item style={{ marginTop: "10px" }}>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          loading={state.isLoading}
        >
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
}

import React from "react";
import { message, Form, InputNumber, Modal } from "antd";
import axios from "axios";
import { CONCAT_SERVER_URL } from "../../utils";

export default function BucketForm(props) {
  const [form] = Form.useForm();

  const {
    id,
    visible,
    loading,
    handleOk,
    handleCancel,
    handleTableLoading,
    errorMessageModal,
    setRefresh,
  } = props;

  const onFinish = (values) => {
    form
      .validateFields()
      .then(({ hour, year, day, month }) => {
        handleTableLoading(true);
        form.resetFields();
        handleOk();
        axios({
          method: "post",
          url: CONCAT_SERVER_URL("/api/v1/user/bucket"),
          data: {
            id,
            hour,
            day,
            month,
            year,
          },
        })
          .then((response) => {
            message.success(`Bucket successfully! (User id = ${id})`);
          })
          .catch((error) => {
            errorMessageModal("Oops~ Please try again !");
          })
          .finally(() => setRefresh((preRefresh) => !preRefresh));
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  return (
    <Modal
      visible={visible}
      title="Bucket Form"
      destroyOnClose={true}
      onOk={onFinish}
      onCancel={handleCancel}
      closable={!loading}
      maskClosable={!loading}
      okText="Submit"
      cancelText="Return"
    >
      <Form
        id="bucketForm"
        form={form}
        layout={"horizontal"}
        name="nest-messages"
        // onFinish={onFinish}
      >
        <Form.Item
          name={["hour"]}
          label="hour"
          rules={[{ type: "number", min: 0, max: 24 }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name={["day"]}
          label="day"
          rules={[{ type: "number", min: 0, max: 31 }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name={["month"]}
          label="month"
          rules={[{ type: "number", min: 0, max: 12 }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name={["year"]}
          label="year"
          rules={[{ type: "number", min: 0, max: 1000 }]}
        >
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
}

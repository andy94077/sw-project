import React, { useState } from "react";
import axios from "axios";
import MyQuill from "../components/MyQuill";
import { Button, Input, Modal } from "antd";
import { CONCAT_SERVER_URL } from "../utils";

export default function Announcement() {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");

  const handleSetTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleSubmit = () => {
    if (title === "" || value === "" || value === "<p><br></p>") {
      Modal.warning({
        title: "Announcement title & contents cannot be empty.",
      });
      return;
    }

    Modal.confirm({
      title: "Are you sure you want to broadcast this announcement?",
      content: `(Title: ${title})`,
      onOk() {
        const jsonData = {
          data: {
            group: "public",
            header: title,
            content: value,
          },
        };
        setTitle("");
        setValue("");

        axios
          .request({
            method: "POST",
            url: CONCAT_SERVER_URL("/api/v1/broadcast/adPost"),
            data: jsonData,
          })
          // .then((res) => console.log(res))
          .catch(() => console.log("Error"));

        axios
          .request({
            method: "POST",
            url: CONCAT_SERVER_URL("/api/v1/notifications"),
            data: jsonData.data,
          })
          // .then((res) => console.log(res))
          .catch(() => console.log("Error"));
      },
    });
  };

  return (
    <>
      <Input
        placeholder={`Enter title here`}
        value={title}
        onChange={handleSetTitle}
        style={{ width: 188, margin: 8, borderRadius: 15 }}
      />
      <MyQuill value={value} setValue={setValue} />
      <Button onClick={handleSubmit}>submit</Button>
    </>
  );
}

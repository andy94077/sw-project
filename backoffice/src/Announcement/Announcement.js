import React, { useState } from "react";
import axios from "axios";
import MyQuill from "../components/MyQuill";
import { Button, Input } from "antd";
import { CONCAT_SERVER_URL } from "../constants";

export default function Announcement() {
  const [title, setTitle] = useState("");
  const [sender, setSender] = useState("");
  const [value, setValue] = useState("");

  const handleSetTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleSetSender = (event) => {
    setSender(event.target.value);
  };

  const handleSubmit = () => {
    const jsonData = {
      data: {
        group: "public",
        header: title,
        secondary: sender,
        content: value,
      },
    };

    axios
      .request({
        method: "POST",
        url: CONCAT_SERVER_URL("/api/v1/broadcast/adPost"),
        data: jsonData,
      })
      .then((res) => console.log(res))
      .catch(() => console.log("Error"));

    axios
      .request({
        method: "POST",
        url: CONCAT_SERVER_URL("/api/v1/notifications"),
        data: jsonData.data,
      })
      .then((res) => console.log(res))
      .catch(() => console.log("Error"));
    setValue("");
  };

  return (
    <>
      <Input
        placeholder={`Enter title here`}
        value={title}
        onChange={handleSetTitle}
        style={{ width: 188, margin: 8, borderRadius: 15 }}
      />
      <Input
        placeholder={`Enter sender here`}
        value={sender}
        onChange={handleSetSender}
        style={{ width: 188, margin: 8, borderRadius: 15 }}
      />
      <MyQuill value={value} setValue={setValue} />
      <Button onClick={handleSubmit}>submit</Button>
    </>
  );
}

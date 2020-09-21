import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import MyQuill from "../components/MyQuill";
import { Button, Input, Modal, message } from "antd";
import { CONCAT_SERVER_URL } from "../utils";
import { selectUser } from "../redux/userSlice";

export default function Announcement() {
  const { apiToken } = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    document.title = "Announcement";
  }, []);

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
        setIsLoading(true);
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
            url: CONCAT_SERVER_URL("/api/v1/broadcast"),
            headers: {
              Authorization: `Bearer ${apiToken}`,
            },
            data: jsonData,
          })
          .then(() =>
            axios
              .request({
                method: "POST",
                url: CONCAT_SERVER_URL("/api/v1/notifications"),
                data: jsonData.data,
              })
              .then(() => {
                message.destroy();
                message.success("Published successfully.");
              })
              .catch(() =>
                message.error(
                  "Failed to send the notification. Please try again later."
                )
              )
          )
          .catch((err) => {
            message.destroy();
            if (err.response && err.response.status === 403)
              message.error("Permission denied.");
            else message.error("Published failed. Please try again later.");
          })
          .finally(() => setIsLoading(false));
      },
    });
  };

  return (
    <>
      {message.loading({
        // This component will produce a warning: Cannot update during an existing state transition (such as within `render`)
        key: "publish",
        content: "Publishing...",
        duration: 0,
        style: { display: isLoading === true ? "block" : "none" },
      })}
      <Input
        placeholder="Enter title here"
        value={title}
        onChange={handleSetTitle}
        style={{ width: 188, margin: 8, borderRadius: 15 }}
      />
      <MyQuill value={value} setValue={setValue} />
      <Button onClick={handleSubmit}>submit</Button>
    </>
  );
}

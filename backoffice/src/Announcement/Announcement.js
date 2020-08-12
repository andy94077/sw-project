import React, { useState } from "react";
import axios from "axios";
import MyQuill from "../components/MyQuill";
import { Button } from "antd";
import { CONCAT_SERVER_URL } from "../constants";

export default function Announcement() {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const jsonData = {
      text: value,
    };

    axios
      .request({
        method: "POST",
        url: CONCAT_SERVER_URL("/api/v1/broadcast/adPost"),
        data: jsonData,
      })
      .then((res) => console.log(res))
      .catch(() => console.log("Error"));
  };

  return (
    <>
      <MyQuill value={value} setValue={setValue} />
      <Button onClick={handleSubmit}>submit</Button>
    </>
  );
}

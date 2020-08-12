import React, { useState } from "react";
import MyQuill from "../components/MyQuill";
import { Button } from "antd";

export default function Announcement() {
  const [value, setValue] = useState("");
  return (
    <>
      <MyQuill value={value} setValue={setValue} />
      <Button>submit</Button>
    </>
  );
}

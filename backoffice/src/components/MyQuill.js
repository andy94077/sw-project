import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Card, Button } from "antd";

import "./MyQuill.css";

export default function MyQuill() {
  const [value, setValue] = useState("");

  return (
    <Card>
      <ReactQuill theme="snow" value={value} onChange={setValue} />
      <Button>submit</Button>
    </Card>
  );
}

import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Card } from "@material-ui/core";

import "./MyQuill.css";

export default function MyQuill(props) {
  const { value, setValue } = props;
  return (
    <Card>
      <ReactQuill theme="snow" value={value} onChange={setValue} />
    </Card>
  );
}

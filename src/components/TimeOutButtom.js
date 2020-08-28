import React from "react";
import { Button } from "@material-ui/core";

export default function TimeOutButtom(props) {
  const { count } = props;
  return (
    <Button variant="contained" color="primary">
      {`${count} s`}
    </Button>
  );
}

import React from "react";
import Box from "@material-ui/core/Button";

export default (props) => {
  const { id } = props;
  return <Box>{`picture id = ${id}`}</Box>;
};

import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    position: "fixed",
    top: "60px",
    right: "10px",
  },
}));

export default function MyPopper(props) {
  const { children } = props;
  const classes = useStyles();

  return <div className={classes.root}>{children}</div>;
}

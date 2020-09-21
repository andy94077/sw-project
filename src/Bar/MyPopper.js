import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    position: "fixed",
    top: "60px",
    right: "10px",
    background: "white",
    color: "black",
    border: "1px solid",
    borderRadius: "5px",
  },
}));

export default function MyPopper(props) {
  const { children } = props;
  const classes = useStyles();

  return <div className={classes.root}>{children}</div>;
}

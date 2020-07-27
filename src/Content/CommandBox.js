import React from "react";
import { makeStyles, Paper } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles(() => ({
  root: {
    height: "40px",
    width: "77%",
    boxShadow: "rgba(0,0,0,0.3) 0px 2px 10px",
    borderRadius: "30px",
    margin: "5px",
    display: "flex",
  },
  author: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "20px",
    fontWeight: "bold",
  },
  content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "5px",
  },
}));

export default function CommandBox(props) {
  const { author, command } = props;
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <Link to="/profile/author">{author}</Link>
      <div className={classes.content}>{command}</div>
    </Paper>
  );
}

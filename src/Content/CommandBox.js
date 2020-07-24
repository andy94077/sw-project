import React from "react";
import { makeStyles, Paper } from "@material-ui/core";

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
  const { author, command, authorOnClick } = props;
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <div
        className={classes.author}
        onClick={authorOnClick}
        role="button"
        onKeyPress={() => {}}
        tabIndex={0}
      >
        {author}
      </div>
      <div className={classes.content}>{command}</div>
    </Paper>
  );
}

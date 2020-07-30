import React from "react";
import { makeStyles, Paper } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles(() => ({
  root: {
    minHeight: "20px",
    width: "90%",
    borderRadius: "30px",
    margin: "5px",
    display: "flex",
  },
  author: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "5px 20px 5px 20px",
    fontWeight: "bold",
  },
  content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "5px",
    wordBreak: "break-all",
    padding: "0",
    lineHeight: "20px",
  },
}));

export default function CommentBox(props) {
  const { author, command } = props;
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <Link to={`/profile/${author}`} className={classes.author}>
        {author}
      </Link>
      <div className={classes.content}>{command}</div>
    </Paper>
  );
}

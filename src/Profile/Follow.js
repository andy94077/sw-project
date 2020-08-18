import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  bold: {
    color: "#111",
    fontWeight: "700",
  },
}));

export default function Follow(props) {
  const { follow } = props;
  const classes = useStyles();
  return (
    <span className={classes.bold}>
      {follow.followers} followers · {follow.followings} followings
    </span>
  );
}

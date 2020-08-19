import React from "react";
import { makeStyles } from "@material-ui/core";
import Introduction from "./Introduction";
import FollowInformation from "./FollowInformation";

const useStyles = makeStyles(() => ({
  center: {
    textAlign: "center",
  },
  bold: {
    color: "#111",
    fontWeight: "700",
  },
  name: {
    marginTop: "10px",
    fontSize: "36px",
  },
  text: {
    lineHeight: "25px",
    fontSize: "16px",
  },
  url: {
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
      cursor: "pointer",
    },
  },
}));

export default function ProfileInformation(props) {
  const { name, url, follow } = props;
  const classes = useStyles();
  return (
    <>
      <h2 className={`${classes.center} ${classes.name}`}>{name}</h2>
      <div className={`${classes.center} ${classes.text}`}>
        <a className={`${classes.bold} ${classes.url}`} href={url}>
          {url}
        </a>
        <Introduction name={name} />
        <FollowInformation follow={follow} />
      </div>
    </>
  );
}

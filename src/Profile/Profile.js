import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

const useStyles = makeStyles({
  central: {
    display: "block",
    margin: "auto",
  },
  center: {
    textAlign: "center",
  },
  rounded: {
    marginTop: "20px",
    width: "120px",
    borderRadius: "60px",
  },
  bold: {
    color: "#111",
    fontWeight: "700",
  },
  name: {
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
  tmp: {
    marginTop: "100px",
    fontSize: "21px",
    color: "#a3a19a",
  },
});

export default function Profile(props) {
  const classes = useStyles();
  const { avatar, name, url, intro, follow } = props;
  return (
    <div>
      <img
        alt="Avatar"
        className={`${classes.central} ${classes.rounded}`}
        src={avatar}
      />
      <h2 className={`${classes.center} ${classes.name}`}>{name}</h2>
      <div className={`${classes.center} ${classes.text}`}>
        <a className={`${classes.bold} ${classes.url}`} href={url}>
          {url}
        </a>
        &nbsp;·&nbsp;
        <span>{intro}</span>
        <br />
        <span className={classes.bold}>
          {follow[0]} followers · {follow[1]} following
        </span>
      </div>
      <Button
        className={`${classes.central} ${classes.rounded} ${classes.text}`}
        variant="contained"
        color="secondary"
      >
        Follow
      </Button>
      <div className={`${classes.center} ${classes.tmp}`}>
        No image on this profile.
      </div>
    </div>
  );
}

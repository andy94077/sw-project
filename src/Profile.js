import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

const useStyles = makeStyles({
  Central: {
    display: "block",
    margin: "auto",
  },
  Center: {
    textAlign: "center",
  },
  Rounded: {
    marginTop: "20px",
    width: "120px",
    borderRadius: "60px",
  },
  Bold: {
    color: "#111",
    fontWeight: "700",
  },
  Name: {
    fontSize: "36px",
  },
  Text: {
    lineHeight: "25px",
    fontSize: "16px",
  },
  URL: {
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
      cursor: "pointer",
    },
  },
  Tmp: {
    marginTop: "100px",
    fontSize: "21px",
    color: "#a3a19a",
  },
});

function Profile(props) {
  const classes = useStyles();
  const { avatar, name, url, intro, follow } = props;
  return (
    <div>
      <img
        alt="Avatar"
        className={`${classes.Central} ${classes.Rounded}`}
        src={avatar}
      />
      <h2 className={`${classes.Center} ${classes.Name}`}>{name}</h2>
      <div className={`${classes.Center} ${classes.Text}`}>
        <a className={`${classes.Bold} ${classes.URL}`} href={url}>
          {url}
        </a>
        &nbsp;·&nbsp;
        <span>{intro}</span>
        <br />
        <span className={classes.Bold}>
          {follow[0]} followers · {follow[1]} following
        </span>
      </div>
      <Button
        className={`${classes.Central} ${classes.Rounded} ${classes.Text}`}
        variant="contained"
        color="secondary"
      >
        Follow
      </Button>
      <div className={`${classes.Center} ${classes.Tmp}`}>
        No image on this profile.
      </div>
    </div>
  );
}

export default Profile;

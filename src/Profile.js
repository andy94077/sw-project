import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

const useStyles = makeStyles({
  Avatar: {
    display: "block",
    margin: "auto",
    marginTop: "50px",
    width: "120px",
    borderRadius: "60px",
  },
  Name: {
    textAlign: "center",
    fontSize: "36px",
  },
  Text: {
    textAlign: "center",
    lineHeight: "25px",
  },
  URL: {
    color: "#111",
    fontSize: "16px",
    fontWeight: "700",
    "&:hover": {
      textDecoration: "underline",
      cursor: "pointer",
    },
  },
  Follow: {
    color: "#111",
    fontSize: "16px",
    fontWeight: "700",
  },
  Tmp: {
    marginTop: "100px",
    textAlign: "center",
    fontSize: "21px",
    color: "#a3a19a",
  },
});

function Info(props) {
  const classes = useStyles();
  const { avatar, name, url, intro, follow } = props;
  return (
    <div>
      <img alt="Avatar" className={classes.Avatar} src={avatar} />
      <h2 className={classes.Name}>{name}</h2>
      <div className={classes.Text}>
        <span className={classes.URL} href={url}>
          {url}
        </span>
        &nbsp;·&nbsp;
        <span>{intro}</span>
        <br />
        <span className={classes.Follow}>
          {follow[0]} followers · {follow[1]} following
        </span>
      </div>
      <Button className={classes.Avatar} variant="contained" color="secondary">
        Follow
      </Button>
      <div className={classes.Tmp}>No image on this profile.</div>
    </div>
  );
}

export default Info;

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  message: {
    color: "#707070",
    marginTop: "40px",
  },
  imgUrl: {
    display: "block",
    margin: "80px auto 0 auto",
  },
}));

export default function ErrorMsg(props) {
  const {
    message = "Connection Error",
    imgUrl = "/pictures/connection-error.svg",
  } = props;
  const classes = useStyles();
  return (
    <div>
      <img
        className={classes.imgUrl}
        src={imgUrl}
        alt=""
        width="100px"
        height="auto"
      />
      <Typography
        className={classes.message}
        align="center"
        variant="h4"
        display="block"
      >
        {message}
      </Typography>
    </div>
  );
}

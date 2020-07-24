import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormInfo from "./FormInfo";

const useStyles = makeStyles(() => ({
  formFrame: {
    backgroundColor: `rgb(255, 255, 255)`,
    borderRadius: "25px",
    textAlign: "center",
    width: "420px",
    margin: "auto 0px auto 4%",
    minHeight: "600px",
    boxShadow: `rgba(0, 0, 0, 0.45) 0px 2px 10px`,
  },
  logoFrame: {
    backgroundColor: `rgb(255,0,0)`,
    backgroundSize: "50px auto",
    width: "50px",
    height: "50px",
    borderRadius: "30px",
    margin: "0px auto 0px",
  },
}));

export default function LoginForm() {
  const classes = useStyles();
  return (
    <div className={classes.formFrame}>
      <div style={{ padding: "20px 10px 24px" }}>
        <div className={classes.logoFrame} />
        <div style={{ height: "10px" }} />
        <div style={{ margin: "0px auto 0px" }}>
          <h1 style={{ fontSize: "30px", fontWeight: "bold", margin: "0" }}>
            Happy Tree Friend
          </h1>
        </div>
        <div style={{ margin: "30px auto 0px" }}>
          <FormInfo />
        </div>
      </div>
    </div>
  );
}

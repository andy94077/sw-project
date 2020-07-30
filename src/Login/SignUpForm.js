import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import SignUpFormInfo from "./SignUpFormInfo";

const useStyles = makeStyles(() => ({
  formFrame: {
    backgroundColor: `rgb(255, 255, 255)`,
    borderRadius: "25px",
    textAlign: "center",
    width: "420px",
    margin: "auto 0px auto 0%",
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
  signUpFrame: {
    height: "48px",
    width: "100%",
    color: "#111",
    borderRadius: "0 0 25px 25px",
  },
  controlCenter: {
    height: "100%",
  },
  signUpText: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#111",
  },
}));

export default function SignUpForm(props) {
  const { setModalShow } = props;
  const classes = useStyles();
  return (
    <div className={classes.formFrame}>
      <div style={{ padding: "20px 10px 24px", height: "552px" }}>
        <div className={classes.logoFrame} />
        <div style={{ height: "10px" }} />
        <div style={{ margin: "0px auto 0px" }}>
          <h1 style={{ fontSize: "40px", fontWeight: "bold", margin: "0" }}>
            Sign Up
          </h1>
          <div style={{ height: "15px" }} />
          <h1
            style={{
              color: "gray",
              fontSize: "18px",
              fontWeight: "bold",
              margin: "0",
            }}
          >
            It is time to start your adventure
          </h1>
        </div>
        <div style={{ margin: "30px auto 0px" }}>
          <SignUpFormInfo />
        </div>
      </div>
      <Button
        variant="contained"
        className={classes.signUpFrame}
        onClick={setModalShow}
      >
        <div className={classes.signUpText}>Already have an account ?</div>
      </Button>
    </div>
  );
}

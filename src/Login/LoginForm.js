import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "@material-ui/core/Button";
import LoginFormInfo from "./LoginFormInfo";
import "./LoginForm.css";

const useStyles = makeStyles(() => ({
  formFrame: {
    backgroundColor: `rgb(255, 255, 255)`,
    borderRadius: "25px",
    textAlign: "center",
    width: "420px",
    minHeight: "600px",
    boxShadow: `rgba(0, 0, 0, 0.45) 0px 2px 10px`,
  },
  jumpFrame: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "25px",
    textAlign: "center",
    margin: "auto",
    height: "600px",
    overflow: "hidden",
    width: "84%",
    [`@media (min-width: 500px)`]: {
      width: "420px",
    },
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
  outerFrame: {
    padding: "20px 10px 24px",
    height: "552px",
  },
  mainText: {
    fontSize: "50px",
    fontWeight: "bold",
  },
  subText: {
    letterSpacing: "2px",
    color: "gray",
    fontSize: "15px",
    fontWeight: "bold",
    margin: "0",
  },
  contentPosition: {
    margin: "30px auto 0px",
  },
  textPosition: {
    margin: "0px auto 0px",
  },
}));

export default function LoginForm(props) {
  const { onHide, show } = props;
  const classes = useStyles();
  return (
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      dialogClassName={classes.jumpFrame}
    >
      <div>
        <div className={classes.outerFrame}>
          <div className={classes.logoFrame} />
          <div style={{ height: "10px" }} />
          <div className={classes.textPosition}>
            <h1 className={classes.mainText}>Welcome</h1>
            <h1 className={classes.subText}>Login to enjoy your new day</h1>
          </div>
          <div className={classes.formPosition}>
            <LoginFormInfo />
          </div>
        </div>
        <Button
          variant="contained"
          className={classes.signUpFrame}
          onClick={onHide}
        >
          <div className={classes.signUpText}>Create a new account</div>
        </Button>
      </div>
    </Modal>
  );
}

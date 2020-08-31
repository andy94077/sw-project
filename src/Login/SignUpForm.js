import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import { selectUser } from "../redux/userSlice";
import SignUpFormInfo from "./SignUpFormInfo";
import useCountDown from "./useCountDown";
import CircularStatic from "./CircularStatic";
import VerificationPage from "../VerificationPage/VerificationPage";
import "./login.css";

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
  mainText: {
    fontSize: "50px",
    fontWeight: "bold",
  },
  subText: {
    color: "gray",
    fontSize: "18px",
    fontWeight: "bold",
    margin: "0",
  },
  textPosition: {
    margin: "0px auto 0px",
  },
  formPosition: {
    padding: "20px 10px 24px",
    height: "552px",
  },
  contentPosition: {
    margin: "30px auto 0px",
  },
  imgUrl: {
    margin: "0px auto 0px",
    width: "70px",
    height: "70px",
    color: "red",
  },
}));

export default function SignUpForm(props) {
  const { setModalShow } = props;
  const classes = useStyles();
  const { verified } = useSelector(selectUser);
  const [isWait, setIsWait] = useState(false);
  const [count, setCount] = useCountDown();

  return (
    <div className={classes.formFrame}>
      <div className={classes.formPosition}>
        {isWait ? (
          <div className="centerImage">
            <img src="/pictures/logo.svg" className="App-logo" alt="logo" />
            <CircularStatic value={count * 5} />
          </div>
        ) : verified !== null ? (
          <img className={classes.imgUrl} src="/pictures/logo.png" alt="" />
        ) : null}
        <div style={{ height: "10px" }} />
        <div className={classes.textPosition}>
          <h1 className={classes.mainText}>Sign Up</h1>
          <div style={{ height: "15px" }} />
          <h1 className={classes.subText}>
            It is time to start your adventure
          </h1>
        </div>
        <div className={classes.contentPosition}>
          {verified === null ? (
            <SignUpFormInfo />
          ) : (
            <VerificationPage
              count={count}
              setCount={setCount}
              setIsWait={setIsWait}
            />
          )}
        </div>
      </div>
      <Button
        variant="contained"
        component="span"
        className={classes.signUpFrame}
        onClick={setModalShow}
      >
        <div className={classes.signUpText}>Already have an account ?</div>
      </Button>
    </div>
  );
}

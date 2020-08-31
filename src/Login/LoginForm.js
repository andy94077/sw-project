import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "@material-ui/core/Button";
import { selectUser } from "../redux/userSlice";
import LoginFormInfo from "./LoginFormInfo";
import "./LoginForm.css";
import VerificationPage from "../VerificationPage/VerificationPage";
import CustomModal from "../components/CustomModal";

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
  imgUrl: {
    margin: "0px auto 0px",
    width: "70px",
    height: "70px",
    color: "red",
  },
}));

export default function LoginForm(props) {
  const { onHide, show, otherOption } = props;
  const { verified } = useSelector(selectUser);
  const classes = useStyles();
  const imgUrl = "pictures/logo.png";
  return (
    <CustomModal show={show} jumpFrame={classes.jumpFrame}>
      <div>
        <div className={classes.outerFrame}>
          <img className={classes.imgUrl} src={imgUrl} alt="" />
          <div style={{ height: "10px" }} />
          <div className={classes.textPosition}>
            <h1 className={classes.mainText}>Welcome</h1>
            <h1 className={classes.subText}>Login to enjoy your new day</h1>
          </div>
          <div className={classes.formPosition}>
            {verified === null ? <LoginFormInfo /> : <VerificationPage />}
          </div>
        </div>
        <Button
          variant="contained"
          component="span"
          className={classes.signUpFrame}
          onClick={onHide}
        >
          <div className={classes.signUpText}>{otherOption}</div>
        </Button>
      </div>
    </CustomModal>
  );
}

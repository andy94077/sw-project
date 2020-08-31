import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import { setVerified } from "../redux/userSlice";

const useStyles = makeStyles((theme) => ({
  Background: {
    background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(pictures/desktop.png)`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    height: "100%",
    [`@media (min-height: 650px)`]: {
      height: "100vh",
    },
  },
  homePage: {
    position: "relative",
    color: "white",
    "font-size": "72px",
    "font-weight": "600",
  },

  itemFormat: {
    display: "flex",
    alignItems: "center",
    height: "100%",
  },

  titleTEXT: {
    width: "365px",
    minWidth: "365px",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },

  formTEXT: {
    height: "90%",
    maxWidth: "90%",
  },

  pageSetting: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "675px",
    overflow: "hidden",
  },

  spaceControl: {
    width: "10%",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

export default function SignUpPage() {
  const [modalShow, setModalShow] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "賭ケグルイ";
  }, []);

  return (
    <div className={classes.Background}>
      {modalShow ? (
        <LoginForm
          show={modalShow}
          onHide={() => {
            dispatch(setVerified({ verified: null }));
            setModalShow(false);
          }}
          otherOption="Create a new account"
        />
      ) : (
        <div className={classes.itemFormat}>
          <div className={classes.pageSetting}>
            <div className={classes.titleTEXT}>
              <div className={classes.itemFormat}>
                <p className={classes.homePage}>
                  Sign up to enjoy your new day
                </p>
              </div>
            </div>
            <div className={classes.spaceControl} />
            <div className={classes.formTEXT}>
              <div className={classes.itemFormat}>
                <SignUpForm
                  show={modalShow}
                  setModalShow={() => {
                    dispatch(setVerified({ verified: null }));
                    setModalShow(true);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

const useStyles = makeStyles(() => ({
  Background: {
    background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(pictures/desktop.png)`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    height: "100vh",
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
  },

  formTEXT: {
    height: "90%",
  },

  pageSetting: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "675px",
    overflow: "hidden",
  },
}));

export default function SignUpPage() {
  const [modalShow, setModalShow] = useState(false);
  const classes = useStyles();

  return (
    <>
      <div>
        <div className={classes.Background}>
          {!modalShow ? (
            <div className={classes.itemFormat}>
              <div className={classes.pageSetting}>
                <div className={classes.titleTEXT}>
                  <div className={classes.itemFormat}>
                    <p className={classes.homePage}>
                      Sign up to enjoy your new day
                    </p>
                  </div>
                </div>
                <div style={{ width: "10%" }} />
                <div className={classes.formTEXT}>
                  <div className={classes.itemFormat}>
                    <SignUpForm
                      show={modalShow}
                      setModalShow={() => setModalShow(true)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <LoginForm show={modalShow} onHide={() => setModalShow(false)} />
          )}
        </div>
      </div>
    </>
  );
}

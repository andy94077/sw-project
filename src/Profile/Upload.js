import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "@material-ui/core/Button";
import "./Upload.css";
import ContentCard from "./ContentCard";

const useStyles = makeStyles(() => ({
  jumpFrame: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "25px",
    textAlign: "center",
    margin: "auto",
    height: "100%",
    width: "100%",
    overflow: "hidden",
  },
  signUpFrame: {
    height: "48px",
    width: "100%",
    color: "#111",
    borderRadius: "0 0 25px 25px",
  },
  signUpText: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#111",
  },
}));

export default function Upload(props) {
  const { onHide, show, src } = props;
  const classes = useStyles();
  return (
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      // animation={false}
      dialogClassName={classes.jumpFrame}
    >
      <div>
        <ContentCard src={src} />
        <Button
          variant="contained"
          className={classes.signUpFrame}
          onClick={onHide}
        >
          <div className={classes.signUpText}>Cancel</div>
        </Button>
      </div>
      {/* </div> */}
    </Modal>
  );
}

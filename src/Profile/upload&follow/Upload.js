import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "@material-ui/core/Button";
import "../css/Upload.css";
import ContentCard from "../ContentCard";

const useStyles = makeStyles({
  jumpFrame: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "25px",
    textAlign: "center",
    margin: "auto",
    height: "100%",
    maxWidth: "800px",
    overflow: "hidden",
    [`@media (max-width: 800px)`]: {
      maxWidth: "600px",
    },
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
});

export default function Upload(props) {
  const { show, onHide, userId, username, src } = props;
  const classes = useStyles();
  return (
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      centered
      // animation={false}
      dialogClassName={classes.jumpFrame}
    >
      <div>
        <ContentCard userId={userId} username={username} src={src} />
        <Button
          variant="contained"
          className={classes.signUpFrame}
          onClick={onHide}
        >
          <div className={classes.signUpText}>Cancel</div>
        </Button>
      </div>
    </Modal>
  );
}

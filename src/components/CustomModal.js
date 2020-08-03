import React from "react";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CustomModal(props) {
  const { show, jumpFrame, children } = props;
  return (
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      dialogClassName={jumpFrame}
    >
      {children}
    </Modal>
  );
}

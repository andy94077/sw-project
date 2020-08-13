import React from "react";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CustomModal(props) {
  const { show, onHide, jumpFrame, children, backdrop = "static" } = props;
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop={backdrop}
      dialogClassName={jumpFrame}
    >
      {children}
    </Modal>
  );
}

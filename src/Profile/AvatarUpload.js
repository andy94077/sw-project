import React, { useState } from "react";
import axios from "axios";
import Avatar from "react-avatar-edit";
import { Button } from "@material-ui/core";
import { CONCAT_SERVER_URL } from "../constants";
import AlertDialog from "../components/AlertDialog";

export default function AvatarUpload(props) {
  const { name, setIsUpload, setIsLoading, onHide } = props;
  const [avatar, setAvatar] = useState({
    src: null,
    preview: null,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onClose = () => {
    setAvatar({ ...avatar, preview: null });
  };

  const onCrop = (preview) => {
    setAvatar({ ...avatar, preview });
  };

  const onBeforeFileLoad = (e) => {
    if (e.target.files[0].size < 0) {
      e.target.value = "";
    }
  };

  function handleDialogClose() {
    setIsDialogOpen(false);
  }

  const handleUpload = () => {
    setIsLoading(true);
    onHide();
    axios({
      method: "POST",
      url: CONCAT_SERVER_URL("/api/v1/user/uploadUserAvatar"),
      data: { name, imgBase64: avatar.preview },
    })
      .then(() => {
        setIsUpload();
      })
      .catch(() => {
        setIsDialogOpen(true);
      });
  };

  return (
    <div>
      <Avatar
        width={400}
        height={400}
        onCrop={onCrop}
        onClose={onClose}
        onBeforeFileLoad={onBeforeFileLoad}
        src={avatar.src}
        borderStyle={{
          borderRadius: "40px",
          textAlign: "center",
          overflow: "hidden",
        }}
      />
      <Button
        component="span"
        style={{
          borderRadius: "0px",
          height: "40px",
          width: "100%",
          backgroundColor: "gainsboro",
        }}
        onClick={handleUpload}
      >
        Submit
      </Button>
      <AlertDialog
        open={isDialogOpen}
        alertTitle="Warning"
        alertDesciption="You need to upload picture before submit !"
        alertButton={
          <>
            <Button onClick={handleDialogClose}>Got it</Button>
          </>
        }
        onClose={handleDialogClose}
      />
    </div>
  );
}

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, Button } from "@material-ui/core";
import axios from "axios";
import { setDialog } from "../redux/dialogSlice";
import { selectUser } from "../redux/userSlice";
import { CONCAT_SERVER_URL } from "../utils";
import Upload from "./Upload";
import "./Profile.css";

const useStyles = makeStyles(() => ({
  center: {
    textAlign: "center",
  },
  input: {
    display: "none",
  },
  rounded: {
    marginTop: "20px",
    width: "120px",
    borderRadius: "60px",
  },
  text: {
    lineHeight: "25px",
    fontSize: "16px",
  },
}));

export default function UploadButton(props) {
  const { image, setImage } = props;
  const classes = useStyles();
  const { username, userId } = useSelector(selectUser);
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = useState(false);
  const [imageURL, setImageURL] = useState("");

  const handleUploadImage = (event) => {
    if (image === event.target.value) {
      return;
    }
    setModalShow(true);

    const formData = new FormData();
    formData.append("imageupload", event.target.files[0]);
    formData.append("user_id", userId);

    axios
      .request({
        method: "POST",
        url: CONCAT_SERVER_URL("/api/v1/profile/uploadImage"),
        data: formData,
      })
      .then((res) => setImageURL(res.data.url))
      .catch((e) => {
        if (e.message === "Request failed with status code 403") {
          dispatch(
            setDialog({
              title: "Bucket Error",
              message: "You cannot send comment when you in the bucket",
            })
          );
        } else {
          setImageURL("Error");
        }
      });
  };

  const handleUploadCancel = () => {
    setImage("");
    setImageURL("");
    setModalShow(false);

    const formData = new FormData();
    formData.append("canceledURL", imageURL);

    if (imageURL !== "Error") {
      axios.request({
        method: "POST",
        url: CONCAT_SERVER_URL("/api/v1/profile/deleteImage"),
        data: formData,
      });
      // No need to catch.
    }
  };

  return (
    <div className={classes.center}>
      <label htmlFor="contained-button-file">
        <input
          accept="image/*"
          className={classes.input}
          id="contained-button-file"
          type="file"
          onChange={handleUploadImage}
          value={image}
        />
        <Button
          variant="contained"
          color="primary"
          component="span"
          className={`${classes.rounded} ${classes.text}`}
        >
          Upload
        </Button>
      </label>
      <Upload
        show={modalShow}
        onHide={handleUploadCancel}
        userId={userId}
        username={username}
        src={imageURL}
      />
    </div>
  );
}

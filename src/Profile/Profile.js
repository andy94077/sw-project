import React, { useState } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import PhotoGrid from "../components/PhotoGrid";
import Bar from "../Bar/Bar";
import Upload from "./Upload";

const useStyles = makeStyles((theme) => ({
  central: {
    display: "block",
    margin: "auto",
    width: "70%",
    [theme.breakpoints.down("sm")]: {
      width: "95%",
    },
  },
  center: {
    textAlign: "center",
  },
  rounded: {
    marginTop: "20px",
    width: "120px",
    borderRadius: "60px",
  },
  bold: {
    color: "#111",
    fontWeight: "700",
  },
  name: {
    fontSize: "36px",
  },
  text: {
    lineHeight: "25px",
    fontSize: "16px",
  },
  url: {
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
      cursor: "pointer",
    },
  },
  input: {
    display: "none",
  },
  tmp: {
    marginTop: "100px",
    fontSize: "21px",
    color: "#a3a19a",
  },
}));

export default function Profile({ match }) {
  const { name } = match.params;
  const classes = useStyles();
  const follow = [123, 456];
  const avatar = "/pictures/avatar.jpeg";
  const url = "localhost:3000";
  const intro = "hi";

  const [image, setImage] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [modalShow, setModalShow] = useState(false);

  const handleUploadImage = (event) => {
    if (image === event.target.value) {
      return;
    }

    const formData = new FormData();
    formData.append("imageupload", event.target.files[0]);

    axios
      .request({
        method: "POST",
        url: "http://pinterest-server.test/api/v1/profile/uploadImage",
        data: formData,
      })
      .then((res) => {
        setImageURL(res.data.url);
        setModalShow(true);
      });
  };

  const handleUploadCancel = () => {
    setImage("");
    setModalShow(false);

    const formData = new FormData();
    formData.append("canceledURL", imageURL);

    axios.request({
      method: "POST",
      url: "http://pinterest-server.test/api/v1/profile/deleteImage",
      data: formData,
    });
  };

  return (
    <div>
      <Bar />
      <img
        alt="Avatar"
        className={`${classes.central} ${classes.rounded}`}
        src={avatar}
      />
      <h2 className={`${classes.center} ${classes.name}`}>{name}</h2>
      <div className={`${classes.center} ${classes.text}`}>
        <a className={`${classes.bold} ${classes.url}`} href={url}>
          {url}
        </a>
        &nbsp;·&nbsp;
        <span>{intro}</span>
        <br />
        <span className={classes.bold}>
          {follow[0]} followers · {follow[1]} following
        </span>
      </div>
      {/* Upload button */}
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
          src={`http://pinterest-server.test${imageURL}`}
        />
      </div>
      <Button
        className={`${classes.central} ${classes.rounded} ${classes.text}`}
        variant="contained"
        color="secondary"
      >
        Follow
      </Button>
      <div className={classes.central}>
        <PhotoGrid
          imageList={Array.from({ length: 12 }, (_, i) => `${i + 1}`)}
        />
      </div>
    </div>
  );
}

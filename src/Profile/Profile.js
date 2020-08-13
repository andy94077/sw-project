import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { addHours, compareAsc } from "date-fns";
import { Button } from "@material-ui/core";
import Loading from "../components/Loading";
import Errormsg from "../components/ErrorMsg";
import ErrorGrid from "../components/ErrorGrid";
import PhotoGrid from "../components/PhotoGrid";
import Upload from "./Upload";
import { CONCAT_SERVER_URL } from "../constants";
import { selectUser } from "../redux/userSlice";

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
  paper: {
    padding: "10px",
    paddingTop: "50px",
    paddingBottom: "50px",
    marginTop: "100px",
  },
}));

function checkBucket(bucketTime) {
  if (bucketTime) {
    const bucketDate = addHours(new Date(bucketTime), 8);
    const now = new Date();
    if (compareAsc(bucketDate, now) === 1) {
      return true;
    }
  }
  return false;
}

export default function Profile(props) {
  const {
    match: {
      params: { name },
    },
  } = props;

  const classes = useStyles();
  const follow = [123, 456];
  const avatar = "/pictures/avatar.jpeg";
  const url = "localhost:3000";
  const intro = "hi";

  const [image, setImage] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [isReady, setIsReady] = useState("Loading");
  const [isMyself, setIsMyself] = useState(false);
  const [id, setId] = useState(0);
  const { username, userId, bucketTime } = useSelector(selectUser);
  const isBucket = checkBucket(bucketTime);

  useEffect(() => {
    setIsReady("Loading");
    const jsonData = { name };

    axios
      .request({
        method: "POST",
        url: CONCAT_SERVER_URL("/api/v1/user/userExist"),
        data: jsonData,
      })
      .then((res) => {
        const userExist = res.data.isValid;
        // Not existed user
        if (userExist === false) {
          setIsReady("NoUser");
          return;
        }
        // My profile
        if (username === name) {
          setIsMyself(true);
        }
        setId(res.data.id);
        setIsReady("OK");
      })
      .catch(() => setIsReady("Error"));
  }, [username, name]);

  const handleUploadImage = (event) => {
    if (image === event.target.value) {
      return;
    }
    setModalShow(true);

    const formData = new FormData();
    formData.append("imageupload", event.target.files[0]);

    axios
      .request({
        method: "POST",
        url: CONCAT_SERVER_URL("/api/v1/profile/uploadImage"),
        data: formData,
      })
      .then((res) => setImageURL(res.data.url))
      .catch(() => setImageURL("Error"));
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

  const uploadButton = isBucket ? (
    <div className={classes.center}>In Bucket</div>
  ) : (
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
        username={name}
        src={imageURL}
      />
    </div>
  );

  const followButton = (
    <Button
      className={`${classes.central} ${classes.center} ${classes.rounded} ${classes.text}`}
      variant="contained"
      color="secondary"
      component="span"
    >
      Follow
    </Button>
  );

  if (isReady === "OK") {
    return (
      <div>
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

        {username !== null && (isMyself ? uploadButton : followButton)}

        <div className={classes.central}>
          <PhotoGrid userId={id} />
        </div>
      </div>
    );
  }
  if (isReady === "NoUser") {
    return <ErrorGrid mes="user" />;
  }
  if (isReady === "Error") {
    return <Errormsg />;
  }
  return <Loading />;
}

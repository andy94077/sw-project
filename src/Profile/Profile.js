import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import PhotoGrid from "../components/PhotoGrid";
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
  paper: {
    padding: "10px",
    paddingTop: "50px",
    paddingBottom: "50px",
    marginTop: "100px",
  },
}));

export default function Profile(props) {
  const {
    username,
    userId,
    match: {
      params: { name },
    },
  } = props;

  // const userId = 1;
  // const username = "user1";
  // const { name } = match.params;

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
  const [id, setId] = useState(null);

  useEffect(() => {
    setIsReady("Loading");
    const jsonData = { name };

    axios
      .request({
        method: "POST",
        url: "http://pinterest-server.test/api/v1/user/userExist",
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
      });
  }, [username, name]);

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

  const uploadButton = (
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
        src={`http://pinterest-server.test${imageURL}`}
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

        {isMyself ? uploadButton : followButton}

        <div className={classes.central}>
          <PhotoGrid userId={id} />
        </div>
      </div>
    );
  }
  if (isReady === "NoUser") {
    return (
      <Paper
        variant="outlined"
        className={`${classes.central} ${classes.paper}`}
      >
        <Typography variant="h4" gutterBottom className={classes.center}>
          Error: user does not exist
        </Typography>
        <Link to="/home">
          <Button
            variant="contained"
            className={`${classes.central} ${classes.text}`}
          >
            Back to homepage
          </Button>
        </Link>
      </Paper>
    );
  }
  return (
    <div>
      <CircularProgress />
    </div>
  );
}

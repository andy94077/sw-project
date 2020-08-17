import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { GridListTileBar, makeStyles, Button } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import { addHours, compareAsc } from "date-fns";
import Loading from "../components/Loading";
import Errormsg from "../components/ErrorMsg";
import ErrorGrid from "../components/ErrorGrid";
import PhotoGrid from "../components/PhotoGrid";
import Upload from "./Upload";
import { CONCAT_SERVER_URL } from "../utils";
import { selectUser, setAvatar } from "../redux/userSlice";
import CustomModal from "../components/CustomModal";
import AvatarUpload from "./AvatarUpload";
import { setDialog } from "../redux/dialogSlice";
import "./Profile.css";
import SelfInformation from "./SelfInformation";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    width: "120px",
    margin: "auto",
    outline: "none",
    borderRadius: "60px",
  },
  jumpFrame: {
    height: "400px",
    width: "400px",
    borderRadius: "30px",
  },
  icon: {
    position: "absolute",
    right: "-23px",
    bottom: "-10px",
    color: "#eeeeee",
  },
  bar: {
    height: "120px",
    borderRadius: "60px",
  },
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
    marginTop: "10px",
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
  const url = "localhost:3000";

  const [image, setImage] = useState("");
  const dispatch = useDispatch();
  const stableDispatch = useCallback(dispatch, []);
  const [isUpload, setIsUpload] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [isReady, setIsReady] = useState("Loading");
  const [isMyself, setIsMyself] = useState(false);
  const [isAvatarUpload, setIsAvatarUpload] = useState(false);
  const [id, setId] = useState(0);
  const [avatarVisibility, setUploadVisibility] = useState(false);
  const { username, userId, userAvatar, bucketTime } = useSelector(selectUser);
  const isBucket = checkBucket(bucketTime);
  const changeUploadVisibility = () => setUploadVisibility(!avatarVisibility);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = `${name}のホームページ`;
  });

  useEffect(() => {
    setIsLoading(true);
    axios
      .request({
        method: "POST",
        url: CONCAT_SERVER_URL("/api/v1/user/getUserAvatar"),
        data: { name },
      })
      .then((response) => {
        stableDispatch(
          setAvatar({ userAvatar: CONCAT_SERVER_URL(`${response.data}`) })
        );
      })
      .finally(() => setIsLoading(false));
  }, [name, isUpload, stableDispatch]);

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

  const onHide = () => {
    setIsAvatarUpload(false);
  };

  const handleAvatarUpload = () => {
    setIsAvatarUpload(true);
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      handleAvatarUpload();
    }
  };

  if (isReady === "OK") {
    return (
      <div>
        {/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
        {isMyself ? (
          <div
            className={classes.root}
            onMouseEnter={changeUploadVisibility}
            onMouseLeave={changeUploadVisibility}
            role="button"
            tabIndex="0"
            onClick={handleAvatarUpload}
            onKeyUp={handleKeyUp}
          >
            {isLoading ? (
              <div style={{ height: "120px" }}>
                <Loading />
              </div>
            ) : (
              <img
                alt="Avatar"
                className={`${classes.central} ${classes.rounded}`}
                src={userAvatar}
              />
            )}
            {avatarVisibility && (
              <GridListTileBar
                className={classes.bar}
                title={image}
                actionIcon={
                  <IconButton
                    aria-label={`info about ${image}`}
                    className={classes.icon}
                    disabled
                  >
                    <EditIcon />
                  </IconButton>
                }
              />
            )}
          </div>
        ) : (
          <img
            alt="Avatar"
            className={`${classes.central} ${classes.rounded}`}
            src={userAvatar}
          />
        )}
        <h2 className={`${classes.center} ${classes.name}`}>{name}</h2>
        <div className={`${classes.center} ${classes.text}`}>
          <a className={`${classes.bold} ${classes.url}`} href={url}>
            {url}
          </a>
          <SelfInformation />
          <span className={classes.bold}>
            {follow[0]} followers · {follow[1]} following
          </span>
        </div>

        {username !== null && (isMyself ? uploadButton : followButton)}

        <div className={classes.central}>
          <PhotoGrid userId={id} />
        </div>
        <CustomModal
          show={isAvatarUpload}
          onHide={onHide}
          jumpFrame={classes.jumpFrame}
          backdrop
        >
          <AvatarUpload
            setIsLoading={setIsLoading}
            name={name}
            setIsUpload={() => {
              setIsUpload((preState) => !preState);
            }}
            onHide={onHide}
          />
        </CustomModal>
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

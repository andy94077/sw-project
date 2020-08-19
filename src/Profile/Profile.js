import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { makeStyles } from "@material-ui/core";
import { addHours, compareAsc } from "date-fns";
import Loading from "../components/Loading";
import Errormsg from "../components/ErrorMsg";
import ErrorGrid from "../components/ErrorGrid";
import PhotoGrid from "../components/PhotoGrid";
import { CONCAT_SERVER_URL } from "../utils";
import { selectUser, setAvatar } from "../redux/userSlice";
import CustomModal from "../components/CustomModal";
import AvatarUpload from "./AvatarUpload";
import "./css/Profile.css";
import FollowButton from "./upload&follow/FollowButton";
import UploadButton from "./upload&follow/UploadButton";
import ProfileAvatar from "./userInfo/ProfileAvatar";
import ProfileInformation from "./userInfo/ProfileInformation";

const useStyles = makeStyles((theme) => ({
  jumpFrame: {
    height: "400px",
    width: "400px",
    borderRadius: "30px",
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
  const url = "localhost:3000";

  const [image, setImage] = useState("");
  const dispatch = useDispatch();
  const stableDispatch = useCallback(dispatch, []);
  const [isUpload, setIsUpload] = useState(false);
  const [isReady, setIsReady] = useState("Loading");
  const [isMyself, setIsMyself] = useState(false);
  const [isAvatarUpload, setIsAvatarUpload] = useState(false);
  const [id, setId] = useState(0);
  const { username, userId, bucketTime } = useSelector(selectUser);
  const [follow, setFollow] = useState({ followers: 0, followings: 0 });
  const isBucket = checkBucket(bucketTime);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = `${name}のホームページ`;
  });

  useEffect(() => {
    if (name === username) {
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
    }
  }, [name, isUpload, stableDispatch]);

  async function refreshInfo() {
    const jsonData = { name };
    const res = await axios.request({
      method: "POST",
      url: CONCAT_SERVER_URL("/api/v1/user/userExist"),
      data: jsonData,
    });
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
    axios
      .get(CONCAT_SERVER_URL("/api/v1/follows/info"), {
        params: { user_id: res.data.id },
      })
      .then(({ data }) => {
        setFollow({ followers: data.followers, followings: data.followings });
      });
    setIsReady("OK");
  }

  function refreshFollow() {
    axios
      .get(CONCAT_SERVER_URL("/api/v1/follows/info"), {
        params: { user_id: id },
      })
      .then(({ data }) => {
        setFollow({ followers: data.followers, followings: data.followings });
      })
      .catch(() => setIsReady("Error"));
  }

  useEffect(() => {
    setIsReady("Loading");
    refreshInfo().catch(() => setIsReady("Error"));
  }, [username, name]);

  const uploadButton = isBucket ? (
    <div className={classes.center}>In Bucket</div>
  ) : (
    <UploadButton image={image} setImage={setImage} />
  );

  const followButton = (
    <FollowButton id={id} userId={userId} refresh={refreshFollow} />
  );

  const onHide = () => {
    setIsAvatarUpload(false);
  };

  if (isReady === "OK") {
    return (
      <div>
        <ProfileAvatar
          name={name}
          image={image}
          isLoading={isLoading}
          setIsAvatarUpload={setIsAvatarUpload}
        />
        <ProfileInformation name={name} url={url} follow={follow} />
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

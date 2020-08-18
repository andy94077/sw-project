import React, { useState, useEffect } from "react";
import { Button, makeStyles } from "@material-ui/core";
import Axios from "axios";
import { CONCAT_SERVER_URL } from "../utils";
import ErrorMsg from "../components/ErrorMsg";

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
  text: {
    lineHeight: "25px",
    fontSize: "16px",
  },
}));

export default function FollowButton(props) {
  const { id, userId, refresh } = props;
  const [followInfo, setFollowInfo] = useState({
    isFollow: false,
    followId: null,
  });
  const [error, setError] = useState({ message: "", url: "" });
  const classes = useStyles();

  function refreshFollow() {
    setError({ message: "", url: "" });
    Axios.get(CONCAT_SERVER_URL("/api/v1/follows"), {
      params: { follower_id: userId, target_id: id },
    })
      .then((res) => {
        if (res.data[0]) {
          setFollowInfo({ isFollow: true, followId: res.data[0].id });
        }
      })
      .catch(() => {
        setError({
          message: "Connection Error",
          url: "/pictures/connection-error.svg",
        });
      });
  }
  useEffect(() => {
    refreshFollow();
  }, [id, userId]);

  function deleteFollow() {
    setError({ message: "", url: "" });
    Axios.delete(CONCAT_SERVER_URL(`/api/v1/follows/${followInfo.followId}`))
      .then(() => {
        setFollowInfo({ followId: followInfo.id, isFollow: null });
        refresh();
      })
      .catch(() => {
        setError({
          message: "Connection Error",
          url: "/pictures/connection-error.svg",
        });
      });
  }

  function putFollow() {
    setError({ message: "", url: "" });
    Axios.put(CONCAT_SERVER_URL(`/api/v1/follows/${followInfo.followId}`))
      .then(() => {
        setFollowInfo({ followId: followInfo.followId, isFollow: null });
        refresh();
      })
      .catch(() => {
        setError({
          message: "Connection Error",
          url: "/pictures/connection-error.svg",
        });
      });
  }

  function postFollow() {
    setError({ message: "", url: "" });
    Axios.post(CONCAT_SERVER_URL("/api/v1/follows"), {
      follower_id: userId,
      target_id: id,
    })
      .then((res) => {
        setFollowInfo({ isFollow: true, followId: res.data.id });
        refresh();
      })
      .catch(() => {
        setError({
          message: "Connection Error",
          url: "/pictures/connection-error.svg",
        });
      });
  }

  function checkHandleType(Info) {
    if (Info.followId) {
      if (Info.isFollow) {
        return "DeleteById";
      }
      return "UpdateById";
    }
    return "PostByUserIdAndId";
  }

  function handleClick() {
    const handleType = checkHandleType(followInfo);
    if (handleType === "DeleteById") {
      deleteFollow();
    } else if (handleType === "UpdateById") {
      putFollow();
    } else if (handleType === "PostByUserIdAndId") {
      postFollow();
    }
  }

  if (error.message) {
    return <ErrorMsg message={error.message} imgUrl={error.url} />;
  }

  return (
    <Button
      className={`${classes.central} ${classes.center} ${classes.rounded} ${classes.text}`}
      variant="contained"
      color="secondary"
      component="span"
      onClick={handleClick}
    >
      {followInfo.isFollow ? "UnFollow" : "Follow"}
    </Button>
  );
}

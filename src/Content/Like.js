import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Axios from "axios";
import { IconButton } from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { CONCAT_SERVER_URL } from "../utils";
import { selectUser } from "../redux/userSlice";
import { setDialog } from "../redux/dialogSlice";

const useStyles = makeStyles(() => ({
  none: {},
  red: {
    color: "red",
  },
  likeButton: {
    outline: 0,
    "&:focus": {
      outline: 0,
    },
  },
  cardActions: {
    padding: "0px",
  },
  likeUser: {
    fontSize: "0.7em",
    fontWeight: "450",
  },
}));

export default function Like(props) {
  const [likeInfo, setLikeInfo] = useState({
    id: null,
    red: false,
  });
  const [likeCount, setLikeCount] = useState({ sum: 0, likers: "" });
  const classes = useStyles();
  const { id } = props;
  const { userId } = useSelector(selectUser);
  const dispatch = useDispatch();

  function refreshLikeCount() {
    Axios.get(CONCAT_SERVER_URL("/api/v1/likes/sum"), {
      params: { post_id: id },
    })
      .then((res) => {
        let likerString = "";
        if (res.data.likers.length !== 0) {
          if (res.data.likers.length === 1) {
            likerString = (
              <div className={classes.likeUser}>
                <Link to={`/profile/${res.data.likers[0].username}`}>
                  {res.data.likers[0].username}
                </Link>
                {" likes this post."}
              </div>
            );
          } else if (res.data.likers.length === 2) {
            likerString = (
              <div className={classes.likeUser}>
                <Link to={`/profile/${res.data.likers[0].username}`}>
                  {res.data.likers[0].username}
                </Link>
                {", "}
                <Link to={`/profile/${res.data.likers[1].username}`}>
                  {res.data.likers[1].username}
                </Link>
                {" like this post."}
              </div>
            );
          } else if (res.data.sum === 3) {
            likerString = (
              <div className={classes.likeUser}>
                <Link to={`/profile/${res.data.likers[0].username}`}>
                  {res.data.likers[0].username}
                </Link>
                {", "}
                <Link to={`/profile/${res.data.likers[1].username}`}>
                  {res.data.likers[1].username}
                </Link>
                {", "}
                <Link to={`/profile/${res.data.likers[2].username}`}>
                  {res.data.likers[2].username}
                </Link>
                {" like this post."}
              </div>
            );
          } else if (res.data.sum === 4) {
            likerString = (
              <div className={classes.likeUser}>
                <Link to={`/profile/${res.data.likers[0].username}`}>
                  {res.data.likers[0].username}
                </Link>
                {", "}
                <Link to={`/profile/${res.data.likers[1].username}`}>
                  {res.data.likers[1].username}
                </Link>
                {", "}
                <Link to={`/profile/${res.data.likers[2].username}`}>
                  {res.data.likers[2].username}
                </Link>{" "}
                {`and other ${res.data.sum - 3} user
              like this post.`}
              </div>
            );
          } else {
            likerString = (
              <div className={classes.likeUser}>
                <Link to={`/profile/${res.data.likers[0].username}`}>
                  {res.data.likers[0].username}
                </Link>
                {", "}
                <Link to={`/profile/${res.data.likers[1].username}`}>
                  {res.data.likers[1].username}
                </Link>
                {", "}
                <Link to={`/profile/${res.data.likers[2].username}`}>
                  {res.data.likers[2].username}
                </Link>{" "}
                {`and other ${res.data.sum - 3} users
              like this post.`}
              </div>
            );
          }
        }
        setLikeCount({ sum: res.data.sum, likers: likerString });
      })
      .catch(() => {
        dispatch(
          setDialog({
            title: "Connection Error",
            message:
              "Network failed. Please check the network cables, modem, and router.",
          })
        );
      });
  }

  const refreshLike = () => {
    if (userId) {
      Axios.get(CONCAT_SERVER_URL("/api/v1/likes"), {
        params: {
          user_id: userId,
          post_id: id,
        },
      })
        .then((res) => {
          if (res.data[0]) {
            setLikeInfo({
              id: res.data[0].id,
              red: res.data[0].deleted_at === null,
            });
          }
        })
        .catch(() => {
          dispatch(
            setDialog({
              title: "Connection Error",
              message:
                "Network failed. Please check the network cables, modem, and router.",
            })
          );
        });
    }
  };

  useEffect(() => {
    refreshLike();
    refreshLikeCount();
  }, [id]);

  const handleLike = () => {
    if (likeInfo.id !== null) {
      if (likeInfo.red) {
        Axios.delete(CONCAT_SERVER_URL(`/api/v1/likes/${likeInfo.id}`))
          .then(() => {
            setLikeInfo({
              id: likeInfo.id,
              red: false,
            });
            refreshLikeCount();
          })
          .catch(() => {
            dispatch(
              setDialog({
                title: "Connection Error",
                message:
                  "Network failed. Please check the network cables, modem, and router.",
              })
            );
          });
      } else {
        Axios.put(CONCAT_SERVER_URL(`/api/v1/likes/${likeInfo.id}`))
          .then(() => {
            setLikeInfo({
              id: likeInfo.id,
              red: true,
            });
            refreshLikeCount();
          })
          .catch(() => {
            dispatch(
              setDialog({
                title: "Connection Error",
                message:
                  "Network failed. Please check the network cables, modem, and router.",
              })
            );
          });
      }
    } else {
      Axios.post(CONCAT_SERVER_URL("/api/v1/likes"), {
        user_id: userId,
        post_id: id,
      })
        .then((res) => {
          setLikeInfo({
            id: res.data.id,
            red: true,
          });
          refreshLikeCount();
        })
        .catch(() => {
          dispatch(
            setDialog({
              title: "Connection Error",
              message:
                "Network failed. Please check the network cables, modem, and router.",
            })
          );
        });
    }
  };

  return (
    <>
      {userId ? (
        <IconButton className={classes.likeButton} onClick={handleLike}>
          <FavoriteIcon
            className={clsx(classes.none, {
              [classes.red]: likeInfo.red,
            })}
          />
        </IconButton>
      ) : (
        <div style={{ width: "15px" }} />
      )}
      <div>
        <div>{`${likeCount.sum} Likes`}</div>
        {likeCount.likers}
      </div>
    </>
  );
}

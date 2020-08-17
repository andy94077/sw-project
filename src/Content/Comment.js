import React, { useState, useEffect } from "react";
import SendIcon from "@material-ui/icons/Send";
import { makeStyles, Button, TextareaAutosize } from "@material-ui/core";
import ScrollToBottom from "react-scroll-to-bottom";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";

import CommentBox from "./CommentBox";
import { selectUser } from "../redux/userSlice";
import Loading from "../components/Loading";
import { CONCAT_SERVER_URL } from "../constants";
import { setDialog } from "../redux/dialogSlice";

const useStyles = makeStyles(() => ({
  input: {
    resize: "none",
    width: "90%",
    borderRadius: "20px",
    fontSize: "20px",
    alignItems: "center",
  },
  comments: {
    overflow: "auto",
    weight: "100%",
    flexGrow: "1",
    marginLeft: "5%",
    display: "flex",
  },
  comment: {
    marginLeft: "10%",
    display: "flex",
    margin: "5px",
    width: "80%",
    height: "40px",
  },
}));

export default function Comment(props) {
  const classes = useStyles();
  const [value, setValue] = useState("");
  const { author, isBucket, id, setError } = props;
  const [comments, setComments] = useState([]);
  const { username, userId } = useSelector(selectUser);
  const [isUpload, setIsUpload] = useState(false);
  const dispatch = useDispatch();

  function refreshComment() {
    Axios.get(CONCAT_SERVER_URL("/api/v1/comment/post"), {
      params: { post: id },
    })
      .then(({ data }) => {
        setComments(data.reverse());
        setIsUpload(false);
      })
      .catch(() => {
        setIsUpload(false);
      });
  }

  function upload() {
    if (isBucket) {
      dispatch(
        setDialog({
          title: "Bucket Error",
          message: "You cannot send comment when you in the bucket",
        })
      );
    } else {
      setIsUpload(true);
      Axios.post(CONCAT_SERVER_URL("/api/v1/comment/upload"), {
        content: value,
        user_id: userId,
        post_id: id,
        user: true,
      })
        .then(() => {
          refreshComment();
          setValue("");
        })
        .catch((e) => {
          if (e.message === "Network Error") {
            setError({
              message: "Connection Error",
              url: "/pictures/connection-error.svg",
            });
            setIsUpload(false);
          } else if (e.message === "Request failed with status code 404") {
            dispatch(
              setDialog({
                title: "Error",
                message: "Post is deleted",
              })
            );
          } else if (e.message === "Request failed with status code 403") {
            dispatch(
              setDialog({
                title: "Bucket Error",
                message: "You cannot send comment when you in the bucket",
              })
            );
          }
          setIsUpload(false);
        });
    }
  }

  useEffect(() => {
    refreshComment();
  }, [id]);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (value !== "") upload();
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && value !== "") upload();
  };
  return (
    <>
      <ScrollToBottom className={classes.comments}>
        {comments.map((i) => (
          <CommentBox
            key={i.id}
            author={i.user_name}
            comment={i.content}
            commentId={i.id}
            canDelete={username === i.user_name || username === author}
            canEdit={username === i.user_name}
            refresh={refreshComment}
            isUser={username !== null}
            userId={userId}
          />
        ))}
      </ScrollToBottom>
      {username && (
        <form className={classes.comment}>
          <TextareaAutosize
            id="standard-basic"
            className={classes.input}
            rowsMin={1}
            rowsMax={3}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleEnter}
          />
          {isUpload ? (
            <Loading />
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleOnSubmit}
              component="span"
              className={classes.button}
            >
              <SendIcon />
            </Button>
          )}
        </form>
      )}
    </>
  );
}

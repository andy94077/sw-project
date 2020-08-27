import React, { useState } from "react";
import SendIcon from "@material-ui/icons/Send";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Divider, TextareaAutosize } from "@material-ui/core";
import ScrollToBottom from "react-scroll-to-bottom";
import Loading from "../components/Loading";
import ChatBox from "./ChatBox";

const useStyles = makeStyles(() => ({
  root: {
    height: "80vh",
    display: "flex",
  },
  room: {
    border: "5px solid #5ace5a",
    borderRadius: "10px",
    padding: "10px",
    height: "90%",
    width: "90%",
    display: "block",
    margin: "auto",
  },
  messages: {
    overflow: "auto",
    weight: "100%",
    height: "calc(100% - 60px)",
    flexGrow: "1",
    display: "flex",
  },
  input: {
    resize: "none",
    width: "100%",
    borderRadius: "5px",
    fontSize: "20px",
    alignItems: "center",
    padding: "3px 0.5em 0 0.5em",
    minHeight: "36px",
    lineHeight: "25px",
    "&:focus": {
      outline: 0,
    },
  },
  sendBox: {
    display: "flex",
    margin: "15px",
    alignItems: "flex-end",
  },
  button: {
    height: 36,
    borderRadius: 5,
    marginLeft: 5,
  },
}));

export default function Chatroom() {
  const classes = useStyles();
  const [value, setValue] = useState("");
  const [isUpload, setIsUpload] = useState(false);

  const handleSend = () => {
    setIsUpload(true);
    setTimeout(() => setIsUpload(false), 2000);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey && /^\s+$/.test(value) === false)
      handleSend();
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (/^\s+$/.test(value) === false) handleSend();
  };

  return (
    <div className={classes.root}>
      <div className={classes.room}>
        <ScrollToBottom className={classes.messages}>
          <ChatBox message="Test" />
          {/* {comments.map((i) => (
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
          ))} */}
        </ScrollToBottom>
        <Divider />
        <form className={classes.sendBox}>
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
      </div>
    </div>
  );
}

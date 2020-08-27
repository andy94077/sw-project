import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  Button,
  Divider,
  TextareaAutosize,
  Typography,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import ScrollToBottom from "react-scroll-to-bottom";
import { selectUser } from "../redux/userSlice";
import Loading from "../components/Loading";
import ChatBox from "./ChatBox";
import { CONCAT_SERVER_URL } from "../utils";

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
  avatar: {
    width: "35px",
    height: "35px",
    margin: "10px",
    padding: "1px",
    border: "2px solid #3f51b5",
    borderRadius: "25px",
  },
  messages: {
    overflow: "auto",
    weight: "100%",
    height: "calc(100% - 120px)",
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
  end: {
    textAlign: "center",
    minHeight: "10px",
  },
  endText: {
    color: "#666",
  },
}));

export default function Chatroom(props) {
  const classes = useStyles();
  const { chatInfo, onHide } = props;
  const { userId } = useSelector(selectUser);

  const [value, setValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [boxes, setBoxes] = useState([]);

  useEffect(() => {
    // Init room
    const jsonData = {
      user_id1: userId,
      user_id2: chatInfo.userId,
      start: 0,
      number: 20,
    };

    axios
      .request({
        method: "GET",
        url: CONCAT_SERVER_URL("/api/v1/chatbox"),
        params: jsonData,
      })
      .then((res) => setBoxes([res.data]));
  }, []);

  const handleSetValue = (event) => {
    setValue(event.target.value);
  };

  const handleRefresh = () => {};

  const handleSend = () => {
    setIsSending(true);
    axios
      .post(CONCAT_SERVER_URL("/api/v1/chatbox"), {
        user_id1: userId,
        user_id2: chatInfo.userId,
        last_message: value,
      })
      .then(() => {
        setValue("");
        handleRefresh();
      })
      .finally(() => setIsSending(false));
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
        <Typography variant="h5" gutterBottom>
          <Link to={`/profile/${chatInfo.username}`} onClick={onHide}>
            <img
              alt="Avatar"
              className={classes.avatar}
              src={CONCAT_SERVER_URL(chatInfo.avatar_url)}
            />
            {chatInfo.username}
          </Link>
        </Typography>

        <Divider />

        <ScrollToBottom className={classes.messages}>
          <div className={classes.end}>
            <Button disabled classes={{ label: classes.endText }}>
              No message left
            </Button>
          </div>
          {boxes.map((page) =>
            page.message.map((text) => (
              <ChatBox
                chatInfo={chatInfo}
                message={text.message}
                from={text.from}
              />
              // <CommentBox
              //   key={i.id}
              //   author={i.user_name}
              //   comment={i.content}
              //   commentId={i.id}
              //   canDelete={username === i.user_name || username === author}
              //   canEdit={username === i.user_name}
              //   refresh={refreshComment}
              //   isUser={username !== null}
              //   userId={userId}
              // />
            ))
          )}
        </ScrollToBottom>

        <Divider />

        <form className={classes.sendBox}>
          <TextareaAutosize
            id="standard-basic"
            className={classes.input}
            rowsMin={1}
            rowsMax={3}
            value={value}
            onChange={handleSetValue}
            onKeyDown={handleEnter}
          />
          {isSending ? (
            <div className={classes.button}>
              <Loading />
            </div>
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

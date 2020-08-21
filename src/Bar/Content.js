import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useInfiniteQuery } from "react-query";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

import { format, formatDistanceToNow } from "date-fns";
import Message from "./Message";
import useIntersectionObserver from "../components/useIntersectionObserver";
import Loading from "../components/Loading";
import { selectUser } from "../redux/userSlice";
import { CONCAT_SERVER_URL } from "../utils";
import { getCookie } from "../cookieHelper";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: "275px",
    maxWidth: "600px",
    maxHeight: "300px",
    overflow: "auto",
    border: "2px solid #ddd",
    borderRadius: "5px",
    zIndex: "2000",
    [theme.breakpoints.up("md")]: {
      minWidth: "400px",
    },
  },
  end: {
    background: "#eee",
    boxShadow:
      "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
    textAlign: "center",
  },
  endText: {
    color: "#666",
  },
}));

export default function Content(props) {
  const classes = useStyles();
  const { userId } = useSelector(selectUser);
  const { type, setChatCount, setNotesCount } = props;

  const chatMore = useRef();
  const notesMore = useRef();

  const [content, setContent] = useState({
    type: null,
    text: null,
    time: null,
  });

  // Infinite scroll
  // chat
  const {
    data: chat,
    fetchMore: fetchChat,
    canFetchMore: canFetchChat,
    refetch: refetchChat,
  } = useInfiniteQuery(
    "chat",
    async (_, start = 0) => {
      const jsonData = {
        user_id: userId,
        start,
        number: 10,
      };
      const res = await axios.request({
        method: "GET",
        url: CONCAT_SERVER_URL("/api/v1/chatroom"),
        params: jsonData,
      });
      res.data.message.forEach((item) => {
        item.header = {
          avatar_url: item.avatar_url,
          username: item.username,
        };
        item.secondary = formatDistanceToNow(new Date(item.updated_at));
        item.content = item.last_message;
        item.created_at = format(new Date(item.updated_at), "T", {
          timeZone: "Asia/Taipei",
        });
      });
      return res.data;
    },
    {
      getFetchMore: (lastGroup) => lastGroup.start,
    }
  );

  useIntersectionObserver({
    target: chatMore,
    onIntersect: fetchChat,
    enabled: canFetchChat,
  });

  // notes
  const {
    data: notes,
    fetchMore: fetchNotes,
    canFetchMore: canFetchNotes,
    refetch: refetchNotes,
  } = useInfiniteQuery(
    "notes",
    async (_, start = 0) => {
      const jsonData = {
        user_id: userId,
        start,
        number: 10,
      };
      const res = await axios.request({
        method: "GET",
        url: CONCAT_SERVER_URL("/api/v1/notifications"),
        params: jsonData,
      });
      res.data.message.forEach((item) => {
        item.secondary = formatDistanceToNow(new Date(item.created_at));
        item.created_at = format(new Date(item.created_at), "T", {
          timeZone: "Asia/Taipei",
        });
      });
      return res.data;
    },
    {
      getFetchMore: (lastGroup) => lastGroup.start,
    }
  );

  useIntersectionObserver({
    target: notesMore,
    onIntersect: fetchNotes,
    enabled: canFetchNotes,
  });

  // Update
  useEffect(() => {
    if (type === "chat") {
      refetchChat();
      setContent({
        type,
        text: chat,
        time: getCookie(`chatTime${userId}`), // not implemented yet.
      });
    } else if (type === "notes") {
      refetchNotes();
      setContent({
        type,
        text: notes,
        time: getCookie(`notesTime${userId}`),
      });
      // window.Echo.channel("Notifications").listen("NotificationChanged", null); // TODO
    }

    if (window.Echo === undefined) return () => {};

    return () => {
      if (type === "chat") {
        // TODO
      } else if (type === "notes") {
        // window.Echo.channel("Notifications").stopListening(
        //   "NotificationChanged"
        // );
      }
    };
  }, [type, chat, notes]);

  useEffect(() => {
    if (chat !== undefined) {
      const chatTime = getCookie(`chatTime${userId}`);
      const cc = chat[0].message.filter((ch) => ch.created_at > chatTime)
        .length;
      setChatCount(cc);
      if (cc > 9) {
        setChatCount("10+");
      }
    }
  }, [chat, setChatCount]);

  useEffect(() => {
    if (notes !== undefined) {
      const notesTime = getCookie(`notesTime${userId}`);
      const nc = notes[0].message.filter((note) => note.created_at > notesTime)
        .length;
      setNotesCount(nc);
      if (nc > 9) {
        setNotesCount("10+");
      }
    }
  }, [notes, setNotesCount]);

  // Wait for content updating
  if (content.type === type) {
    return (
      <div className={classes.root}>
        <Message type={content.type} text={content.text} time={content.time} />

        {content.type === "chat" && (
          <div ref={chatMore} className={classes.end}>
            {!canFetchChat && (
              <Button disabled classes={{ label: classes.endText }}>
                No chatroom left
              </Button>
            )}
          </div>
        )}

        {content.type === "notes" && (
          <div ref={notesMore} className={classes.end}>
            {!canFetchNotes && (
              <Button disabled classes={{ label: classes.endText }}>
                No notification left
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
  return <Loading />;
}

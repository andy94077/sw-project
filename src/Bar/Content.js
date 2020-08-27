import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useInfiniteQuery } from "react-query";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

import { format, formatDistanceToNow } from "date-fns";
import Message from "./Message";
import useIntersectionObserver from "../components/useIntersectionObserver";
import { CONCAT_SERVER_URL } from "../utils";
import { selectUser } from "../redux/userSlice";
import { selectMenuData } from "../redux/menuDataSlice";
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
  const { chats, notes } = useSelector(selectMenuData);
  const { type } = props;

  const chatsMore = useRef();
  const notesMore = useRef();

  const [content, setContent] = useState({
    type: null,
    allText: null,
    time: null,
  });

  // Infinite scroll
  // chats
  const {
    status: statusChats,
    data: newChats,
    fetchMore: fetchChats,
    canFetchMore: canFetchChats,
  } = useInfiniteQuery(
    "chats",
    async (_, start = 0) => {
      const jsonData = {
        user_id: userId,
        start: start + chats.length,
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
    target: chatsMore,
    onIntersect: fetchChats,
    enabled: canFetchChats,
  });

  // notes
  const {
    status: statusNotes,
    data: newNotes,
    fetchMore: fetchNotes,
    canFetchMore: canFetchNotes,
  } = useInfiniteQuery(
    "notes",
    async (_, start = 0) => {
      const jsonData = {
        user_id: userId,
        start: start + notes.length,
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
    if (statusChats !== "success" || statusNotes !== "success") return () => {};
    if (type === "chats") {
      setContent({
        type,
        allText: [[chats], newChats],
        time: getCookie(`chatsTime${userId}`),
      });
    } else if (type === "notes") {
      setContent({
        type,
        allText: [[notes], newNotes],
        time: getCookie(`notesTime${userId}`),
      });
      // window.Echo.channel("Notifications").listen("NotificationChanged", null); // TODO
    }

    if (window.Echo === undefined) return () => {};

    return () => {
      if (type === "chats") {
        // TODO
        // window.Echo.channel("Chatrooms").stopListening(
        //   "ChatroomChanged"
        // );
      } else if (type === "notes") {
        // window.Echo.channel("Notifications").stopListening(
        //   "NotificationChanged"
        // );
      }
    };
  }, [statusChats, statusNotes, type, newChats, newNotes, userId]);

  // Wait for content updating
  if (content.type === type) {
    return (
      <div className={classes.root}>
        <Message
          type={content.type}
          allText={content.allText}
          time={content.time}
        />

        {content.type === "chats" && (
          <div ref={chatsMore} className={classes.end}>
            {!canFetchChats && (
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
  return <div style={{ display: "none" }} />;
}

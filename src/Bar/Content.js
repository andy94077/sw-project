import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useInfiniteQuery } from "react-query";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { format, formatDistanceToNow } from "date-fns";
import CustomModal from "../components/CustomModal";
import useIntersectionObserver from "../components/useIntersectionObserver";
import Loading from "../components/Loading";
import { selectUser } from "../redux/userSlice";
import { CONCAT_SERVER_URL } from "../utils";
import { setCookie, getCookie } from "../cookieHelper";

const useStyles = makeStyles((theme) => ({
  rounded: {
    width: "32px",
    borderRadius: "16px",
    marginRight: "10px",
  },
  root: {
    minWidth: "275px",
    maxWidth: "600px",
    zIndex: "2000",
    [theme.breakpoints.up("md")]: {
      minWidth: "400px",
    },
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "44.44%",
    flexShrink: 0,
    fontWeight: 800,
    overflow: "hidden",
  },
  secondaryHeading: {
    paddingLeft: "50px",
    margin: "auto",
    fontSize: theme.typography.pxToRem(14),
    color: theme.palette.text.secondary,
    overflow: "hidden",
  },
  jumpFrame: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    margin: "auto",
    height: "100%",
    maxWidth: "800px",
    [`@media (max-width: 800px)`]: {
      maxWidth: "600px",
    },
  },
  none: {
    pointerEvents: "none",
  },
  end: {
    boxShadow:
      "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
    textAlign: "center",
  },
}));

export default function Content(props) {
  const classes = useStyles();
  const { userId } = useSelector(selectUser);
  const { type, setNotesCount, adMessage = null } = props;

  const chatMore = useRef();
  const notesMore = useRef();

  const [show, setShow] = useState(false);
  const [content, setContent] = useState({
    type: null,
    text: null,
    time: null,
  });

  // Infinite scroll
  // chat
  const {
    data: chat,
    // error,
    // isFetchingMore,
    fetchMore: fetchChat,
    canFetchMore: canFetchChat,
  } = useInfiniteQuery(
    "chat",
    (_, start = 0) => {
      const jsonData = {
        user_id: userId,
        start,
        number: 10,
      };
      return axios
        .request({
          method: "GET",
          url: CONCAT_SERVER_URL("/api/v1/chatroom"),
          params: jsonData,
        })
        .then((res) => {
          res.data.message.map((item) => {
            item.header = {
              avatar_url: item.avatar_url,
              username: item.username,
            };
            item.secondary = formatDistanceToNow(new Date(item.updated_at));
            item.content = item.last_message;
            item.created_at = format(new Date(item.updated_at), "T", {
              timeZone: "Asia/Taipei",
            });
            return item;
          });
          return res.data;
        });
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
    // error,
    // isFetchingMore,
    fetchMore: fetchNotes,
    canFetchMore: canFetchNotes,
  } = useInfiniteQuery(
    "notes",
    (_, start = 0) => {
      const jsonData = {
        user_id: userId,
        start,
        number: 10,
      };
      return axios
        .request({
          method: "GET",
          url: CONCAT_SERVER_URL("/api/v1/notifications"),
          params: jsonData,
        })
        .then((res) => {
          res.data.message.map((item) => {
            item.secondary = formatDistanceToNow(new Date(item.created_at));
            item.created_at = format(new Date(item.created_at), "T", {
              timeZone: "Asia/Taipei",
            });
            return item;
          });
          return res.data;
        });
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
    if (window.Echo === undefined) return () => {};

    if (type === "chat") {
      // TODO
    } else if (type === "notes") {
      window.Echo.channel("Notifications").listen("NotificationChanged", null); // TODO
    }

    return () => {
      if (type === "chat") {
        // TODO
      } else if (type === "notes") {
        window.Echo.channel("Notifications").stopListening(
          "NotificationChanged"
        );
      }
    };
  }, [type]);

  useEffect(() => {
    if (type === "chat") {
      setContent({
        type,
        text: chat,
        time: 9999999999999, // not implemented yet.
      });
    } else if (type === "notes") {
      setContent({
        type,
        text: notes,
        time: getCookie(`notesTime${userId}`),
      });
      setNotesCount(0);
      setCookie(`notesTime${userId}`, Date.now(), 60);
    } else if (type === "announcement") {
      setContent({
        type,
        text: adMessage,
        time: null,
      });
    }

    if (notes !== undefined) {
      const notesTime = getCookie(`notesTime${userId}`);
      const nc = notes[0].message.filter((note) => note.created_at > notesTime)
        .length;
      setNotesCount(nc);
      if (nc > 9) {
        setNotesCount("10+");
      }
    }
  }, [type, chat, notes, setNotesCount]);

  // Toggle function (for chat)
  const handleSetShow = () => {
    if (type === "chat") {
      setShow(true);
    }
  };

  const onHide = () => {
    setShow(false);
  };

  // Wait for content updating
  if (content.type === type) {
    return (
      <div className={classes.root}>
        {content.text.map((page) =>
          page.message.map((value) => {
            const background =
              content.time === null || content.time < value.created_at
                ? "#fff8e5"
                : "white";

            return (
              <div
                key={content.time + value.id}
                onClick={handleSetShow}
                onKeyDown={handleSetShow}
                tabIndex={0}
                role="button"
                style={{ outline: "none" }}
              >
                <Accordion
                  defaultExpanded={
                    background === "#fff8e5" || content.type === "chat"
                  }
                  className={content.type === "chat" ? classes.none : null}
                  style={{
                    margin: 0,
                    borderBottom: "1px solid #aaa",
                    background,
                  }}
                >
                  <AccordionSummary
                    expandIcon={content.type !== "chat" && <ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className={classes.heading}>
                      {content.type === "chat" && (
                        <div>
                          <img
                            alt="Avatar"
                            className={classes.rounded}
                            src={CONCAT_SERVER_URL(value.header.avatar_url)}
                          />
                          {value.header.username}
                        </div>
                      )}
                      {content.type !== "chat" && value.header}
                    </Typography>
                    <Typography className={classes.secondaryHeading}>
                      {value.secondary}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div dangerouslySetInnerHTML={{ __html: value.content }} />
                  </AccordionDetails>
                </Accordion>
              </div>
            );
          })
        )}
        {content.type === "chat" && (
          <div ref={chatMore} className={classes.end}>
            {!canFetchChat && <Button disabled>No chatroom left</Button>}
          </div>
        )}
        {content.type === "notes" && (
          <div ref={notesMore} className={classes.end}>
            {!canFetchNotes && <Button disabled>No notification left</Button>}
          </div>
        )}
        {content.type === "chat" && (
          <CustomModal
            show={show}
            onHide={onHide}
            jumpFrame={classes.jumpFrame}
            backdrop
          >
            <h4>Chatroom</h4>
          </CustomModal>
        )}
      </div>
    );
  }
  return <Loading />;
}

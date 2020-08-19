import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { fade, makeStyles } from "@material-ui/core/styles";
import { AppBar, InputBase, Toolbar, Typography } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

import { format } from "date-fns";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import { selectUser } from "../redux/userSlice";
import { CONCAT_SERVER_URL } from "../utils";
import { setCookie, getCookie } from "../cookieHelper";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  root: {
    zIndex: 1000,
  },
  title: {
    color: "white",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "18ch",
      "&:focus": {
        width: "36ch",
      },
    },
    [`@media screen and (min-width: 600px) and (max-width: 960px)`]: {
      width: "18ch",
      "&:focus": {
        width: "36ch",
      },
    },
  },
  offset: theme.mixins.toolbar,
}));

export default function Bar() {
  const { userId } = useSelector(selectUser);
  const [, page, tag] = window.location.pathname.split("/");

  // Classes & States
  const classes = useStyles();
  const history = useHistory();

  const [adMessage, setAdMessage] = useState("");
  const [isAdOpen, setIsAdOpen] = useState(false);

  const [contentText, setContentText] = useState([{ id: 1 }]);
  const [contentTime, setContentTime] = useState(null);
  const [contentType, setContentType] = useState("");
  const [mobileContentType, setMobileContentType] = useState("");

  const [notes, setNotes] = useState([]);
  const [notesCount, setNotesCount] = useState([]);

  const [searchValue, setSearchValue] = useState(page === "home" ? tag : "");

  // Broadcast & chat & notes
  useEffect(() => {
    if (window.Echo === undefined) return () => {};

    // Broadcast
    window.Echo.channel("Announcements").listen("Announced", (event) => {
      const { data } = event;
      setIsAdOpen(true);
      setAdMessage({
        id: 0,
        created_at: Date.now(),
        ...data,
      });
      setTimeout(() => {
        setIsAdOpen(false);
      }, 10000);
    });

    // notes
    const jsonData = {
      user_id: userId,
    };
    const pullNotes = () =>
      axios
        .request({
          method: "GET",
          url: CONCAT_SERVER_URL("/api/v1/notifications"),
          params: jsonData,
        })
        .then((res) =>
          setNotes(
            res.data.map((item) => {
              item.created_at = format(new Date(item.created_at), "T", {
                timeZone: "Asia/Taipei",
              });
              return item;
            })
          )
        )
        .catch(() =>
          setNotes([
            {
              id: 0,
              header: "ERROR",
              secondary: "SYSTEM",
              content: "Connection error",
            },
          ])
        );
    pullNotes();

    window.Echo.channel("Notifications").listen(
      "NotificationChanged",
      pullNotes
    );

    return () =>
      window.Echo.channel("Notifications")
        .stopListening("AdPosted")
        .stopListening("NotificationChanged");
  }, [userId]);

  useEffect(() => {
    if (contentType === "notes") {
      setContentText(notes);
    }
    const notesTime = getCookie(`notesTime${userId}`);
    const nc = notes.filter((note) => note.created_at > notesTime).length;
    setNotesCount(nc);
    if (nc > 9) {
      setNotesCount("10+");
    }
  }, [notes, userId]);

  // Static contents
  const chat = [
    {
      id: 1,
      header: "Chat 1",
      secondary: "from Andy Chen",
      content: "How are you?",
    },
    {
      id: 2,
      header: "Chat 2",
      secondary: "from Jason Hung",
      content: "How do you do?",
    },
  ];

  // Toggle functions
  const handleSetContent = (text) => {
    setContentType(text);
    setMobileContentType(text);

    // chat not implemented yet.
    if (text === "chat") {
      setContentText(chat);
      setContentTime(9999999999999);
    } else {
      setNotesCount(0);
      setContentText(notes);
      setContentTime(getCookie(`notesTime${userId}`));
      setCookie(`notesTime${userId}`, Date.now(), 60);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") history.push(`/home/${e.target.value}`);
  };

  const handleSetSearchValue = (event) => {
    setSearchValue(event.target.value);
  };

  // The bar
  return (
    <div className={classes.grow}>
      <AppBar className={classes.root} position="fixed">
        <Toolbar>
          <Link to="/home">
            <Typography className={classes.title} variant="h6" noWrap>
              SW
            </Typography>
          </Link>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              onKeyUp={handleSearch}
              onChange={handleSetSearchValue}
              value={searchValue}
            />
          </div>
          <div className={classes.grow} />
          <DesktopMenu
            adMessage={adMessage}
            contentTime={contentTime}
            contentText={contentText}
            contentType={contentType}
            handleSetContent={handleSetContent}
            isAdOpen={isAdOpen}
            notesCount={notesCount}
            setContentType={setContentType}
            setIsAdOpen={setIsAdOpen}
            setNotesCount={setNotesCount}
          />
          <MobileMenu
            adMessage={adMessage}
            contentTime={contentTime}
            contentText={contentText}
            handleSetContent={handleSetContent}
            isAdOpen={isAdOpen}
            mobileContentType={mobileContentType}
            notesCount={notesCount}
            setIsAdOpen={setIsAdOpen}
            setMobileContentType={setMobileContentType}
            setNotesCount={setNotesCount}
          />
        </Toolbar>
      </AppBar>
      <div className={classes.offset} />
    </div>
  );
}

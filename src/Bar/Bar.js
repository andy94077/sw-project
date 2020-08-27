import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

import { fade, makeStyles } from "@material-ui/core/styles";
import { AppBar, InputBase, Toolbar, Typography } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

import { format, formatDistanceToNow } from "date-fns";
import { getCookie } from "../cookieHelper";
import { CONCAT_SERVER_URL } from "../utils";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import { selectUser } from "../redux/userSlice";
import {
  setChats,
  setNotes,
  setChatsCount,
  setNotesCount,
  setAnnouncement,
  selectMenuData,
} from "../redux/menuDataSlice";

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
  const { chats, notes } = useSelector(selectMenuData);
  const [, page, tag] = window.location.pathname.split("/");

  // Classes & States
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const [searchValue, setSearchValue] = useState(page === "home" ? tag : "");

  // Broadcast
  useEffect(() => {
    if (window.Echo === undefined) return () => {};

    window.Echo.channel("Announcements").listen("Announced", (event) => {
      const { data } = event;
      dispatch(
        setAnnouncement({
          content: data,
          isOpen: true,
          type: "notes",
        })
      );
    });

    // Init menu
    const jsonData = {
      user_id: userId,
      start: 0,
      number: 10,
    };

    axios
      .request({
        method: "GET",
        url: CONCAT_SERVER_URL("/api/v1/chatroom"),
        params: jsonData,
      })
      .then((res) => {
        const newMessage = res.data.message.map((item) => {
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
        res.data.message = newMessage;
        dispatch(setChats({ chats: res.data }));
      });

    axios
      .request({
        method: "GET",
        url: CONCAT_SERVER_URL("/api/v1/notifications"),
        params: jsonData,
      })
      .then((res) => {
        const newMessage = res.data.message.map((item) => {
          item.secondary = formatDistanceToNow(new Date(item.created_at));
          item.created_at = format(new Date(item.created_at), "T", {
            timeZone: "Asia/Taipei",
          });
          return item;
        });
        res.data.message = newMessage;
        dispatch(setNotes({ notes: res.data }));
      });

    return () =>
      window.Echo.channel("Announcements").stopListening("Announced");
  }, [userId]);

  useEffect(() => {
    if (chats.length === 0) return;
    const chatsTime = getCookie(`chatsTime${userId}`);
    const cc = chats.message.filter(
      (chat) => chat.created_at > chatsTime || chatsTime === undefined
    ).length;
    dispatch(setChatsCount({ chatsCount: cc }));
    if (cc > 9) {
      dispatch(setChatsCount({ chatsCount: "10+" }));
    }
  }, [chats, userId]);

  useEffect(() => {
    if (notes.length === 0) return;
    const notesTime = getCookie(`notesTime${userId}`);
    const nc = notes.message.filter(
      (note) => note.created_at > notesTime || notesTime === undefined
    ).length;
    dispatch(setNotesCount({ notesCount: nc }));
    if (nc > 9) {
      dispatch(setNotesCount({ notesCount: "10+" }));
    }
  }, [notes, userId]);

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
          <DesktopMenu />
          <MobileMenu />
        </Toolbar>
      </AppBar>
      <div className={classes.offset} />
    </div>
  );
}

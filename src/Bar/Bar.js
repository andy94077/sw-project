import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { fade, makeStyles } from "@material-ui/core/styles";
import { AppBar, InputBase, Toolbar, Typography } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

import { format } from "date-fns";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import { selectUser, setAvatar } from "../redux/userSlice";
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
  const { username, userId } = useSelector(selectUser);
  const [, page, tag] = window.location.pathname.split("/");

  // Classes & States
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const stableDispatch = useCallback(dispatch, []);

  const [contentAnchorEl, setContentAnchorEl] = useState(null);
  const [contentText, setContentText] = useState([{ id: 1 }]);
  const [contentCheck, setContentCheck] = useState(null);

  const [notes, setNotes] = useState([]);
  const [notesCount, setNotesCount] = useState([]);

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [mobileContentType, setMobileContentType] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [searchValue, setSearchValue] = useState(page === "home" ? tag : "");

  const [isAdOpen, setIsAdOpen] = useState(false);
  const [adMessage, setAdMessage] = useState("");

  const isContentOpen = Boolean(contentAnchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    if (username !== null) {
      axios
        .request({
          method: "POST",
          url: CONCAT_SERVER_URL("/api/v1/user/getUserAvatar"),
          data: { name: username },
        })
        .then((response) => {
          stableDispatch(
            setAvatar({
              userAvatar: CONCAT_SERVER_URL(`${response.data}`),
            })
          );
        });
    }
  }, [username, stableDispatch]);

  // Broadcast
  useEffect(() => {
    if (window.Echo === undefined) return () => {};

    window.Echo.channel("Notifications").listen("AdPosted", (event) => {
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
    setContentText(notes);
    const notesCheck = getCookie(`notesCheck${userId}`);
    const nc = notes.filter((note) => note.created_at > notesCheck).length;
    setNotesCount(nc);
    if (nc > 9) {
      setNotesCount("10+");
    }
  }, [notes, userId]);

  // Static contents
  const mails = [
    {
      id: 1,
      header: "Mail 1",
      secondary: "from Andy Chen",
      content: "How are you?",
    },
    {
      id: 2,
      header: "Mail 2",
      secondary: "from Jason Hung",
      content: "How do you do?",
    },
  ];

  // Toggle functions
  const handleMobileMenuClose = () => {
    setMobileContentType("");
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleSetContent = (text) => {
    // mails not implemented yet.
    if (text === "mails") {
      setContentText(mails);
      setContentCheck(9999999999999);
    } else {
      setNotesCount(0);
      setContentText(notes);
      setContentCheck(getCookie(`notesCheck${userId}`));
      setCookie(`notesCheck${userId}`, Date.now(), 60);
    }
  };

  const handleContentClose = () => {
    setContentAnchorEl(null);
  };

  const handleContentOpen = (text) => (event) => {
    // Close itself:
    if (contentAnchorEl === event.currentTarget) {
      if (text === "notes") setNotesCount(0);
      handleContentClose();
    } else {
      handleSetContent(text);
      setContentAnchorEl(event.currentTarget);
    }
  };

  const handleMobileContentClose = () => {
    setMobileContentType("");
  };

  const handleMobileContentOpen = (text) => () => {
    // Close itself:
    if (text === mobileContentType) handleMobileContentClose();
    else {
      setMobileContentType(text);
      handleSetContent(text);
    }
  };

  function handleAdClose() {
    setIsAdOpen(false);
  }

  const handleSearch = (e) => {
    if (e.key === "Enter") history.push(`/home/${e.target.value}`);
  };

  const handleSetSearchValue = (event) => {
    setSearchValue(event.target.value);
  };

  const toggleDrawer = (isOpen) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerOpen(isOpen);
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
            contentAnchorEl={contentAnchorEl}
            contentCheck={contentCheck}
            contentText={contentText}
            drawerOpen={drawerOpen}
            handleAdClose={handleAdClose}
            handleContentClose={handleContentClose}
            handleContentOpen={handleContentOpen}
            isAdOpen={isAdOpen}
            isContentOpen={isContentOpen}
            notesCount={notesCount}
            toggleDrawer={toggleDrawer}
          />
          <MobileMenu
            adMessage={adMessage}
            contentCheck={contentCheck}
            contentText={contentText}
            drawerOpen={drawerOpen}
            handleAdClose={handleAdClose}
            handleMobileContentOpen={handleMobileContentOpen}
            handleMobileMenuClose={handleMobileMenuClose}
            handleMobileMenuOpen={handleMobileMenuOpen}
            isAdOpen={isAdOpen}
            isMobileMenuOpen={isMobileMenuOpen}
            mobileContentType={mobileContentType}
            mobileMoreAnchorEl={mobileMoreAnchorEl}
            notesCount={notesCount}
            toggleDrawer={toggleDrawer}
          />
        </Toolbar>
      </AppBar>
      <div className={classes.offset} />
    </div>
  );
}

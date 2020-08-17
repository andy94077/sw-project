import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { fade, makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Badge,
  ClickAwayListener,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Popper,
  Toolbar,
  Typography,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import MoreIcon from "@material-ui/icons/MoreVert";
import NotificationsIcon from "@material-ui/icons/Notifications";
import SearchIcon from "@material-ui/icons/Search";

import { format } from "date-fns";
import Content from "./Content";
import RightDrawer from "./RightDrawer";
import AnnouncementGrid from "../components/AnnouncementGrid";
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
  rounded: {
    width: "32px",
    borderRadius: "16px",
  },
  menuButton: {
    marginRight: theme.spacing(2),
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
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
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
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const [contentAnchorEl, setContentAnchorEl] = useState(null);
  const [contentText, setContentText] = useState([{ id: 1 }]);
  const [notes, setNotes] = useState([]);
  const [noteCount, setNoteCount] = useState([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(page === "home" ? tag : "");
  const [isAdOpen, setIsAdOpen] = useState(false);
  const [adMessage, setAdMessage] = useState("");

  const [avatar, setAvatar] = useState(null);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isContentOpen = Boolean(contentAnchorEl);

  useEffect(() => {
    if (username !== null) {
      axios
        .request({
          method: "POST",
          url: CONCAT_SERVER_URL("/api/v1/user/getUserAvatar"),
          data: { name: username },
        })
        .then((response) => {
          setAvatar(CONCAT_SERVER_URL(`${response.data}`));
        });
    }
  }, []);

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
  }, []);

  useEffect(() => {
    setContentText(notes);
    const noteCheck = getCookie("noteCheck");
    const nc = notes.filter((note) => note.created_at > noteCheck).length;
    setNoteCount(nc);
    if (nc > 9) {
      setNoteCount("10+");
    }
  }, [notes]);

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
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleContentClose = () => {
    setContentAnchorEl(null);
    setCookie("noteCheck", Date.now(), 60);
  };

  const handleContentOpen = (text) => (event) => {
    if (contentAnchorEl === event.currentTarget) {
      handleContentClose();
    } else {
      setContentText(text);
      setContentAnchorEl(event.currentTarget);
      if (text === notes) setNoteCount(0);
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

  // Toggled components
  const renderContent = (
    <Popper
      anchorEl={contentAnchorEl}
      keepMounted
      open={isContentOpen}
      onClose={handleContentClose}
    >
      <Content text={contentText} />
    </Popper>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleContentOpen(mails)}>
        <IconButton color="inherit" component="span">
          <Badge badgeContent={0} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Mails</p>
      </MenuItem>
      <MenuItem onClick={handleContentOpen(notes)}>
        <IconButton color="inherit" component="span">
          <Badge badgeContent={noteCount} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={toggleDrawer(true)}>
        <IconButton color="inherit" component="span">
          <img alt="Avatar" className={classes.rounded} src={avatar} />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const renderAnnouncementGrid = (
    <AnnouncementGrid
      isAdOpen={isAdOpen}
      handleAdClose={handleAdClose}
      adMessage={adMessage}
    />
  );

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
          <div className={classes.sectionDesktop}>
            <ClickAwayListener onClickAway={handleContentClose}>
              <div style={{ display: "flex" }}>
                {username === null ? null : (
                  <IconButton
                    onClick={handleContentOpen(mails)}
                    color="inherit"
                    component="span"
                  >
                    <Badge badgeContent={0} color="secondary">
                      <MailIcon />
                    </Badge>
                  </IconButton>
                )}
                {username === null ? null : (
                  <IconButton
                    onClick={handleContentOpen(notes)}
                    color="inherit"
                    component="span"
                  >
                    <Badge badgeContent={noteCount} color="secondary">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                )}
                {renderContent}
                {renderAnnouncementGrid}
              </div>
            </ClickAwayListener>
            <RightDrawer
              open={drawerOpen}
              toggleDrawer={toggleDrawer}
              button={
                <IconButton
                  edge="end"
                  onClick={toggleDrawer(true)}
                  color="inherit"
                  component="span"
                >
                  {username === null ? (
                    <AccountCircleIcon />
                  ) : (
                    <img
                      alt="Avatar"
                      className={classes.rounded}
                      src={avatar}
                    />
                  )}
                </IconButton>
              }
              avatar={avatar}
            />
          </div>
          <div className={classes.sectionMobile}>
            {username == null ? (
              <RightDrawer
                open={drawerOpen}
                toggleDrawer={toggleDrawer}
                button={
                  <IconButton
                    edge="end"
                    onClick={toggleDrawer(true)}
                    color="inherit"
                    component="span"
                  >
                    <AccountCircleIcon />
                  </IconButton>
                }
                avatar={avatar}
              />
            ) : (
              <IconButton
                onClick={handleMobileMenuOpen}
                color="inherit"
                component="span"
              >
                <MoreIcon />
              </IconButton>
            )}
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      <div className={classes.offset} />
    </div>
  );
}

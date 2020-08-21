import React, { useState } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Badge,
  ClickAwayListener,
  IconButton,
  Popper,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ChatIcon from "@material-ui/icons/Chat";
import NotificationsIcon from "@material-ui/icons/Notifications";

import { CONCAT_SERVER_URL } from "../utils";
import AnnouncementGrid from "./AnnouncementGrid";
import Content from "./Content";
import RightDrawer from "./RightDrawer";

import { selectUser } from "../redux/userSlice";
import { setCookie } from "../cookieHelper";

const useStyles = makeStyles((theme) => ({
  rounded: {
    width: "32px",
    borderRadius: "16px",
  },
  iconLight: {
    color: "#fff8e5",
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
}));

export default function DesktopMenu(props) {
  const classes = useStyles();
  const { username, userId, userAvatar } = useSelector(selectUser);
  const {
    anContent,
    anType,
    chatCount,
    isAnOpen,
    notesCount,
    setChatCount,
    setIsAnOpen,
    setNotesCount,
  } = props;

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [content, setContent] = useState({
    anchorEl: null,
    open: false,
    type: "",
  });

  // Toggle function
  const handleContentClickAway = () => {
    setContent({
      anchorEl: null,
      open: false,
      type: "",
    });
  };

  const handleContentClose = (type) => {
    if (type === "chat") {
      setChatCount(0);
      setCookie(`chatTime${userId}`, Date.now(), 60);
    }
    if (type === "notes") {
      setNotesCount(0);
      setCookie(`notesTime${userId}`, Date.now(), 60);
    }
  };

  const handleContentOpen = (type) => (event) => {
    if (content.anchorEl === event.currentTarget) {
      // Close itself:
      handleContentClose(type);
      handleContentClickAway();
    } else {
      if (content.anchorEl !== null) {
        // Switch from another:
        handleContentClose(type === "chat" ? "notes" : "chat");
      }
      setContent({
        anchorEl: event.currentTarget,
        open: true,
        type,
      });
      if (type === "chat") {
        setChatCount(0);
      }
      if (type === "notes") {
        setNotesCount(0);
      }
    }
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

  if (username === null) {
    return (
      <div className={classes.sectionDesktop}>
        <IconButton
          edge="end"
          onClick={toggleDrawer(true)}
          color="inherit"
          component="span"
        >
          <AccountCircleIcon />
        </IconButton>
        {/* Drawer */}
        <RightDrawer open={drawerOpen} toggleDrawer={toggleDrawer} />
      </div>
    );
  }
  return (
    // Three buttons
    <div className={classes.sectionDesktop}>
      <ClickAwayListener onClickAway={handleContentClickAway}>
        <div style={{ display: "flex" }}>
          <IconButton onClick={handleContentOpen("chat")} component="span">
            <Badge badgeContent={chatCount} color="secondary">
              <ChatIcon
                style={{
                  color: content.type === "chat" ? "#5ace5a" : "white",
                }}
              />
            </Badge>
          </IconButton>

          <IconButton onClick={handleContentOpen("notes")} component="span">
            <Badge badgeContent={notesCount} color="secondary">
              <NotificationsIcon
                style={{
                  color: content.type === "notes" ? "ffde4c" : "white",
                }}
              />
            </Badge>
          </IconButton>
          <Popper
            anchorEl={content.anchorEl}
            className={classes.sectionDesktop}
            keepMounted
            open={content.open}
          >
            <Content
              type={content.type}
              setChatCount={setChatCount}
              setNotesCount={setNotesCount}
            />
          </Popper>
          <AnnouncementGrid
            content={anContent}
            type={anType}
            isAnOpen={isAnOpen}
            setIsAnOpen={setIsAnOpen}
          />
        </div>
      </ClickAwayListener>
      <IconButton
        edge="end"
        onClick={toggleDrawer(true)}
        color="inherit"
        component="span"
      >
        <img
          alt="Avatar"
          className={classes.rounded}
          src={CONCAT_SERVER_URL(userAvatar)}
        />
      </IconButton>
      <RightDrawer open={drawerOpen} toggleDrawer={toggleDrawer} />
    </div>
  );
}

import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import {
  Badge,
  ClickAwayListener,
  IconButton,
  Popper,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ChatIcon from "@material-ui/icons/Chat";
import NotificationsIcon from "@material-ui/icons/Notifications";

import Content from "./Content";
import RightDrawer from "./RightDrawer";
import AnnouncementGrid from "./AnnouncementGrid";

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
    adMessage,
    contentTime,
    contentText,
    contentType,
    handleSetContent,
    isAdOpen,
    setIsAdOpen,
    notesCount,
    setContentType,
    setNotesCount,
  } = props;

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [contentAnchorEl, setContentAnchorEl] = useState(null);
  const isContentOpen = Boolean(contentAnchorEl);

  // Toggle function
  function handleAdClose() {
    setIsAdOpen(false);
  }

  const handleContentClickAway = () => {
    setContentType("");
    setContentAnchorEl(null);
  };

  const handleContentClose = (text) => {
    if (text === "notes") {
      setNotesCount(0);
      setCookie(`notesTime${userId}`, Date.now(), 60);
    }
  };

  const handleContentOpen = (text) => (event) => {
    if (contentAnchorEl === event.currentTarget) {
      // Close itself:
      handleContentClose(text);
      handleContentClickAway();
    } else {
      if (contentAnchorEl !== null) {
        // Switch from another:
        handleContentClose(text === "chat" ? "notes" : "chat");
      }
      handleSetContent(text);
      setContentAnchorEl(event.currentTarget);
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

  return (
    // Three buttons
    <div className={classes.sectionDesktop}>
      <ClickAwayListener onClickAway={handleContentClickAway}>
        <div style={{ display: "flex" }}>
          {username === null ? null : (
            <IconButton onClick={handleContentOpen("chat")} component="span">
              <Badge badgeContent={0} color="secondary">
                <ChatIcon
                  style={{
                    color: contentType === "chat" ? "#5ace5a" : "white",
                  }}
                />
              </Badge>
            </IconButton>
          )}
          {username === null ? null : (
            <IconButton
              onClick={handleContentOpen("notes")}
              color="inherit"
              component="span"
            >
              <Badge badgeContent={notesCount} color="secondary">
                <NotificationsIcon
                  style={{
                    color: contentType === "notes" ? "ffde4c" : "white",
                  }}
                />
              </Badge>
            </IconButton>
          )}
          {/* Notification content */}
          <Popper
            anchorEl={contentAnchorEl}
            className={classes.sectionDesktop}
            keepMounted
            open={isContentOpen}
          >
            <Content text={contentText} time={contentTime} />
          </Popper>
          {/* New notification */}
          <AnnouncementGrid
            isAdOpen={isAdOpen}
            handleAdClose={handleAdClose}
            adMessage={adMessage}
          />
        </div>
      </ClickAwayListener>
      <IconButton
        edge="end"
        onClick={toggleDrawer(true)}
        color="inherit"
        component="span"
      >
        {username === null ? (
          <AccountCircleIcon />
        ) : (
          <img alt="Avatar" className={classes.rounded} src={userAvatar} />
        )}
      </IconButton>
      {/* Drawer */}
      <RightDrawer
        open={drawerOpen}
        toggleDrawer={toggleDrawer}
        avatar={userAvatar}
      />
    </div>
  );
}

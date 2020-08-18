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
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";

import Content from "./Content";
import RightDrawer from "./RightDrawer";
import AnnouncementGrid from "../components/AnnouncementGrid";

import { selectUser } from "../redux/userSlice";
import { setCookie } from "../cookieHelper";

const useStyles = makeStyles((theme) => ({
  rounded: {
    width: "32px",
    borderRadius: "16px",
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
    handleSetContent,
    isAdOpen,
    setIsAdOpen,
    notesCount,
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
    setContentAnchorEl(null);
  };

  const handleContentClose = (text) => {
    if (text === "notes") {
      setNotesCount(0);
      setCookie(`notesTime${userId}`, Date.now(), 60);
    }
  };

  const handleContentOpen = (text) => (event) => {
    // Close itself:
    if (contentAnchorEl === event.currentTarget) {
      handleContentClose(text);
      handleContentClickAway();
    } else {
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
            <IconButton
              onClick={handleContentOpen("mails")}
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
              onClick={handleContentOpen("notes")}
              color="inherit"
              component="span"
            >
              <Badge badgeContent={notesCount} color="secondary">
                <NotificationsIcon />
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

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Badge, ClickAwayListener, IconButton } from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ChatIcon from "@material-ui/icons/Chat";
import NotificationsIcon from "@material-ui/icons/Notifications";

import { CONCAT_SERVER_URL } from "../utils";
import AnnouncementGrid from "./AnnouncementGrid";
import Content from "./Content";
import MyPopper from "./MyPopper";
import RightDrawer from "./RightDrawer";

import { selectUser } from "../redux/userSlice";
import {
  selectMenuData,
  setChatsCount,
  setNotesCount,
} from "../redux/menuDataSlice";
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

export default function DesktopMenu() {
  const classes = useStyles();
  const { username, userId, userAvatar } = useSelector(selectUser);
  const { chatsCount, notesCount } = useSelector(selectMenuData);
  const dispatch = useDispatch();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [content, setContent] = useState({
    anchorEl: null,
    open: false,
    type: "",
  });

  // Toggle function
  const handleContentClickAway = () => {
    setContent({
      open: false,
      type: "",
    });
  };

  const handleContentClose = (type) => {
    handleContentClickAway();
    if (type === "chats") {
      dispatch(setChatsCount({ chatsCount: 0 }));
      setCookie(`chatsTime${userId}`, Date.now(), 60);
    }
    if (type === "notes") {
      dispatch(setNotesCount({ notesCount: 0 }));
      setCookie(`notesTime${userId}`, Date.now(), 60);
    }
  };

  const handleContentOpen = (type) => () => {
    if (content.type === type) {
      // Close itself:
      handleContentClose(type);
    } else {
      if (content.type !== "") {
        // Switch from another:
        handleContentClose(type === "chats" ? "notes" : "chats");
      }
      setContent({
        open: true,
        type,
      });
      if (type === "chats") {
        dispatch(setChatsCount({ chatsCount: 0 }));
      }
      if (type === "notes") {
        dispatch(setNotesCount({ notesCount: 0 }));
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
          <IconButton onClick={handleContentOpen("chats")} component="span">
            <Badge badgeContent={chatsCount} color="secondary">
              <ChatIcon
                style={{
                  color: content.type === "chats" ? "#5ace5a" : "white",
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
          {content.open && (
            <MyPopper className={classes.sectionDesktop}>
              <Content type={content.type} />
            </MyPopper>
          )}
          <AnnouncementGrid />
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

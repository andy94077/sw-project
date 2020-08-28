import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Badge,
  ClickAwayListener,
  IconButton,
  MenuItem,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ChatIcon from "@material-ui/icons/Chat";
import MoreIcon from "@material-ui/icons/MoreVert";
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
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

export default function MobileMenu() {
  const classes = useStyles();
  const { username, userId, userAvatar } = useSelector(selectUser);
  const { chatsCount, notesCount } = useSelector(selectMenuData);
  const dispatch = useDispatch();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [mobileContentType, setMobileContentType] = useState("");

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // Toggle functions
  const handleSetCookie = (type) => {
    if (type === "chats") {
      setCookie(`chatsTime${userId}`, Date.now(), 60);
    }
    if (type === "notes") {
      setCookie(`notesTime${userId}`, Date.now(), 60);
    }
  };

  const handleMobileContentClose = () => {
    setMobileContentType("");
  };

  const handleMobileContentOpen = (type) => () => {
    // Close itself:
    if (type === mobileContentType) {
      handleSetCookie(type);
      handleMobileContentClose();
    } else {
      if (mobileContentType !== "") {
        // Switch from another:
        handleSetCookie(type === "chats" ? "notes" : "chats");
      }
      setMobileContentType(type);
      if (type === "chats") {
        dispatch(setChatsCount({ chatsCount: 0 }));
      }
      if (type === "notes") {
        dispatch(setNotesCount({ notesCount: 0 }));
      }
    }
  };

  const handleMobileMenuClose = () => {
    handleMobileContentClose(mobileContentType);
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    if (mobileMoreAnchorEl === event.currentTarget) handleMobileMenuClose();
    else setMobileMoreAnchorEl(event.currentTarget);
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
      <div className={classes.sectionMobile}>
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
    <ClickAwayListener onClickAway={handleMobileMenuClose}>
      <div className={classes.sectionMobile}>
        <IconButton
          onClick={handleMobileMenuOpen}
          color="inherit"
          component="span"
        >
          <Badge
            badgeContent={
              chatsCount === "10+" || notesCount === "10+"
                ? "10+"
                : chatsCount + notesCount
            }
            color="secondary"
          >
            <MoreIcon />
          </Badge>
        </IconButton>

        {isMobileMenuOpen && (
          <MyPopper className={classes.sectionMobile}>
            <MenuItem
              onClick={handleMobileContentOpen("chats")}
              style={{ width: "325px" }}
            >
              <IconButton color="inherit" component="span">
                <Badge badgeContent={chatsCount} color="secondary">
                  <ChatIcon
                    style={{
                      color:
                        mobileContentType === "chats" ? "#5ace5a" : "black",
                    }}
                  />
                </Badge>
              </IconButton>
              <p>Messages</p>
            </MenuItem>
            {mobileContentType === "chats" && (
              <MenuItem>
                <Content type={mobileContentType} />
              </MenuItem>
            )}
            <MenuItem
              onClick={handleMobileContentOpen("notes")}
              style={{ width: "325px" }}
            >
              <IconButton color="inherit" component="span">
                <Badge badgeContent={notesCount} color="secondary">
                  <NotificationsIcon
                    style={{
                      color: mobileContentType === "notes" ? "ffde4c" : "black",
                    }}
                  />
                </Badge>
              </IconButton>
              <p>Notifications</p>
            </MenuItem>
            {mobileContentType === "notes" && (
              <MenuItem>
                <Content type={mobileContentType} />
              </MenuItem>
            )}
            <MenuItem onClick={toggleDrawer(true)}>
              <IconButton color="inherit" component="span">
                <img
                  alt="Avatar"
                  className={classes.rounded}
                  src={CONCAT_SERVER_URL(userAvatar)}
                />
              </IconButton>
              <p>Profile</p>
            </MenuItem>
            <RightDrawer open={drawerOpen} toggleDrawer={toggleDrawer} />
          </MyPopper>
        )}
        <AnnouncementGrid />
      </div>
    </ClickAwayListener>
  );
}

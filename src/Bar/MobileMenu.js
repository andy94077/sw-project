import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { Badge, IconButton, Menu, MenuItem } from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ChatIcon from "@material-ui/icons/Chat";
import MoreIcon from "@material-ui/icons/MoreVert";
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
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

export default function MobileMenu(props) {
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

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [mobileContentType, setMobileContentType] = useState("");

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // Toggle functions
  const handleMobileContentClose = (text) => {
    if (text === "chat") {
      setChatCount(0);
      setCookie(`chatTime${userId}`, Date.now(), 60);
    }
    if (text === "notes") {
      setNotesCount(0);
      setCookie(`notesTime${userId}`, Date.now(), 60);
    }
    setMobileContentType("");
  };

  const handleMobileContentOpen = (text) => () => {
    // Close itself:
    if (text === mobileContentType) {
      handleMobileContentClose(text);
    } else {
      setMobileContentType(text);
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
    <div className={classes.sectionMobile}>
      <IconButton
        onClick={handleMobileMenuOpen}
        color="inherit"
        component="span"
      >
        <Badge
          badgeContent={
            chatCount === "10+" || notesCount === "10+"
              ? "10+"
              : chatCount + notesCount
          }
          color="secondary"
        >
          <MoreIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        className={classes.sectionMobile}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        style={{ zIndex: 500, top: "40px" }}
      >
        <MenuItem
          onClick={handleMobileContentOpen("chat")}
          style={{ width: "325px" }}
        >
          <IconButton color="inherit" component="span">
            <Badge badgeContent={chatCount} color="secondary">
              <ChatIcon
                style={{
                  color: mobileContentType === "chat" ? "#5ace5a" : "black",
                }}
              />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem>
        {mobileContentType === "chat" && (
          <MenuItem>
            <Content
              type={mobileContentType}
              setChatCount={setChatCount}
              setNotesCount={setNotesCount}
            />
          </MenuItem>
        )}
        <MenuItem onClick={handleMobileContentOpen("notes")}>
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
            <Content
              type={mobileContentType}
              setChatCount={setChatCount}
              setNotesCount={setNotesCount}
            />
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
      </Menu>
      <AnnouncementGrid
        content={anContent}
        type={anType}
        isAnOpen={isAnOpen}
        setIsAnOpen={setIsAnOpen}
      />
    </div>
  );
}

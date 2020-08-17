import React from "react";
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
  const { username, userAvatar } = useSelector(selectUser);
  const {
    adMessage,
    contentAnchorEl,
    contentCheck,
    contentText,
    drawerOpen,
    handleAdClose,
    handleContentClose,
    handleContentOpen,
    isAdOpen,
    isContentOpen,
    notesCount,
    toggleDrawer,
  } = props;

  // Toggled components
  const renderContent = (
    <Popper
      anchorEl={contentAnchorEl}
      className={classes.sectionDesktop}
      keepMounted
      open={isContentOpen}
    >
      <Content text={contentText} check={contentCheck} />
    </Popper>
  );

  const renderAnnouncementGrid = (
    <AnnouncementGrid
      isAdOpen={isAdOpen}
      handleAdClose={handleAdClose}
      adMessage={adMessage}
    />
  );

  return (
    <div className={classes.sectionDesktop}>
      <ClickAwayListener onClickAway={handleContentClose}>
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
              <img alt="Avatar" className={classes.rounded} src={userAvatar} />
            )}
          </IconButton>
        }
        avatar={userAvatar}
      />
    </div>
  );
}

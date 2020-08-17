import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { Badge, IconButton, Menu, MenuItem } from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import MoreIcon from "@material-ui/icons/MoreVert";
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
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

export default function MobileMenu(props) {
  const classes = useStyles();
  const { username, userAvatar } = useSelector(selectUser);
  const {
    adMessage,
    contentCheck,
    contentText,
    drawerOpen,
    handleAdClose,
    handleMobileContentOpen,
    handleMobileMenuClose,
    handleMobileMenuOpen,
    isAdOpen,
    isMobileMenuOpen,
    mobileContentType,
    mobileMoreAnchorEl,
    notesCount,
    toggleDrawer,
  } = props;

  // Toggled components
  const renderAnnouncementGrid = (
    <AnnouncementGrid
      isAdOpen={isAdOpen}
      handleAdClose={handleAdClose}
      adMessage={adMessage}
    />
  );

  const renderMobileContent = (
    <Content text={contentText} check={contentCheck} />
  );

  const renderMobileMenu = (
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
    >
      <MenuItem
        onClick={handleMobileContentOpen("mails")}
        style={{ width: "320px" }}
      >
        <IconButton color="inherit" component="span">
          <Badge badgeContent={0} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Mails</p>
      </MenuItem>
      {mobileContentType === "mails" && (
        <MenuItem>{renderMobileContent}</MenuItem>
      )}
      <MenuItem onClick={handleMobileContentOpen("notes")}>
        <IconButton color="inherit" component="span">
          <Badge badgeContent={notesCount} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      {mobileContentType === "notes" && (
        <MenuItem>{renderMobileContent}</MenuItem>
      )}
      <MenuItem onClick={toggleDrawer(true)}>
        <IconButton color="inherit" component="span">
          <img alt="Avatar" className={classes.rounded} src={userAvatar} />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
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
          avatar={userAvatar}
        />
      ) : (
        <IconButton
          onClick={handleMobileMenuOpen}
          color="inherit"
          component="span"
        >
          <Badge badgeContent={notesCount} color="secondary">
            <MoreIcon />
          </Badge>
        </IconButton>
      )}
      {renderMobileMenu}
      {renderAnnouncementGrid}
    </div>
  );
}

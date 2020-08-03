import React, { useState } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SearchIcon from "@material-ui/icons/Search";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import { Link, useHistory } from "react-router-dom";

import { Popover } from "@material-ui/core";
import Content from "./Content";
import RightDrawer from "./RightDrawer";

const useStyles = makeStyles((theme) => ({
  rounded: {
    width: "32px",
    borderRadius: "16px",
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  // For popover
  paper: {
    minWidth: "400px",
    maxWidth: "600px",
  },
  title: {
    color: "white",
    display: "none",
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

export default function Bar(props) {
  const { username } = props;
  const [, page, tag] = window.location.pathname.split("/");

  // Classes & States
  const classes = useStyles();
  const history = useHistory();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [content, setContent] = useState(false);
  const [text, setText] = useState([{ id: 1 }]);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(page === "home" ? tag : "");

  const avatar = "/pictures/avatar.jpeg";

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isContentOpen = Boolean(content);

  const mailId = "primary-search-mail-menu";
  const noteId = "primary-search-notification-menu";
  const menuId = "primary-search-account-menu";
  const mobileMenuId = "primary-search-account-menu-mobile";

  // Static contents
  const mails = [
    {
      id: 1,
      subject: "Mail 1",
      sender: "from Andy Chen",
      content: "How are you?",
    },
    {
      id: 2,
      subject: "Mail 2",
      sender: "from Jason Hung",
      content: "How do you do?",
    },
  ];
  const notes = [
    { id: 1, subject: "Hint 1", sender: "", content: "Hey!" },
    { id: 2, subject: "Hint 2", sender: "", content: "Hey you!" },
    { id: 3, subject: "Hint 3", sender: "", content: "Yes you!" },
  ];

  // Toggle functions
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleContentClose = () => {
    setContent(null);
  };

  const handleContentOpen = (texts) => (event) => {
    setText(texts);
    setContent(event.currentTarget);
  };

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

    setOpen(isOpen);
  };

  // Toggled components
  const renderContent = (
    <Popover
      anchorEl={content}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      classes={{ paper: `${classes.paper}` }}
      id={mailId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isContentOpen}
      onClose={handleContentClose}
      width="50%"
    >
      <Content text={text} />
    </Popover>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton
          aria-label="popup 2 new mails"
          color="inherit"
          component="span"
        >
          <Badge badgeContent={2} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          aria-label="popup 3 new notifications"
          color="inherit"
          component="span"
        >
          <Badge badgeContent={3} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={toggleDrawer(true)}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
          component="span"
        >
          {username === null ? (
            <AccountCircleIcon />
          ) : (
            <img alt="Avatar" className={classes.rounded} src={avatar} />
          )}
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  // The bar
  return (
    <div className={classes.grow}>
      <AppBar position="fixed">
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
              inputProps={{ "aria-label": "search" }}
              onKeyUp={handleSearch}
              onChange={handleSetSearchValue}
              value={searchValue}
            />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton
              aria-label="popup 2 new mails"
              aria-controls={mailId}
              aria-haspopup="true"
              onClick={handleContentOpen(mails)}
              color="inherit"
              component="span"
            >
              <Badge badgeContent={2} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              aria-label="popup 3 new notifications"
              aria-controls={noteId}
              aria-haspopup="true"
              onClick={handleContentOpen(notes)}
              color="inherit"
              component="span"
            >
              <Badge badgeContent={3} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <RightDrawer
              open={open}
              toggleDrawer={toggleDrawer}
              button={
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
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
              username={username}
              avatar={avatar}
            />
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="popup more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
              component="span"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderContent}
      {renderMobileMenu}
      <div className={classes.offset} />
    </div>
  );
}

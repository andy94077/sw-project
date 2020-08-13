import React, { useState } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
// import SettingsIcon from "@material-ui/icons/Settings";
import { Link } from "react-router-dom";
import { deleteCookie } from "../cookieHelper";
import LoginForm from "../Login/LoginForm";
import { selectUser } from "../redux/userSlice";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
  user: {
    display: "none",
  },
  rounded: {
    width: "32px",
    borderRadius: "16px",
  },
});

export default function RightDrawer(props) {
  const classes = useStyles();
  const { open, toggleDrawer, button, avatar } = props;
  const { username } = useSelector(selectUser);
  const [modalShow, setModalShow] = useState(false);

  const logIn = (e) => {
    e.preventDefault();
    setModalShow(true);
  };

  const logOut = () => {
    deleteCookie();
  };

  // Settings hasn't implemented.
  const menuList = [
    {
      label: "My account",
      icon: <img alt="Avatar" className={classes.rounded} src={avatar} />,
      link: `/profile/${username}`,
      event: null,
      user: username !== null,
    },
    /*
    {
      label: "Setting",
      icon: <SettingsIcon />,
      link: "/setting",
      event: null,
      user: username !== null,
    },
    */
    {
      label: "Log out",
      icon: <ExitToAppIcon />,
      link: "/",
      event: logOut,
      user: username !== null,
    },
    {
      label: "Sign up",
      icon: <OpenInNewIcon />,
      link: "/",
      event: null,
      user: username === null,
    },
    {
      label: "Log in",
      icon: <AccountCircleIcon />,
      link: "",
      event: (e) => logIn(e),
      user: username === null,
    },
  ];

  const menu = menuList.map((page) => (
    <Link
      to={page.link}
      className={page.user ? null : classes.user}
      key={page.label}
      onClick={page.event}
    >
      <ListItem button>
        <ListItemIcon>{page.icon}</ListItemIcon>
        <ListItemText primary={page.label} />
      </ListItem>
    </Link>
  ));

  const list = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>{menu}</List>
    </div>
  );

  return (
    <div>
      {button}
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
      <LoginForm
        show={modalShow}
        onHide={() => setModalShow(false)}
        otherOption="Cancel"
      />
    </div>
  );
}

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SettingsIcon from "@material-ui/icons/Settings";
import { Link } from "react-router-dom";
import { deleteCookie } from "../cookieHelper";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

export default function RightDrawer(props) {
  const classes = useStyles();

  const { open, toggleDrawer, button, username } = props;
  const logOut = () => {
    deleteCookie();
  };
  const menuItem = ["My account", "Settings", "Log out"];
  const menuIcon = [<AccountCircleIcon />, <SettingsIcon />, <ExitToAppIcon />];
  const menuLink = [`/profile/${username}`, "/setting", "/"];
  const menu = menuItem.map((text, index) => (
    <Link
      to={menuLink[index]}
      key={text}
      onClick={text === "Log out" ? logOut : null}
    >
      <ListItem button>
        <ListItemIcon>{menuIcon[index]}</ListItemIcon>
        <ListItemText primary={text} />
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
    </div>
  );
}

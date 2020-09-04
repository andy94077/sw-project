import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import ListIcon from "@material-ui/icons/List";
// import SettingsIcon from "@material-ui/icons/Settings";
import { Link } from "react-router-dom";
import { CONCAT_SERVER_URL } from "../utils";
import { deleteCookie } from "../cookieHelper";
import LoginForm from "../Login/LoginForm";
import { selectUser, setData } from "../redux/userSlice";

const useStyles = makeStyles({
  profile: {
    display: "flex",
    position: "relative",
    flexDirection: "column",
    width: 250,
    height: 300,
  },
  profileRound: {
    display: "block",
    margin: "10px auto",
    height: 120,
    width: 120,
  },
  circleRound: {
    display: "block",
    position: "relative",
    height: 150,
    width: 150,
    margin: "10px auto",
    borderRadius: 75,
    borderStyle: "solid",
    borderColor: "#9aa4ad6e",
    borderWidth: 6,
  },
  userInfo: {
    position: "relative",
    display: "flex",
    flexGrow: 1,
    alignItems: "center",
    flexDirection: "column",
  },
  frame: {
    position: "absolute",
    height: "100%",
    width: "80%",
    borderBottom: "4px #e6e9ec solid",
  },
  list: {
    position: "relative",
    display: "flex",
    overflow: "auto",
    flexGrow: 1,
  },
  fullList: {
    width: "auto",
  },
  user: {
    display: "none",
  },
  rounded: {
    height: "32px",
    borderRadius: "16px",
  },
  logoutLink: {
    width: "100%",
  },
});

export default function RightDrawer(props) {
  const classes = useStyles();
  const { open, toggleDrawer } = props;
  const dispatch = useDispatch();
  const { username, userAvatar } = useSelector(selectUser);
  const [modalShow, setModalShow] = useState(false);

  const logIn = (e) => {
    e.preventDefault();
    setModalShow(true);
  };

  const logOut = () => {
    deleteCookie();
    dispatch(
      setData({
        username: null,
        user_id: null,
        userAvatar: null,
        bucket_time: null,
        api_token: null,
        verified: null,
      })
    );
    window.Echo.disconnect();
  };

  // Settings hasn't implemented.
  const menuList = [
    {
      label: "My account",
      icon: <AccountCircleIcon />,
      link: `/profile/${username}`,
      event: null,
      user: username !== null,
    },
    {
      label: "My Post",
      icon: <ListIcon />,
      link: `/postlist`,
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
    // {
    //   label: "Log out",
    //   icon: <ExitToAppIcon />,
    //   link: "/",
    //   event: logOut,
    //   user: username !== null,
    // },
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

  return (
    <div>
      <Drawer
        anchor="right"
        style={{ display: "flex" }}
        PaperProps={{ style: { backgroundColor: "#FFFAFA" } }}
        open={open}
        onClose={toggleDrawer(false)}
      >
        {username !== null ? (
          <div
            className={classes.profile}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <div className={classes.circleRound}>
              <img
                alt="Avatar"
                className={classes.profileRound}
                src={
                  username !== null ? (
                    CONCAT_SERVER_URL(userAvatar)
                  ) : (
                    <OpenInNewIcon />
                  )
                }
              />
            </div>
            <div className={classes.userInfo}>
              <div className={classes.frame} />
              <p
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                {username}
              </p>
              <p style={{ display: "block" }}>身份：小萌新</p>
              <p style={{ display: "block" }}>目前熱度：1000</p>
            </div>
          </div>
        ) : null}
        <div
          className={classes.list}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <div style={{ width: "250px" }}>
            <List>
              {menuList.map((page) => (
                <Link
                  to={page.link}
                  className={page.user ? null : classes.user}
                  key={page.label}
                  onClick={page.event}
                >
                  <ListItem button>
                    <ListItemIcon>{page.icon}</ListItemIcon>
                    <ListItemText
                      style={{ color: "black" }}
                      primary={page.label}
                    />
                  </ListItem>
                </Link>
              ))}
            </List>
          </div>
        </div>

        <div
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          {username !== null ? (
            <div className={classes.logoutLink}>
              <Link to="/" key="Log out" onClick={logOut}>
                <ListItem button>
                  <ListItemIcon>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText style={{ color: "black" }} primary="Log out" />
                </ListItem>
              </Link>
            </div>
          ) : null}
        </div>
      </Drawer>
      <LoginForm
        show={modalShow}
        onHide={() => setModalShow(false)}
        otherOption="Cancel"
      />
    </div>
  );
}

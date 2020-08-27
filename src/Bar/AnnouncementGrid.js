import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Snackbar } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import Message from "./Message";
import { selectMenuData, setAnnouncementOpen } from "../redux/menuDataSlice";

const useStyles = makeStyles((theme) => ({
  bar: {
    marginBottom: "10px",
  },
  icon: {
    position: "absolute",
    top: -10,
    right: -5,
    background: "white",
    color: "black",
    zIndex: 2000,
    "&:hover": {
      background: "#aaa",
    },
  },
  root: {
    minWidth: "275px",
    maxWidth: "600px",
    maxHeight: "300px",
    overflow: "auto",
    border: "2px solid #ddd",
    borderRadius: "5px",
    zIndex: "2000",
    [theme.breakpoints.up("md")]: {
      minWidth: "400px",
    },
  },
}));

export default function AnnouncementGrid() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    announcementContent,
    isAnnouncementOpen,
    announcementType,
  } = useSelector(selectMenuData);

  const handleClose = () => {
    dispatch(setAnnouncementOpen({ isOpen: false }));
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      className={classes.bar}
      open={isAnnouncementOpen}
    >
      <div>
        <IconButton
          size="small"
          className={classes.icon}
          component="span"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <div className={classes.root}>
          <Message
            type={announcementType}
            allText={[announcementContent]}
            time={null}
          />
        </div>
      </div>
    </Snackbar>
  );
}

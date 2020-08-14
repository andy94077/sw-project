import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Snackbar } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Content from "../Bar/Content";

const useStyles = makeStyles(() => ({
  bar: {
    marginTop: "60px",
  },
  content: {
    background: "white",
    color: "black",
    borderRadius: 10,
  },
  contentText: {
    maxWidth: "275px",
    minHeight: "10px",
    overflow: "auto",
  },
  icon: {
    position: "absolute",
    top: -10,
    right: -5,
    background: "white",
    zIndex: 2000,
    "&:hover": {
      background: "#aaa",
    },
  },
}));

export default function AnnouncementGrid(props) {
  const classes = useStyles();

  const { isAdOpen, handleAdClose, adMessage } = props;

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      className={classes.bar}
      open={isAdOpen}
    >
      <div>
        <IconButton
          size="small"
          className={classes.icon}
          component="span"
          aria-label="close"
          color="inherit"
          onClick={handleAdClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <Content text={[adMessage]} defaultExpanded />
      </div>
    </Snackbar>
  );
}

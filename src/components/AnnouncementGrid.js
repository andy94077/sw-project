import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Snackbar, SnackbarContent } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

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
    top: 5,
    right: 5,
    background: "white",
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
      <SnackbarContent
        className={classes.content}
        message={
          <div>
            <h6>Announcement:</h6>
            <div
              className={classes.contentText}
              dangerouslySetInnerHTML={{ __html: adMessage }}
            />
          </div>
        }
        action={
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
        }
      />
    </Snackbar>
  );
}

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles((theme) => ({
  frame: {
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
    [theme.breakpoints.only("sm")]: {
      width: "70%",
    },
    [theme.breakpoints.up("md")]: {
      width: "40%",
    },
    borderRadius: "25px",
    padding: "5px",
  },
  content: {
    padding: "0 24px",
  },
  contentText: {
    padding: "0 4%",
    fontSize: "20px",
  },
}));

export default function AlertDialog(props) {
  const classes = useStyles();

  const {
    open,
    alertTitle,
    alertDesciption,
    alertButton,
    moreComponent,
    onClose,
  } = props;

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        classes={{ paper: classes.frame }}
        onClose={onClose}
      >
        <DialogTitle id="alert-dialog-title">{alertTitle}</DialogTitle>
        <DialogContent className={classes.content}>
          {alertDesciption !== undefined && alertDesciption !== "" && (
            <DialogContentText
              className={classes.contentText}
              id="alert-dialog-description"
            >
              {alertDesciption}
            </DialogContentText>
          )}
          {moreComponent}
        </DialogContent>
        <DialogActions>{alertButton}</DialogActions>
      </Dialog>
    </div>
  );
}

import React, { useState } from "react";
import { makeStyles, Paper, Button, TextField } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";

import { CONCAT_SERVER_URL } from "../utils";
import AlertDialog from "../components/AlertDialog";

const useStyles = makeStyles(() => ({
  root: {
    flex: "70%",
    display: "flex",
    flexDirection: "row",
  },
  message: {
    minHeight: "20px",
    width: "55%",
    borderRadius: "30px",
    margin: "5px",
    display: "flex",
    background: "#fafafa",
  },
  author: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "5px 20px 5px 20px",
    fontWeight: "bold",
  },
  content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "5px",
    wordBreak: "break-all",
    padding: "0",
    lineHeight: "20px",
  },
  TextField: {
    marginLeft: "5%",
    marginRight: "5%",
  },
}));

export default function ChatBox(props) {
  const { messageId, message, refresh, userId } = props;
  const [menu, setMenu] = useState(null);
  const [canEdit] = useState(false);
  const [onDelete, setOnDelete] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [isOption] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isConnectionFailed, setIsConnectionFailed] = useState(false);
  const [newMessage, setNewMessage] = useState(message);
  const [errMessage, setErrMessage] = useState("");
  const classes = useStyles();

  const handleClick = (event) => {
    setMenu(event.currentTarget);
  };

  const handleClose = () => {
    setMenu(null);
  };

  function handleDeleteDialogClose() {
    setIsDeleteDialogOpen(false);
  }

  function handleEditDialogClose() {
    setIsEditDialogOpen(false);
  }

  const handleDelete = () => {
    if (!onDelete) {
      setOnDelete(true);
      axios
        .delete(CONCAT_SERVER_URL(`/api/v1/messages/${messageId}`), {
          data: {
            user: true,
          },
        })
        .then(() => {
          refresh();
        })
        .catch(() => {
          setErrMessage({
            title: "Network error",
            message: "Failed to delete the message, please retry",
          });
          setIsConnectionFailed(true);
        })
        .finally(() => {
          setOnDelete(false);
          setIsDeleteDialogOpen(false);
        });
    }
  };

  function handleEdit() {
    if (!onEdit && newMessage !== "") {
      setOnEdit(true);
      axios
        .post(CONCAT_SERVER_URL(`/api/v1/messages/${messageId}`), {
          content: newMessage,
          user: true,
          user_id: userId,
        })
        .then(() => {
          refresh();
          setIsEditDialogOpen(false);
        })
        .catch((e) => {
          if (e.message === "Request failed with status code 403") {
            setIsConnectionFailed(true);
            setErrMessage({
              title: "Bucket Error",
              message: "You cannot edit message when you in the bucket",
            });
          } else {
            setErrMessage({
              title: "Network error",
              message: "Failed to edit the message, please retry",
            });
            setIsConnectionFailed(true);
          }
        })
        .finally(() => {
          setOnEdit(false);
        });
    }
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.message}>
        <div className={classes.content}>{message}</div>
      </Paper>
      {isOption && (
        <IconButton size="small" onClick={handleClick} aria-controls="m">
          <MoreVertIcon />
        </IconButton>
      )}
      {isOption && (
        <Menu
          id="m"
          anchorEl={menu}
          keepMounted
          open={Boolean(menu)}
          onClose={handleClose}
        >
          {canEdit && (
            <MenuItem
              onClick={() => {
                setIsDeleteDialogOpen(true);
              }}
            >
              delete
            </MenuItem>
          )}
          {canEdit && (
            <MenuItem
              onClick={() => {
                setIsEditDialogOpen(true);
              }}
            >
              Edit
            </MenuItem>
          )}
        </Menu>
      )}
      <AlertDialog
        open={isConnectionFailed}
        alertTitle={errMessage.title}
        alertDesciption={errMessage.message}
        alertButton={
          <>
            <Button
              onClick={() => {
                setIsConnectionFailed(false);
              }}
            >
              Got it!
            </Button>
          </>
        }
        onClose={() => {
          setIsConnectionFailed(false);
        }}
      />
      <AlertDialog
        open={isEditDialogOpen}
        alertTitle="Edit message"
        alertButton={
          <>
            <Button onClick={handleEdit}>Yes</Button>
            <Button onClick={handleEditDialogClose}>No</Button>
          </>
        }
        onClose={handleEditDialogClose}
        moreComponent={
          <TextField
            className={classes.TextField}
            multiline
            rowsMax={4}
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
            }}
          />
        }
      />
      <AlertDialog
        open={isDeleteDialogOpen}
        alertTitle="Warning"
        alertDesciption="You are trying to delete a message"
        alertButton={
          <>
            <Button onClick={handleDelete}>Yes</Button>
            <Button onClick={handleDeleteDialogClose}>No</Button>
          </>
        }
        onClose={handleDeleteDialogClose}
      />
    </div>
  );
}

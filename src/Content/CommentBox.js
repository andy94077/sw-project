import React, { useState } from "react";
import { makeStyles, Paper, Button, TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import Axios from "axios";

import { CONCAT_SERVER_URL } from "../utils";
import AlertDialog from "../components/AlertDialog";

const useStyles = makeStyles(() => ({
  root: {
    flex: "70%",
    display: "flex",
    flexDirection: "row",
  },
  comment: {
    minHeight: "20px",
    width: "90%",
    borderRadius: "30px",
    margin: "5px",
    display: "flex",
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

export default function CommentBox(props) {
  const {
    author,
    comment,
    commentId,
    canDelete,
    refresh,
    canEdit,
    isUser,
    userId,
  } = props;
  const [menu, setMenu] = useState(null);
  const [onDelete, setOnDelete] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isConnectionFailed, setIsConnectionFailed] = useState(false);
  const [newComment, setNewComment] = useState(comment);
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
      Axios.delete(CONCAT_SERVER_URL("/api/v1/comment"), {
        data: {
          id: commentId,
          user: true,
        },
      })
        .then(() => {
          refresh();
        })
        .catch(() => {
          setErrMessage({
            title: "Network error",
            message: "Failed to delete the comment, please retry",
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
    if (!onEdit && newComment !== "") {
      setOnEdit(true);
      Axios.post(CONCAT_SERVER_URL("/api/v1/comment/modification"), {
        id: commentId,
        content: newComment,
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
              message: "You cannot edit comment when you in the bucket",
            });
          } else {
            setErrMessage({
              title: "Network error",
              message: "Failed to edit the comment, please retry",
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
      <Paper className={classes.comment}>
        <Link to={`/profile/${author}`} className={classes.author}>
          {author}
        </Link>
        <div className={classes.content}>{comment}</div>
      </Paper>
      {isUser && (
        <IconButton size="small" onClick={handleClick} aria-controls="m">
          <MoreVertIcon />
        </IconButton>
      )}
      {isUser && (
        <Menu
          id="m"
          anchorEl={menu}
          keepMounted
          open={Boolean(menu)}
          onClose={handleClose}
        >
          {canDelete && (
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
          {!canDelete && !canEdit && <MenuItem>Permission denied</MenuItem>}
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
        alertTitle="Edit comment"
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
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
            }}
          />
        }
      />
      <AlertDialog
        open={isDeleteDialogOpen}
        alertTitle="Warning"
        alertDesciption="You are trying to delete a comment"
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

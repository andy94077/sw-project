import React, { useState } from "react";
import { makeStyles, Paper, Button, TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import Axios from "axios";

import { CONCAT_SERVER_URL } from "../constants";
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
}));

export default function CommentBox(props) {
  const { author, comment, commentId, canDelete, refresh, canEdit } = props;
  const [menu, setMenu] = useState(null);
  const [onDelete, setOnDelete] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isConnectionFailed, setIsConnectionFailed] = useState(false);
  const [newComment, setNewComment] = useState("");
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
        },
      })
        .then(() => {
          refresh();
        })
        .catch((e) => {
          console.log(e);
          setErrMessage("刪除留言失敗，請新嘗試");
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
      })
        .then(() => {
          refresh();
          setIsEditDialogOpen(false);
        })
        .catch(() => {
          setErrMessage("編輯留言失敗，請新嘗試");
          setIsConnectionFailed(true);
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
      <IconButton size="small" onClick={handleClick} aria-controls="m">
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="m"
        anchorEl={menu}
        keepMounted
        open={Boolean(menu)}
        onClose={handleClose}
      >
        {canDelete && (
          <>
            <MenuItem
              onClick={() => {
                setIsDeleteDialogOpen(true);
              }}
            >
              delete
            </MenuItem>
            <AlertDialog
              open={isDeleteDialogOpen}
              alertTitle="警告"
              alertDesciption="你正在嘗試刪除一則留言"
              alertButton={
                <>
                  <Button onClick={handleDelete}>確認</Button>
                  <Button onClick={handleDeleteDialogClose}>取消</Button>
                </>
              }
              onClose={handleDeleteDialogClose}
            />
          </>
        )}
        {canEdit && (
          <>
            <MenuItem
              onClick={() => {
                setIsEditDialogOpen(true);
              }}
            >
              Edit
            </MenuItem>
            <AlertDialog
              open={isEditDialogOpen}
              alertTitle="編輯留言"
              alertDesciption={comment}
              alertButton={
                <>
                  <Button onClick={handleEdit}>確認</Button>
                  <Button onClick={handleEditDialogClose}>取消</Button>
                </>
              }
              onClose={handleEditDialogClose}
              moreComponent={
                <TextField
                  onChange={(e) => {
                    setNewComment(e.target.value);
                  }}
                />
              }
            />
          </>
        )}
        {!canDelete && !canEdit && <MenuItem>Permission denied</MenuItem>}
      </Menu>
      <AlertDialog
        open={isConnectionFailed}
        alertTitle="連線不穩"
        alertDesciption={errMessage}
        alertButton={
          <>
            <Button
              onClick={() => {
                setIsConnectionFailed(false);
              }}
            >
              確認
            </Button>
          </>
        }
        onClose={() => {
          setIsConnectionFailed(false);
        }}
      />
    </div>
  );
}

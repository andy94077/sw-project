import React, { useState } from "react";
import { makeStyles, Paper } from "@material-ui/core";
import { Link } from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import Axios from "axios";

import { CONCAT_SERVER_URL } from "../constants";

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
  const classes = useStyles();

  const handleClick = (event) => {
    setMenu(event.currentTarget);
  };

  const handleClose = () => {
    setMenu(null);
  };

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
        })
        .finally(() => {
          setOnDelete(false);
        });
    }
  };

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
        {canDelete && <MenuItem onClick={handleDelete}>delete</MenuItem>}
        {canEdit && <MenuItem>Edit</MenuItem>}
        {!canDelete && !canEdit && <MenuItem>Permission denied</MenuItem>}
      </Menu>
    </div>
  );
}

import React, { useState } from "react";
import {
  Button,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  makeStyles,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import { Redirect, Link } from "react-router-dom";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { selectUser } from "../redux/userSlice";
import { CONCAT_SERVER_URL } from "../constants";
import { setDialog } from "../redux/dialogSlice";
import Loading from "../components/Loading";
import AlertDialog from "../components/AlertDialog";
import MyQuill from "../components/MyQuill";

const useStyles = makeStyles(() => ({
  cardHeader: {
    padding: 0,
  },
  action: {
    margin: 0,
  },
  subheader: {
    fontWeight: 500,
    fontSize: "0.875em",
  },
  user: {
    flexGrow: "1",
  },
  myQuill: {
    marginRight: "5%",
    width: "90%",
  },
  text: {
    overflow: "auto",
    flexGrow: "1",
  },
}));

export default function Post(props) {
  const { author, timeAgo, content, id, setError, refresh } = props;
  const classes = useStyles();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState(content);
  const { username, userId } = useSelector(selectUser);
  const [onDelete, setOnDelete] = useState(0);
  const [onEdit, setOnEdit] = useState(0);
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setMenu(event.currentTarget);
  };

  const handleClose = () => {
    setMenu(null);
  };
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleDelete = () => {
    setOnDelete(1);
    Axios.delete(CONCAT_SERVER_URL("/api/v1/post"), {
      data: { id },
    })
      .then(() => {
        setOnDelete(2);
      })
      .catch((e) => {
        if (e.message === "Network Error") {
          dispatch(
            setDialog({
              title: "Network Error",
              message: "Failed to delete post, pleace retry",
            })
          );
        }
        setOnDelete(0);
      })
      .finally(() => {
        setIsDialogOpen(false);
      });
  };

  async function handleEdit() {
    if (onEdit === 0) {
      setOnEdit(1);
      Axios.post(CONCAT_SERVER_URL("/api/v1/post/modification"), {
        id,
        content: newPost,
        user: true,
        user_id: userId,
      })
        .then(() => {
          setIsEditDialogOpen(false);
          refresh();
        })
        .catch(() => {
          setError({
            message: "Connection Error",
            url: "/pictures/connection-error.svg",
          });
        })
        .finally(() => {
          setOnEdit(0);
        });
    }
  }
  if (onDelete === 1) {
    return <Loading />;
  }
  if (onDelete === 2) {
    return <Redirect to="/home" />;
  }
  return (
    <>
      <CardHeader
        classes={{
          root: classes.cardHeader,
          action: classes.action,
          subheader: classes.subheader,
        }}
        title={
          <Link to={`/profile/${author}`} className={classes.user}>
            {author}
          </Link>
        }
        subheader={timeAgo}
        action={
          author === username && (
            <>
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
                <MenuItem
                  onClick={() => {
                    setMenu(false);
                    setIsDialogOpen(true);
                  }}
                >
                  delete
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setMenu(false);
                    setIsEditDialogOpen(true);
                  }}
                >
                  Edit
                </MenuItem>
              </Menu>
              <AlertDialog
                open={isDialogOpen}
                alertTitle="Warning"
                alertDesciption="Do you really want to delete this post?"
                alertButton={
                  <>
                    <Button onClick={handleDelete}>Yes</Button>
                    <Button onClick={handleDialogClose}>No</Button>
                  </>
                }
                onClose={handleDialogClose}
              />
              <AlertDialog
                open={isEditDialogOpen}
                alertTitle="Edit Post"
                alertButton={
                  <>
                    <Button onClick={handleEdit}>Yes</Button>
                    <Button onClick={handleEditDialogClose}>No</Button>
                  </>
                }
                onClose={handleEditDialogClose}
                moreComponent={
                  <MyQuill
                    className={classes.myQuill}
                    value={newPost}
                    setValue={setNewPost}
                  />
                }
              />
            </>
          )
        }
      />
      <div
        className={classes.text}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
}

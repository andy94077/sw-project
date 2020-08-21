import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  makeStyles,
  Avatar,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Redirect, Link } from "react-router-dom";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { selectUser } from "../redux/userSlice";
import { CONCAT_SERVER_URL } from "../utils";
import { setDialog } from "../redux/dialogSlice";
import Loading from "../components/Loading";
import AlertDialog from "../components/AlertDialog";
import MyQuill from "../components/MyQuill";

const useStyles = makeStyles(() => ({
  cardHeader: {
    padding: 0,
  },
  title: {
    fontSize: "22px",
  },
  action: {
    margin: 0,
  },
  subheader: {
    fontWeight: 500,
    fontSize: "0.775em",
  },
  avatar: {
    marginTop: "7px",
  },
  user: {
    flexGrow: "1",
  },
  myQuill: {
    marginRight: "5%",
    width: "90%",
  },
  text: {
    margin: "10px 0 0 10px",
    overflow: "auto",
    flexGrow: "1",
  },
}));

export default function Post(props) {
  const { author, timeAgo, content, id, refresh } = props;
  const classes = useStyles();
  const history = useHistory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState(content);
  const { username, userId } = useSelector(selectUser);
  const [onDelete, setOnDelete] = useState(0);
  const [onEdit, setOnEdit] = useState(0);
  const dispatch = useDispatch();
  const [postUserAvatar, setPostUserAvatar] = useState(null);

  useEffect(() => {
    axios
      .request({
        method: "POST",
        url: CONCAT_SERVER_URL("/api/v1/user/getUserAvatar"),
        data: { name: author },
      })
      .then((response) => {
        setPostUserAvatar(CONCAT_SERVER_URL(`${response.data}`));
      })
      .finally();
  }, [author]);

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
    axios
      .delete(CONCAT_SERVER_URL("/api/v1/post"), {
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

  const handleSearch = (target) => () => {
    history.push(`/profile/${target}`);
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  async function handleEdit() {
    if (onEdit === 0) {
      setOnEdit(1);
      axios
        .post(CONCAT_SERVER_URL("/api/v1/post/modification"), {
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
          dispatch(
            setDialog({
              title: "Connection Error",
              message:
                "Network failed. Please check the network cables, modem, and router.",
            })
          );
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
          title: classes.title,
          subheader: classes.subheader,
          avatar: classes.avatar,
        }}
        avatar={
          <div
            role="button"
            tabIndex="0"
            onClick={handleSearch(author)}
            onKeyUp={handleKeyUp}
            style={{ outline: "none" }}
          >
            <Avatar
              alt="Avatar"
              src={postUserAvatar}
              style={{ width: "50px", height: "50px" }}
            />
          </div>
        }
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

import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Axios from "axios";
import {
  Collapse,
  Button,
  CardMedia,
  CardContent,
  Card,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import CardActions from "@material-ui/core/CardActions";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useDispatch, useSelector } from "react-redux";

import { Link, Redirect } from "react-router-dom";
import Loading from "../components/Loading";
import { CONCAT_SERVER_URL } from "../constants";
import AlertDialog from "../components/AlertDialog";
import MyQuill from "../components/MyQuill";
import ErrorMsg from "../components/ErrorMsg";
import { setDialog } from "../redux/dialogSlice";
import "./Content.css";
import Like from "./Like";
import { selectUser } from "../redux/userSlice";
import Comment from "./Comment";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    boxShadow: "rgba(0,0,0,0.45) 0px 2px 10px",
    borderRadius: "30px",
    [theme.breakpoints.down("xs")]: {
      height: "90vh",
      marginTop: "0px",
    },
    [theme.breakpoints.only("sm")]: {
      height: "85vh",
      marginTop: "25px",
    },
    [theme.breakpoints.up("md")]: {
      height: "75vh",
      marginTop: "50px",
    },
  },
  details: {
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("xs")]: {
      height: "60%",
      flex: "100%",
    },
    [theme.breakpoints.only("sm")]: {
      height: "55%",
      flex: "100%",
    },
    [theme.breakpoints.up("md")]: {
      flex: "50%",
      height: "100%",
    },
  },
  cover: {
    [theme.breakpoints.down("xs")]: {
      height: "40%",
      flex: "100%",
    },
    [theme.breakpoints.only("sm")]: {
      height: "45%",
      flex: "100%",
    },
    [theme.breakpoints.up("md")]: {
      flex: "50%",
      height: "100%",
    },
    cursor: "zoom-in",
  },
  coverOpen: {
    flex: "100%",
    height: "100%",
    cursor: "zoom-out",
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: "auto",
  },
  expandOpen: {
    transform: "rotate(180deg)",
    marginLeft: "auto",
  },
  button: {
    maxHeight: "35px",
    maxWidth: "30px",
    marginLeft: "10%",
  },
  content: {
    maxHeight: "40%",
    minHeight: "130px",
    display: "flex",
    flexDirection: "column",
    padding: "0px",
    margin: "16px 16px 0px 16px",
  },
  collapse: {
    display: "flex",
    width: "100%",
    flexGrow: "1",
    flexDirection: "column",
    overflow: "hidden",
  },
  wrapper: {
    height: "100%",
  },
  wrapperInner: {
    display: "flex",
    flexDirection: "column",
  },
  author: {
    height: "40px",
  },
  text: {
    overflow: "auto",
    flexGrow: "1",
  },
  time: {
    overflow: "hidden",
    flexGrow: "1",
  },
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
}));

export default function ContentCard(props) {
  const { src, id, author, content, refresh, timeAgo, isBucket } = props;
  const classes = useStyles();
  const [error, setError] = useState({ message: "", url: "" });
  const [expand, setExpand] = useState(true);
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [onDelete, setOnDelete] = useState(0);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [onEdit, setOnEdit] = useState(0);
  const [newPost, setNewPost] = useState(content);
  const { username, userId } = useSelector(selectUser);

  const dispatch = useDispatch();

  const handleClick = (event) => {
    setMenu(event.currentTarget);
  };

  const handleClose = () => {
    setMenu(null);
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

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
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
  if (onDelete === 0) {
    if (error.message !== "") {
      return <ErrorMsg message={error.message} imgUrl={error.url} />;
    }
    return (
      <Card className={classes.root}>
        <CardMedia
          className={clsx(classes.cover, {
            [classes.coverOpen]: isCoverOpen,
          })}
          image={src}
          title="Live from space album cover"
          onClick={() => {
            setIsCoverOpen(!isCoverOpen);
          }}
        />
        <div className={classes.details}>
          <CardContent className={classes.content}>
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
                    <IconButton
                      size="small"
                      onClick={handleClick}
                      aria-controls="m"
                    >
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
          </CardContent>
          <CardActions disableSpacing className={classes.cardActions}>
            <Like id={id} />
            <IconButton
              component="span"
              onClick={() => {
                setExpand(!expand);
              }}
              className={clsx(classes.expand, {
                [classes.expandOpen]: expand,
              })}
              size={expand ? "small" : "medium"}
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse
            in={expand}
            classes={{
              container: classes.collapse,
              wrapper: classes.wrapper,
              wrapperInner: classes.wrapperInner,
            }}
          >
            <Comment
              author={author}
              isBucket={isBucket}
              id={id}
              setError={setError}
            />
          </Collapse>
        </div>
      </Card>
    );
  }
}

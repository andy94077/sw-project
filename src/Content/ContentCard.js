import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Axios from "axios";
import {
  Collapse,
  TextareaAutosize,
  Button,
  Fab,
  Typography,
  CardMedia,
  CardContent,
  Card,
  CardActionArea,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SendIcon from "@material-ui/icons/Send";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { Link, Redirect } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import CommentBox from "./CommentBox";
import Loading from "../components/Loading";
import { CONCAT_SERVER_URL } from "../constants";
import AlertDialog from "../components/AlertDialog";

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
      height: "55%",
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
      height: "45%",
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
    marginLeft: "5%",
  },
  expandOpen: {
    transform: "rotate(180deg)",
    marginLeft: "5%",
  },
  comment: {
    marginLeft: "10%",
    display: "flex",
    margin: "5px",
    width: "80%",
    height: "40px",
  },
  input: {
    resize: "none",
    width: "90%",
    borderRadius: "20px",
    fontSize: "20px",
    alignItems: "center",
  },
  button: {
    maxHeight: "35px",
    maxWidth: "30px",
    marginLeft: "10%",
  },
  comments: {
    overflow: "auto",
    weight: "100%",
    flexGrow: "1",
    marginLeft: "5%",
    display: "flex",
  },
  content: {
    maxHeight: "50%",
    minHeight: "110px",
    display: "flex",
    flexDirection: "column",
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
  cardAction: {
    display: "flex",
    flexDirection: "row",
  },
  user: {
    flexGrow: "1",
  },
}));

export default function ContentCard(props) {
  const { src, id, author, content, userId, username, refresh } = props;
  const classes = useStyles();
  const [expand, setExpand] = useState(true);
  const [value, setValue] = useState("");
  const [comments, setComments] = useState([]);
  const [isUpload, setIsUpload] = useState(false);
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [onDelete, setOnDelete] = useState(0);
  const [isConnectionFailed, setIsConnectionFailed] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [onEdit, setOnEdit] = useState(0);
  const [newPost, setNewPost] = useState(content);

  function refreshComment() {
    Axios.get(CONCAT_SERVER_URL("/api/v1/comment/post"), {
      params: { post: id },
    })
      .then(({ data }) => {
        setComments(data.reverse());
        setIsUpload(false);
      })
      .catch(() => {
        setIsUpload(false);
      });
  }

  function upload() {
    setIsUpload(true);
    Axios.post(CONCAT_SERVER_URL("/api/v1/comment/upload"), {
      content: value,
      user_id: userId,
      post_id: id,
    })
      .then(() => {
        refreshComment();
        setValue("");
      })
      .catch((e) => {
        if (e.message === "Network Error") {
          setErrMessage("Failed to send comment, pleace retry");
          setIsConnectionFailed(true);
          setIsUpload(false);
        }
        setIsUpload(false);
      });
  }

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (value !== "") upload();
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && value !== "") upload();
  };

  useEffect(() => {
    refreshComment();
  }, [id]);

  const handleClick = (event) => {
    setMenu(event.currentTarget);
  };

  const handleClose = () => {
    setMenu(null);
  };

  function handleDelete() {
    setOnDelete(1);
    Axios.delete(CONCAT_SERVER_URL("/api/v1/post"), { data: { id } })
      .then((res) => {
        console.log(res);
        setOnDelete(2);
      })
      .catch((e) => {
        console.log(e);
        setErrMessage("Failed to delete post, pleace retry");
        setIsConnectionFailed(true);
        setOnDelete(0);
      })
      .finally(() => {
        setIsDialogOpen(false);
      });
  }

  function handleDialogClose() {
    setIsDialogOpen(false);
  }

  function handleEditDialogClose() {
    setIsEditDialogOpen(false);
  }

  async function handleEdit() {
    if (onEdit === 0) {
      setOnEdit(1);
      Axios.post(CONCAT_SERVER_URL("/api/v1/post/modification"), {
        id,
        content: newPost,
      })
        .then(() => {
          setIsEditDialogOpen(false);
          refresh();
        })
        .catch(() => {
          setErrMessage("Failed to edit post, pleace retry");
          setIsConnectionFailed(true);
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
            <CardActionArea className={classes.cardAction}>
              <Link to={`/profile/${author}`} className={classes.user}>
                <Typography
                  component="h5"
                  variant="h5"
                  className={classes.author}
                >
                  {author}
                </Typography>
              </Link>
              {author === username && (
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
                    alertDesciption="You are trying to delete a post"
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
                    alertTitle="Edit Commit"
                    alertButton={
                      <>
                        <Button onClick={handleEdit}>Yes</Button>
                        <Button onClick={handleEditDialogClose}>No</Button>
                      </>
                    }
                    onClose={handleEditDialogClose}
                    moreComponent={
                      <TextField
                        value={newPost}
                        onChange={(e) => {
                          setNewPost(e.target.value);
                        }}
                      />
                    }
                  />
                </>
              )}
            </CardActionArea>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              display="block"
              component="div"
              className={classes.text}
            >
              {content}
            </Typography>
          </CardContent>
          <Fab
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
          </Fab>
          <Collapse
            in={expand}
            classes={{
              container: classes.collapse,
              wrapper: classes.wrapper,
              wrapperInner: classes.wrapperInner,
            }}
          >
            <ScrollToBottom className={classes.comments}>
              {comments.map((i) => (
                <CommentBox
                  key={i.id}
                  author={i.user_name}
                  comment={i.content}
                  commentId={i.id}
                  canDelete={username === i.user_name || username === author}
                  canEdit={username === i.user_name}
                  refresh={refreshComment}
                />
              ))}
            </ScrollToBottom>
            {username && (
              <form className={classes.comment}>
                <TextareaAutosize
                  id="standard-basic"
                  className={classes.input}
                  rowsMin={1}
                  rowsMax={3}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleEnter}
                />
                {isUpload ? (
                  <Loading />
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOnSubmit}
                    component="span"
                    className={classes.button}
                  >
                    <SendIcon />
                  </Button>
                )}
              </form>
            )}
          </Collapse>
        </div>
        <AlertDialog
          open={isConnectionFailed}
          alertTitle="Network Error"
          alertDesciption={errMessage}
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
      </Card>
    );
  }
}

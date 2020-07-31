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
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SendIcon from "@material-ui/icons/Send";

import { Link } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import CommentBox from "./CommentBox";
import Loading from "../components/Loading";

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
    [theme.breakpoints.down("xs")]: {
      height: "100%",
      flex: "100%",
    },
    [theme.breakpoints.only("sm")]: {
      height: "100%",
      flex: "100%",
    },
    [theme.breakpoints.up("md")]: {
      flex: "100%",
      height: "100%",
    },
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
    marginLeft: "10%",
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
  cardMedia: {
    style: "",
  },
}));

export default function ContentCard(props) {
  const { src, id, author, content, userId } = props;
  const classes = useStyles();
  const [expand, setExpand] = useState(true);
  const [value, setValue] = useState("");
  const [comments, setComments] = useState([]);
  const [isUpload, setIsUpload] = useState(false);
  const [isCoverOpen, setIsCoverOpen] = useState(false);

  function refreshComment() {
    Axios.get(`http://pinterest-server.test/api/v1/comment/post`, {
      params: { post: id },
    })
      .then(({ data }) => {
        setComments(data.reverse());
        setIsUpload(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function upload() {
    if (value !== "") {
      setIsUpload(true);
      Axios.request({
        method: "post",
        url: "http://pinterest-server.test/api/v1/comment/upload",
        data: {
          content: value,
          user_id: userId,
          post_id: id,
        },
      }).then(() => {
        refreshComment();
      });
      setValue("");
    }
  }

  const handleOnSubmit = (e) => {
    e.preventDefault();
    upload();
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && value !== "") {
      setIsUpload(true);
      Axios.request({
        method: "post",
        url: "http://pinterest-server.test/api/v1/comment/upload",
        data: {
          content: value,
          user_id: userId,
          post_id: id,
        },
      }).then(() => {
        refreshComment();
      });
      setValue("");
    }
  };

  console.log(isUpload);

  useEffect(() => {
    refreshComment();
  }, [id]);

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
          <CardActionArea className={classes.cardMedia}>
            <Link to={`/profile/${author}`}>
              <Typography
                component="h5"
                variant="h5"
                className={classes.author}
              >
                {author}
              </Typography>
            </Link>
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
          onClick={() => {
            setExpand(!expand);
          }}
          className={clsx(classes.expand, {
            [classes.expandOpen]: expand,
          })}
          size={expand ? "small" : ""}
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
              <div className={classes.command} key={i.id}>
                <CommentBox author={i.user_name} command={i.content} />
              </div>
            ))}
          </ScrollToBottom>
          <form className={classes.comment} onSubmit={handleOnSubmit}>
            <TextareaAutosize
              id="standard-basic"
              className={classes.input}
              rowsMin={1}
              rowsMax={3}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyUp={handleEnter}
            />
            {isUpload ? (
              <Loading />
            ) : (
              <Button
                variant="contained"
                color="primary"
                type="submit"
                className={classes.button}
              >
                <SendIcon />
              </Button>
            )}
          </form>
        </Collapse>
      </div>
    </Card>
  );
}

import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Axios from "axios";
import {
  Collapse,
  TextareaAutosize,
  Button,
  Icon,
  Fab,
  Typography,
  CardMedia,
  CardContent,
  Card,
  CardActionArea,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { Link } from "react-router-dom";
import CommentBox from "./CommentBox";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    height: "75vh",
    boxShadow: "rgba(0,0,0,0.45) 0px 2px 10px",
    borderRadius: "30px",
    marginTop: "50px",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("xs")]: {
      height: "57%",
      flex: "100%",
    },
    [theme.breakpoints.only("sm")]: {
      height: "53%",
      flex: "100%",
    },
    [theme.breakpoints.up("md")]: {
      flex: "50%",
      heught: "100%",
    },
  },
  cover: {
    [theme.breakpoints.down("xs")]: {
      height: "43%",
      flex: "100%",
    },
    [theme.breakpoints.only("sm")]: {
      height: "47%",
      flex: "100%",
    },
    [theme.breakpoints.up("md")]: {
      flex: "50%",
      height: "100%",
    },
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
    marginLeft: "5%",
    width: "90%",
    display: "flex",
  },
  input: {
    resize: "none",
    width: "75%",
    borderRadius: "20px",
    margin: "5px",
    fontSize: "x-large",
  },
  button: {
    maxHeight: "40px",
  },
  comments: {
    overflow: "auto",
    [theme.breakpoints.down("xs")]: {
      maxHeight: "20%",
      marginLeft: "10%",
    },
    [theme.breakpoints.only("sm")]: {
      maxHeight: "20%",
      marginLeft: "10%",
    },
    [theme.breakpoints.up("md")]: {
      maxHeight: "70%",
      marginLeft: "10%",
    },
  },
}));

export default function ContentCard(props) {
  const { src, id, author, content } = props;
  const classes = useStyles();
  const [expand, setExpand] = useState(false);
  const [value, setValue] = useState("");
  const [comments, setComments] = useState([]);

  function refreshComment() {
    Axios.get(`http://pinterest-server.test/api/v1/comment/${id}`)
      .then(({ data }) => {
        setComments(data.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (value !== "") {
      Axios.request({
        method: "post",
        url: "http://pinterest-server.test/api/v1/comment/upload",
        data: {
          content: value,
          user_id: 1,
          post_id: id,
        },
      }).then(() => {
        refreshComment();
      });
      setValue("");
    }
  };

  useEffect(() => {
    refreshComment();
  }, [id]);

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.cover}
        image={src}
        title="Live from space album cover"
      />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <CardActionArea>
            <Link to={`/profile/${author}`}>
              <Typography component="h5" variant="h5">
                {author}
              </Typography>
            </Link>
          </CardActionArea>
          <Typography variant="subtitle1" color="textSecondary">
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
        >
          <ExpandMoreIcon />
        </Fab>
        <Collapse in={expand}>
          <div className={classes.comments}>
            {comments.map((i) => (
              <div className={classes.command}>
                <CommentBox author={i.user_name} command={i.content} />
              </div>
            ))}
          </div>
          <form className={classes.command} onSubmit={handleOnSubmit}>
            <TextareaAutosize
              id="standard-basic"
              className={classes.input}
              rowsMin={1}
              rowsMax={10}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              endIcon={<Icon>send</Icon>}
              size="small"
              type="submit"
            >
              Send
            </Button>
          </form>
        </Collapse>
      </div>
    </Card>
  );
}

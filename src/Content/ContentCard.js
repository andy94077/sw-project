import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import {
  Collapse,
  CardMedia,
  CardContent,
  Card,
  IconButton,
} from "@material-ui/core";
import CardActions from "@material-ui/core/CardActions";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import "./Content.css";
import Like from "./Like";
import Comment from "./Comment";
import Post from "./Post";

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
}));

export default function ContentCard(props) {
  const { src, id, author, content, refresh, timeAgo, isBucket } = props;
  const classes = useStyles();
  const [expand, setExpand] = useState(true);
  const [isCoverOpen, setIsCoverOpen] = useState(false);

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
          <Post
            author={author}
            timeAgo={timeAgo}
            content={content}
            id={id}
            refresh={refresh}
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
          <Comment author={author} isBucket={isBucket} id={id} />
        </Collapse>
      </div>
    </Card>
  );
}

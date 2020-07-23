import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import {
  Collapse,
  Grid,
  TextareaAutosize,
  Button,
  Icon,
  Fab,
  Typography,
  CardMedia,
  CardContent,
  Card,
  ExpandMoreIcon,
} from "@material-ui/core";

// eslint-disable-next-line import/no-unresolved
import CommandBox from "./CommandBox";

const useStyles = makeStyles((theme) => ({
  gird: {
    flexGrow: 1,
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
    height: "80vh",
    boxShadow: "rgba(0,0,0,0.45) 0px 2px 10px",
    borderRadius: "30px",
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
  command: {
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
}));

export default function Content() {
  const classes = useStyles();
  const [expand, setExpand] = useState(false);
  const [value, setValue] = useState("");
  return (
    <Grid container className={classes.gird} justify="center">
      <Grid item xs={10}>
        <Card className={classes.root}>
          <CardMedia
            className={classes.cover}
            image="pictures/test.png"
            title="Live from space album cover"
          />
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography component="h5" variant="h5">
                Author
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                This is a cat
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
              <div className={classes.command}>
                <CommandBox author="author" command="Cute cat." />
              </div>
              <form
                className={classes.command}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (value) alert(value);
                  setValue("");
                }}
              >
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
      </Grid>
    </Grid>
  );
}

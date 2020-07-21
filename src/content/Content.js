import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import clsx from "clsx";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  IconButton,
  Collapse,
  Grid,
  TextareaAutosize,
  Button,
  Icon,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  gird: {
    flexGrow: 1,
  },
  root: {
    display: "flex",
    height: 600,
  },
  details: {
    display: "flex",
    flexDirection: "column",
    width: "50%",
  },
  content: {
    width: "30%",
  },
  cover: {
    height: "100%",
    width: "50%",
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  command: {
    marginLeft: "5%",
    width: "90%",
    display: "flex",
  },
  input: {
    resize: "none",
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
            <IconButton
              onClick={() => {
                setExpand(!expand);
              }}
              className={clsx(classes.expand, {
                [classes.expandOpen]: expand,
              })}
            >
              <ExpandMoreIcon />
            </IconButton>
            <Collapse in={expand}>
              <div className={classes.command}>Command</div>
              <form
                className={classes.command}
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(value);
                  setValue("");
                }}
              >
                <TextareaAutosize
                  id="standard-basic"
                  className={classes.input}
                  rowsMin={2}
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

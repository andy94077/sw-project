import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  central: {
    display: "block",
    margin: "auto",
    width: "70%",
    [theme.breakpoints.down("sm")]: {
      width: "95%",
    },
  },
  center: {
    textAlign: "center",
  },
  text: {
    lineHeight: "25px",
    fontSize: "16px",
  },
  paper: {
    padding: "10px",
    paddingTop: "50px",
    paddingBottom: "50px",
    marginTop: "100px",
  },
}));

export default function ErrorGrid(props) {
  const { mes } = props;
  const classes = useStyles();

  return (
    <Paper variant="outlined" className={`${classes.central} ${classes.paper}`}>
      <Typography variant="h4" gutterBottom className={classes.center}>
        Error: {mes} does not exist
      </Typography>
      <Link to="/home">
        <Button
          variant="contained"
          className={`${classes.central} ${classes.text}`}
        >
          Back to homepage
        </Button>
      </Link>
    </Paper>
  );
}

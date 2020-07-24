import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Grid } from "@material-ui/core";

import PhotoGrid from "../components/PhotoGrid";
import ContentCard from "./ContentCard";

const useStyles = makeStyles(() => ({
  gird: {
    flexGrow: 1,
  },
}));

export default function Content(props) {
  const { imageList, jump } = props;
  const classes = useStyles();
  return (
    <Grid container className={classes.gird} justify="center">
      <Grid item xs={9}>
        <ContentCard jump={jump} />
      </Grid>
      <Grid item xs={10}>
        <PhotoGrid imageList={imageList} />
      </Grid>
    </Grid>
  );
}

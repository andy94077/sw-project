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

export default function Content({ match }) {
  const { pictureId } = match.params;
  const classes = useStyles();
  return (
    <Grid container className={classes.gird} justify="center">
      <Grid item xs={9}>
        <ContentCard src={`/images/${pictureId}.jpg`} />
      </Grid>
      <Grid item xs={10}>
        <PhotoGrid
          imageList={Array.from({ length: 12 }, (_, i) => `${i + 1}`)}
        />
      </Grid>
    </Grid>
  );
}

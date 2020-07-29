import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Grid } from "@material-ui/core";

import Axios from "axios";
import PhotoGrid from "../components/PhotoGrid";
import ContentCard from "./ContentCard";
import Bar from "../Bar/Bar";

const useStyles = makeStyles(() => ({
  gird: {
    flexGrow: 1,
  },
}));

export default function Content({ match }) {
  const { pictureId } = match.params;
  const classes = useStyles();
  const [info, setInfo] = useState({
    authorName: "",
    src: "",
    content: "",
  });
  console.log(pictureId);
  useEffect(() => {
    Axios.get(`http://pinterest-server.test/api/v1/post/${pictureId}`).then(
      ({ data }) => {
        console.log(data);
        setInfo({
          authorName: data[0].user_name,
          src: data[0].url,
          content: data[0].content,
        });
      }
    );
  }, [pictureId]);

  return (
    <>
      <Bar />
      <Grid container className={classes.gird} justify="center">
        <Grid item xs={9}>
          <ContentCard
            id={pictureId}
            src={info.src}
            author={info.authorName}
            content={info.content}
          />
        </Grid>
        <Grid item xs={10}>
          <PhotoGrid />
        </Grid>
      </Grid>
    </>
  );
}

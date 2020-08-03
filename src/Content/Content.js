import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Grid } from "@material-ui/core";

import Axios from "axios";
import PhotoGrid from "../components/PhotoGrid";
import ContentCard from "./ContentCard";
import Loading from "../components/Loading";
import ErrorGrid from "../components/ErrorGrid";
import { CONCAT_SERVER_URL } from "../constants";

const useStyles = makeStyles(() => ({
  gird: {
    flexGrow: 1,
  },
}));

export default function Content(props) {
  const {
    userId,
    match: {
      params: { pictureId },
    },
  } = props;
  const classes = useStyles();
  const [info, setInfo] = useState({
    authorName: "",
    src: "",
    content: "",
  });
  const [pageState, setPageState] = useState("Loading");
  useEffect(() => {
    const { CancelToken } = Axios;
    const source = CancelToken.source();
    setPageState("Loading");

    Axios.get(CONCAT_SERVER_URL("/api/v1/post/id"), {
      params: { id: pictureId },
    })
      .then((res) => {
        setInfo({
          authorName: res.data[0].user_name,
          src: CONCAT_SERVER_URL(res.data[0].url),
          content: res.data[0].content,
        });
        setPageState("Done");
      })
      .catch((e) => {
        console.log(e);
        setPageState("invalid");
      });
    return source.cancel();
  }, [pictureId]);
  if (pageState === "Loading") {
    return <Loading />;
  }
  if (pageState === "invalid") {
    return <ErrorGrid mes="picture" />;
  }

  if (pageState === "Done") {
    return (
      <>
        <Grid container className={classes.gird} justify="center">
          <Grid item xs={11} sm={9} md={9}>
            <ContentCard
              id={pictureId}
              src={info.src}
              author={info.authorName}
              content={info.content}
              userId={userId}
            />
          </Grid>
          <Grid item xs={12} sm={11} md={10}>
            <PhotoGrid />
          </Grid>
        </Grid>
      </>
    );
  }
  return <>Wrong</>;
}

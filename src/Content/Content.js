import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";

import { Grid } from "@material-ui/core";

import Axios from "axios";
import PhotoGrid from "../components/PhotoGrid";
import ContentCard from "./ContentCard";
import Bar from "../Bar/Bar";
import Loading from "../components/Loading";

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

    Axios.get("http://pinterest-server.test/api/v1/post/id", {
      params: { id: pictureId },
    })
      .then((res) => {
        setInfo({
          authorName: res.data[0].user_name,
          src: res.data[0].url,
          content: res.data[0].content,
        });
        setPageState("Done");
      })
      .catch((e) => {
        console.log(e);
      });
    return source.cancel();
  }, [pictureId]);
  if (pageState === "Loading") {
    return <Loading />;
  }
  if (pageState === "invalid") {
    return <Redirect to="/" />;
  }
  if (pageState === "Done") {
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
              userId={userId}
            />
          </Grid>
          <Grid item xs={10}>
            <PhotoGrid />
          </Grid>
        </Grid>
      </>
    );
  }
  return <>Wrong</>;
}

import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";

import { Grid } from "@material-ui/core";

import Axios from "axios";
import PhotoGrid from "../components/PhotoGrid";
import ContentCard from "./ContentCard";
import Bar from "../Bar/Bar";
import Loading from "../components/Loading";
import getCookie from "../cookieHelper";

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
  const [pageState, setPageState] = useState(0);
  const accessToken = getCookie();

  useEffect(() => {
    setPageState(0);
    Axios.request({
      method: "POST",
      url: "http://pinterest-server.test/api/v1/user/authentication",
      date: {
        accessToken: { accessToken },
      },
    })
      .then(({ data }) => {
        const { isValid } = data;
        console.log(isValid);
        if (!isValid) {
          setPageState(1);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [pictureId]);

  useEffect(() => {
    if (pageState === 0) {
      Axios.get(`http://pinterest-server.test/api/v1/post/${pictureId}`).then(
        ({ data }) => {
          setInfo({
            authorName: data[0].user_name,
            src: data[0].url,
            content: data[0].content,
          });
        }
      );
      setPageState(2);
    }
  }, [pageState]);

  if (pageState === 0) {
    return <Loading />;
  }
  if (pageState === 1) {
    return <Redirect to="/" />;
  }
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

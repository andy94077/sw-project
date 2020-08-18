import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";

import { Grid } from "@material-ui/core";

import { formatDistanceToNow, addHours, compareAsc } from "date-fns";
import Axios from "axios";
import PhotoGrid from "../components/PhotoGrid";
import ContentCard from "./ContentCard";
import ErrorMsg from "../components/ErrorMsg";
import Loading from "../components/Loading";
import ErrorGrid from "../components/ErrorGrid";
import { CONCAT_SERVER_URL } from "../utils";
import { selectUser } from "../redux/userSlice";

const useStyles = makeStyles(() => ({
  gird: {
    flexGrow: 1,
  },
}));

function checkBucket(bucketTime) {
  if (bucketTime) {
    const bucketDate = addHours(new Date(bucketTime), 8);
    const now = new Date();
    if (compareAsc(bucketDate, now) === 1) {
      return true;
    }
  }
  return false;
}

export default function Content(props) {
  const {
    match: {
      params: { pictureId },
    },
  } = props;
  const classes = useStyles();
  const [info, setInfo] = useState({
    authorName: "",
    src: "",
    content: "",
    timeAgo: "",
  });
  const [pageState, setPageState] = useState("Loading");
  const [error, setError] = useState({ message: "", url: "" });
  const { bucketTime } = useSelector(selectUser);

  const isBucket = checkBucket(bucketTime);
  async function refresh() {
    setPageState("Loading");
    setError({ message: "", url: "" });
    Axios.get(CONCAT_SERVER_URL("/api/v1/post/id"), {
      params: { id: pictureId },
    })
      .then((res) => {
        if (res.data.length === 0) {
          throw new Error("Post not found");
        }
        setInfo({
          authorName: res.data.username,
          src: CONCAT_SERVER_URL(res.data.url),
          content: res.data.content,
          timeAgo: formatDistanceToNow(new Date(res.data.created_at)),
        });
        setError({ message: "", url: "" });
        setPageState("Done");
      })
      .catch((e) => {
        if (e.message === "Network Error") {
          setError({
            message: "Connection Error",
            url: "/pictures/connection-error.svg",
          });
        } else {
          setPageState("invalid");
        }
      });
  }

  useEffect(() => {
    document.title = `賭ケグルイ-写真No.${pictureId}-`;
  });

  useEffect(() => {
    const { CancelToken } = Axios;
    const source = CancelToken.source();
    refresh();
    return source.cancel();
  }, [pictureId]);

  if (pageState === "invalid") {
    return <ErrorGrid mes="picture" />;
  }

  if (error.message !== "") {
    return <ErrorMsg message={error.message} imgUrl={error.url} />;
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
              timeAgo={info.timeAgo}
              content={info.content}
              refresh={refresh}
              isBucket={isBucket}
            />
          </Grid>
          <Grid item xs={12} sm={11} md={10}>
            <PhotoGrid showError={false} />
          </Grid>
        </Grid>
      </>
    );
  }
  return <Loading />;
}
